CREATE TYPE "amendment_status" AS ENUM('PENDING', 'SUBMITTED', 'CONSENSUS_ADOPTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');--> statement-breakpoint
CREATE TYPE "amendment_type" AS ENUM('DELETE', 'ADD', 'ALTER_TEXT', 'ALTER_POSITION');--> statement-breakpoint
CREATE TYPE "comment_visibility" AS ENUM('PUBLIC', 'TEAM_ONLY');--> statement-breakpoint
CREATE TYPE "paper_status" AS ENUM('WORKING_PAPER', 'SUBMITTED', 'DRAFT_RESOLUTION', 'AMENDMENT_PHASE', 'VOTING_PHASE', 'FINAL');--> statement-breakpoint
CREATE TYPE "resolution_vote_outcome" AS ENUM('ADOPTED', 'REJECTED', 'SENT_BACK');--> statement-breakpoint
CREATE TYPE "share_code_permission" AS ENUM('SPONSOR', 'EDIT');--> statement-breakpoint
CREATE TYPE "snapshot_trigger" AS ENUM('SUBMITTED', 'AMENDMENT_APPLIED', 'VOTE_CONCLUDED', 'MANUAL');--> statement-breakpoint
CREATE TABLE "amendment" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"proposer_committee_member_id" text NOT NULL,
	"type" "amendment_type" NOT NULL,
	"status" "amendment_status" DEFAULT 'PENDING'::"amendment_status" NOT NULL,
	"target_clause_id" text,
	"target_operative_index" smallint,
	"new_content" text,
	"target_position" smallint,
	"document_number" text,
	"sequence_number" smallint
);
--> statement-breakpoint
CREATE TABLE "amendment_sponsor" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"amendment_id" text NOT NULL,
	"committee_member_id" text NOT NULL,
	CONSTRAINT "amendment_sponsor_amendment_id_committee_member_id_unique" UNIQUE("amendment_id","committee_member_id")
);
--> statement-breakpoint
CREATE TABLE "operative_clause_vote" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"clause_id" text NOT NULL,
	"outcome" "resolution_vote_outcome" NOT NULL,
	"votes_for" integer DEFAULT 0 NOT NULL,
	"votes_against" integer DEFAULT 0 NOT NULL,
	"votes_abstain" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "operative_clause_vote_paper_id_clause_id_unique" UNIQUE("paper_id","clause_id")
);
--> statement-breakpoint
CREATE TABLE "paper_content_snapshot" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"content" text NOT NULL,
	"trigger" "snapshot_trigger" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paper_editor" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"conference_user_id" text NOT NULL,
	CONSTRAINT "paper_editor_paper_id_conference_user_id_unique" UNIQUE("paper_id","conference_user_id")
);
--> statement-breakpoint
CREATE TABLE "paper_share_code" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"code" text NOT NULL UNIQUE,
	"permission" "share_code_permission" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "paper_sponsor" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"committee_member_id" text NOT NULL,
	CONSTRAINT "paper_sponsor_paper_id_committee_member_id_unique" UNIQUE("paper_id","committee_member_id")
);
--> statement-breakpoint
CREATE TABLE "paper_yjs_doc" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL UNIQUE,
	"state" bytea NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resolution_comment" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"clause_id" text,
	"author_conference_user_id" text NOT NULL,
	"content" text NOT NULL,
	"visibility" "comment_visibility" DEFAULT 'PUBLIC'::"comment_visibility" NOT NULL,
	"parent_comment_id" text
);
--> statement-breakpoint
CREATE TABLE "resolution_paper" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_id" text NOT NULL,
	"agenda_item_id" text NOT NULL,
	"creator_committee_member_id" text NOT NULL,
	"status" "paper_status" DEFAULT 'WORKING_PAPER'::"paper_status" NOT NULL,
	"title" text,
	"document_number" text,
	"sequence_number" smallint,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "resolution_vote_result" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL UNIQUE,
	"outcome" "resolution_vote_outcome" NOT NULL,
	"votes_for" integer DEFAULT 0 NOT NULL,
	"votes_against" integer DEFAULT 0 NOT NULL,
	"votes_abstain" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_draft_resolution_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_amendment_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "support_reevaluation_open" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "amendment_submission_open" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "amendment_sponsoring_open" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "current_operative_index" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_proposer_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("proposer_committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_sponsor" ADD CONSTRAINT "amendment_sponsor_amendment_id_amendment_id_fkey" FOREIGN KEY ("amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_sponsor" ADD CONSTRAINT "amendment_sponsor_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fkey" FOREIGN KEY ("active_draft_resolution_id") REFERENCES "resolution_paper"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_amendment_id_amendment_id_fkey" FOREIGN KEY ("active_amendment_id") REFERENCES "amendment"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "operative_clause_vote" ADD CONSTRAINT "operative_clause_vote_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ADD CONSTRAINT "paper_content_snapshot_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_editor" ADD CONSTRAINT "paper_editor_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_editor" ADD CONSTRAINT "paper_editor_conference_user_id_conference_user_id_fkey" FOREIGN KEY ("conference_user_id") REFERENCES "conference_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_share_code" ADD CONSTRAINT "paper_share_code_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_sponsor" ADD CONSTRAINT "paper_sponsor_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_sponsor" ADD CONSTRAINT "paper_sponsor_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "paper_yjs_doc" ADD CONSTRAINT "paper_yjs_doc_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_comment" ADD CONSTRAINT "resolution_comment_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_comment" ADD CONSTRAINT "resolution_comment_RJcwQhzKkCuw_fkey" FOREIGN KEY ("author_conference_user_id") REFERENCES "conference_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_comment" ADD CONSTRAINT "resolution_comment_parent_comment_id_resolution_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "resolution_comment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_agenda_item_id_agenda_item_id_fkey" FOREIGN KEY ("agenda_item_id") REFERENCES "agenda_item"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_Am25SQ0EdOJE_fkey" FOREIGN KEY ("creator_committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "resolution_vote_result" ADD CONSTRAINT "resolution_vote_result_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;