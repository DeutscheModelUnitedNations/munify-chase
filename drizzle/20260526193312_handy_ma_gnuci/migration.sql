CREATE TYPE "vote_choice" AS ENUM('PRO', 'CON', 'ABSTAIN');--> statement-breakpoint
CREATE TYPE "voting_majority_type" AS ENUM('SIMPLE', 'ABSOLUTE', 'TWO_THIRDS');--> statement-breakpoint
CREATE TYPE "voting_mode" AS ENUM('SHOW_OF_HANDS', 'ROLL_CALL');--> statement-breakpoint
CREATE TYPE "voting_outcome" AS ENUM('ADOPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "voting_stage" AS ENUM('PRO', 'CON', 'ABSTAIN', 'EVALUATION');--> statement-breakpoint
CREATE TABLE "voting_session" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_id" text NOT NULL,
	"started_by_conference_user_id" text,
	"mode" "voting_mode" NOT NULL,
	"vote_name" text,
	"majority" "voting_majority_type" NOT NULL,
	"with_abstentions" boolean DEFAULT false NOT NULL,
	"majority_amount" integer NOT NULL,
	"current_stage" "voting_stage",
	"votes_pro" integer DEFAULT 0 NOT NULL,
	"votes_con" integer DEFAULT 0 NOT NULL,
	"votes_abstain" integer DEFAULT 0 NOT NULL,
	"current_member_index" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	"outcome" "voting_outcome"
);
--> statement-breakpoint
CREATE TABLE "voting_vote" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"voting_session_id" text NOT NULL,
	"committee_member_id" text NOT NULL,
	"vote" "vote_choice" NOT NULL,
	CONSTRAINT "voting_vote_voting_session_id_committee_member_id_unique" UNIQUE("voting_session_id","committee_member_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "voting_session_active_unique" ON "voting_session" ("committee_id") WHERE "completed_at" IS NULL;--> statement-breakpoint
ALTER TABLE "voting_session" ADD CONSTRAINT "voting_session_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "voting_session" ADD CONSTRAINT "voting_session_CFZOAYRJVkye_fkey" FOREIGN KEY ("started_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "voting_vote" ADD CONSTRAINT "voting_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("voting_session_id") REFERENCES "voting_session"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "voting_vote" ADD CONSTRAINT "voting_vote_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;