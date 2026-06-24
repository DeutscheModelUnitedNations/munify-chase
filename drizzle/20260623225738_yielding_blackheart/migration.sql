CREATE TYPE "snapshot_trigger" AS ENUM('SUBMITTED', 'AMENDMENT_APPLIED', 'VOTE_CONCLUDED', 'MANUAL');--> statement-breakpoint
CREATE TYPE "speakers_list_phase" AS ENUM('SPEECH', 'SPEECH_DONE', 'QUESTION', 'ANSWER', 'ANSWER_DONE');--> statement-breakpoint
CREATE TYPE "vote_choice" AS ENUM('PRO', 'CON', 'ABSTAIN');--> statement-breakpoint
CREATE TYPE "voting_majority_type" AS ENUM('SIMPLE', 'ABSOLUTE', 'TWO_THIRDS');--> statement-breakpoint
CREATE TYPE "voting_mode" AS ENUM('SHOW_OF_HANDS', 'ROLL_CALL');--> statement-breakpoint
CREATE TYPE "voting_stage" AS ENUM('PRO', 'CON', 'ABSTAIN', 'EVALUATION');--> statement-breakpoint
ALTER TYPE "nsa_presence_event_type" RENAME TO "presence_event_marker";--> statement-breakpoint
ALTER TYPE "vote_outcome" RENAME TO "voting_outcome";--> statement-breakpoint
CREATE TABLE "roll_call_session" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_id" text NOT NULL,
	"started_by_conference_user_id" text,
	"current_member_index" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
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
ALTER TABLE "nsa_presence_event" RENAME TO "presence_event";--> statement-breakpoint
ALTER TABLE "committee" DROP CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "presence_event" DROP CONSTRAINT "nsa_presence_event_conference_id_conference_id_fkey";--> statement-breakpoint
DROP TABLE "presence_changed_timestamp";--> statement-breakpoint
DROP TABLE "resolution_vote_result";--> statement-breakpoint
ALTER TABLE "committee" RENAME COLUMN "support_re_evaluation_open" TO "support_reevaluation_open";--> statement-breakpoint
ALTER TABLE "committee" RENAME COLUMN "custom_paper_support_threshold" TO "paper_support_threshold";--> statement-breakpoint
DROP INDEX "nsa_presence_event_user_ts_idx";--> statement-breakpoint
DROP INDEX "nsa_presence_event_committee_ts_idx";--> statement-breakpoint
DROP INDEX "nsa_presence_event_conference_ts_idx";--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_roll_call_session_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_voting_session_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_layout" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_root_font_size" smallint DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_resolution_font_size" smallint DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "display_regional_groups" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "operative_clause_vote" ADD COLUMN "voting_session_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "presence_event" ADD COLUMN "roll_call_session_id" text;--> statement-breakpoint
ALTER TABLE "presence_event" ADD COLUMN "present" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "vote_voting_session_id" text;--> statement-breakpoint
ALTER TABLE "speakers_list" ADD COLUMN "phase" "speakers_list_phase" DEFAULT 'SPEECH'::"speakers_list_phase" NOT NULL;--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "presence_event_marker";--> statement-breakpoint
CREATE TYPE "presence_event_marker" AS ENUM('AUTO_SWITCH', 'ROLL_CALL', 'NSA_SCAN', 'MANUAL');--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "type" SET DATA TYPE "presence_event_marker" USING "type"::"presence_event_marker";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "outcome";--> statement-breakpoint
ALTER TABLE "voting_session" ALTER COLUMN "outcome" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "voting_outcome";--> statement-breakpoint
CREATE TYPE "voting_outcome" AS ENUM('ADOPTED', 'REJECTED');--> statement-breakpoint
ALTER TABLE "voting_session" ALTER COLUMN "outcome" SET DATA TYPE "voting_outcome" USING "outcome"::"voting_outcome";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "max_draft_resolutions";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "current_operative_clause_id";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "resolution_headline";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "votes_for";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "votes_against";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "votes_abstain";--> statement-breakpoint
ALTER TABLE "presence_event" DROP COLUMN "created_at";--> statement-breakpoint
ALTER TABLE "presence_event" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "presence_event" DROP COLUMN "conference_id";--> statement-breakpoint
ALTER TABLE "resolution_paper" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "resolution_paper" DROP COLUMN "sequence_number";--> statement-breakpoint
ALTER TABLE "resolution_paper" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "amendment" DROP COLUMN "sequence_number";--> statement-breakpoint
ALTER TABLE "conference" DROP COLUMN "resolution_feature_enabled";--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "paper_support_threshold" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "paper_support_threshold" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "current_operative_index" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "current_operative_index" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "timestamp" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "content" SET DATA TYPE text USING "content"::text;--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "trigger" SET DATA TYPE "snapshot_trigger" USING "trigger"::"snapshot_trigger";--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "trigger" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_id_user_email_unique" UNIQUE("conference_id","user_email");--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_user_email_key" UNIQUE("user_email");--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_roll_call_session_id_roll_call_session_id_fkey" FOREIGN KEY ("active_roll_call_session_id") REFERENCES "roll_call_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("active_voting_session_id") REFERENCES "voting_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fkey" FOREIGN KEY ("active_draft_resolution_id") REFERENCES "resolution_paper"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "operative_clause_vote" ADD CONSTRAINT "operative_clause_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("voting_session_id") REFERENCES "voting_session"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_roll_call_session_id_roll_call_session_id_fkey" FOREIGN KEY ("roll_call_session_id") REFERENCES "roll_call_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("vote_voting_session_id") REFERENCES "voting_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "roll_call_session" ADD CONSTRAINT "roll_call_session_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "roll_call_session" ADD CONSTRAINT "roll_call_session_J2lptyrzjtLx_fkey" FOREIGN KEY ("started_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "voting_session" ADD CONSTRAINT "voting_session_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "voting_session" ADD CONSTRAINT "voting_session_CFZOAYRJVkye_fkey" FOREIGN KEY ("started_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "voting_vote" ADD CONSTRAINT "voting_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("voting_session_id") REFERENCES "voting_session"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "voting_vote" ADD CONSTRAINT "voting_vote_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;