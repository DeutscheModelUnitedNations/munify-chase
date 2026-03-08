CREATE TYPE "public"."amendment_status" AS ENUM('PENDING', 'SUBMITTED', 'CONSENSUS_ADOPTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');--> statement-breakpoint
CREATE TYPE "public"."amendment_type" AS ENUM('DELETE', 'ADD', 'ALTER_TEXT', 'ALTER_POSITION');--> statement-breakpoint
CREATE TYPE "public"."comment_visibility" AS ENUM('PUBLIC', 'TEAM_ONLY');--> statement-breakpoint
CREATE TYPE "public"."paper_status" AS ENUM('WORKING_PAPER', 'SUBMITTED', 'DRAFT_RESOLUTION', 'AMENDMENT_PHASE', 'VOTING_PHASE', 'FINAL');--> statement-breakpoint
CREATE TYPE "public"."share_code_permission" AS ENUM('SPONSOR', 'EDIT');--> statement-breakpoint
CREATE TYPE "public"."vote_outcome" AS ENUM('ADOPTED', 'REJECTED', 'SENT_BACK');--> statement-breakpoint
CREATE TABLE "amendment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"proposer_committee_member_id" text NOT NULL,
	"type" "amendment_type" NOT NULL,
	"status" "amendment_status" DEFAULT 'PENDING' NOT NULL,
	"target_clause_id" text,
	"target_operative_index" smallint,
	"new_content" json,
	"target_position" smallint,
	"document_number" text,
	"sequence_number" smallint
);
--> statement-breakpoint
CREATE TABLE "amendment_sponsor" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"amendment_id" text NOT NULL,
	"committee_member_id" text NOT NULL,
	CONSTRAINT "amendment_sponsor_amendmentId_committeeMemberId_unique" UNIQUE("amendment_id","committee_member_id")
);
--> statement-breakpoint
CREATE TABLE "operative_clause_vote" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"clause_id" text NOT NULL,
	"outcome" "vote_outcome" NOT NULL,
	"votes_for" integer NOT NULL,
	"votes_against" integer NOT NULL,
	"votes_abstain" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "operative_clause_vote_paperId_clauseId_unique" UNIQUE("paper_id","clause_id")
);
--> statement-breakpoint
CREATE TABLE "paper_clause_lock" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"clause_id" text NOT NULL,
	"conference_user_id" text NOT NULL,
	"acquired_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "paper_clause_lock_paperId_clauseId_unique" UNIQUE("paper_id","clause_id")
);
--> statement-breakpoint
CREATE TABLE "paper_content_snapshot" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"content" json,
	"trigger" text
);
--> statement-breakpoint
CREATE TABLE "paper_editor" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"conference_user_id" text NOT NULL,
	CONSTRAINT "paper_editor_paperId_conferenceUserId_unique" UNIQUE("paper_id","conference_user_id")
);
--> statement-breakpoint
CREATE TABLE "paper_share_code" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"code" text NOT NULL,
	"permission" "share_code_permission" NOT NULL,
	CONSTRAINT "paper_share_code_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "paper_sponsor" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"committee_member_id" text NOT NULL,
	CONSTRAINT "paper_sponsor_paperId_committeeMemberId_unique" UNIQUE("paper_id","committee_member_id")
);
--> statement-breakpoint
CREATE TABLE "resolution_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"clause_id" text,
	"author_conference_user_id" text NOT NULL,
	"content" text NOT NULL,
	"visibility" "comment_visibility" DEFAULT 'PUBLIC' NOT NULL,
	"parent_comment_id" text
);
--> statement-breakpoint
CREATE TABLE "resolution_paper" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_id" text NOT NULL,
	"agenda_item_id" text NOT NULL,
	"creator_committee_member_id" text NOT NULL,
	"status" "paper_status" DEFAULT 'WORKING_PAPER' NOT NULL,
	"content" json,
	"title" text,
	"document_number" text,
	"sequence_number" smallint,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "resolution_vote_result" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"outcome" "vote_outcome" NOT NULL,
	"votes_for" integer NOT NULL,
	"votes_against" integer NOT NULL,
	"votes_abstain" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "resolution_vote_result_paperId_unique" UNIQUE("paper_id")
);
--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "max_draft_resolutions" smallint DEFAULT 3 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_draft_resolution_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "current_operative_index" smallint;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "support_re_evaluation_open" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_amendment_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "resolution_headline" text;--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_proposer_committee_member_id_committee_member_id_fk" FOREIGN KEY ("proposer_committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amendment_sponsor" ADD CONSTRAINT "amendment_sponsor_amendment_id_amendment_id_fk" FOREIGN KEY ("amendment_id") REFERENCES "public"."amendment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amendment_sponsor" ADD CONSTRAINT "amendment_sponsor_committee_member_id_committee_member_id_fk" FOREIGN KEY ("committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "operative_clause_vote" ADD CONSTRAINT "operative_clause_vote_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_clause_lock" ADD CONSTRAINT "paper_clause_lock_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_clause_lock" ADD CONSTRAINT "paper_clause_lock_conference_user_id_conference_user_id_fk" FOREIGN KEY ("conference_user_id") REFERENCES "public"."conference_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ADD CONSTRAINT "paper_content_snapshot_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_editor" ADD CONSTRAINT "paper_editor_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_editor" ADD CONSTRAINT "paper_editor_conference_user_id_conference_user_id_fk" FOREIGN KEY ("conference_user_id") REFERENCES "public"."conference_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_share_code" ADD CONSTRAINT "paper_share_code_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_sponsor" ADD CONSTRAINT "paper_sponsor_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "paper_sponsor" ADD CONSTRAINT "paper_sponsor_committee_member_id_committee_member_id_fk" FOREIGN KEY ("committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_comment" ADD CONSTRAINT "resolution_comment_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_comment" ADD CONSTRAINT "resolution_comment_author_conference_user_id_conference_user_id_fk" FOREIGN KEY ("author_conference_user_id") REFERENCES "public"."conference_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_comment" ADD CONSTRAINT "resolution_comment_parent_comment_id_resolution_comment_id_fk" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."resolution_comment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_committee_id_committee_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_agenda_item_id_agenda_item_id_fk" FOREIGN KEY ("agenda_item_id") REFERENCES "public"."agenda_item"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_creator_committee_member_id_committee_member_id_fk" FOREIGN KEY ("creator_committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resolution_vote_result" ADD CONSTRAINT "resolution_vote_result_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fk" FOREIGN KEY ("active_draft_resolution_id") REFERENCES "public"."resolution_paper"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_amendment_id_amendment_id_fk" FOREIGN KEY ("active_amendment_id") REFERENCES "public"."amendment"("id") ON DELETE set null ON UPDATE no action;