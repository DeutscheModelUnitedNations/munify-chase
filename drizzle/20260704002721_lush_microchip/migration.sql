CREATE TYPE "amendment_review_phase" AS ENUM('OBSOLESCENCE', 'REWRITE', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "presence_event_marker" AS ENUM('AUTO_SWITCH', 'ROLL_CALL', 'NSA_SCAN', 'MANUAL');--> statement-breakpoint
CREATE TYPE "snapshot_trigger" AS ENUM('SUBMITTED', 'AMENDMENT_APPLIED', 'VOTE_CONCLUDED', 'MANUAL');--> statement-breakpoint
CREATE TYPE "speakers_list_phase" AS ENUM('SPEECH', 'SPEECH_DONE', 'QUESTION', 'ANSWER', 'ANSWER_DONE');--> statement-breakpoint
CREATE TYPE "vote_choice" AS ENUM('PRO', 'CON', 'ABSTAIN');--> statement-breakpoint
CREATE TYPE "voting_majority_type" AS ENUM('SIMPLE', 'ABSOLUTE', 'TWO_THIRDS');--> statement-breakpoint
CREATE TYPE "voting_mode" AS ENUM('SHOW_OF_HANDS', 'ROLL_CALL');--> statement-breakpoint
CREATE TYPE "voting_outcome" AS ENUM('ADOPTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "voting_stage" AS ENUM('PRO', 'CON', 'ABSTAIN', 'EVALUATION');--> statement-breakpoint
CREATE TABLE "amendment_review_item" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"trigger_amendment_id" text NOT NULL,
	"subject_amendment_id" text NOT NULL,
	"phase" "amendment_review_phase" NOT NULL,
	"ai_obsolete" boolean,
	"ai_rewrite_suggestion" text,
	"verdict_obsolete" boolean,
	"verdict_rewrite" text
);
--> statement-breakpoint
CREATE TABLE "presence_event" (
	"id" text PRIMARY KEY,
	"conference_user_id" text NOT NULL,
	"committee_id" text NOT NULL,
	"triggered_by_conference_user_id" text,
	"roll_call_session_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"present" boolean NOT NULL,
	"type" "presence_event_marker" NOT NULL,
	"note" text
);
--> statement-breakpoint
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
ALTER TABLE "committee" DROP CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "committee" RENAME COLUMN "support_re_evaluation_open" TO "support_reevaluation_open";--> statement-breakpoint
ALTER TABLE "committee" RENAME COLUMN "custom_paper_support_threshold" TO "paper_support_threshold";--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "old_content" text;--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "presented_at" timestamp;--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "obsoleted_by_amendment_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_roll_call_session_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_voting_session_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_layout" text DEFAULT 'default' NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_root_font_size" smallint DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "presentation_resolution_font_size" smallint DEFAULT 16 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "display_regional_groups" boolean DEFAULT false NOT NULL;--> statement-breakpoint
-- hand-edited: added as nullable first so existing rows survive; backfilled below, then SET NOT NULL
ALTER TABLE "operative_clause_vote" ADD COLUMN "voting_session_id" text;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "vote_voting_session_id" text;--> statement-breakpoint
ALTER TABLE "speakers_list" ADD COLUMN "phase" "speakers_list_phase" DEFAULT 'SPEECH'::"speakers_list_phase" NOT NULL;--> statement-breakpoint
-- ----------------------------------------------------------------------------
-- hand-edited data migration: move rows out of the tables/columns that are
-- dropped further down, before they are dropped.
-- ----------------------------------------------------------------------------
-- NSA check-in/check-out events become NSA_SCAN presence events
-- (CHECK_IN -> present = true, CHECK_OUT -> present = false).
INSERT INTO "presence_event" ("id", "conference_user_id", "committee_id", "triggered_by_conference_user_id", "roll_call_session_id", "timestamp", "present", "type", "note")
SELECT "id", "conference_user_id", "committee_id", "triggered_by_conference_user_id", NULL, "timestamp", ("type" = 'CHECK_IN'), 'NSA_SCAN'::"presence_event_marker", "note"
FROM "nsa_presence_event";--> statement-breakpoint
-- Delegate presence toggles become MANUAL presence events. presence_event
-- requires a conference_user; rows whose committee_member has no linked
-- conference_user cannot be migrated and are skipped.
INSERT INTO "presence_event" ("id", "conference_user_id", "committee_id", "triggered_by_conference_user_id", "roll_call_session_id", "timestamp", "present", "type", "note")
SELECT pct."id", link."conference_user_id", cm."committee_id", NULL, NULL, pct."timestamp", pct."present_set_to", 'MANUAL'::"presence_event_marker", NULL
FROM "presence_changed_timestamp" pct
JOIN "committee_member" cm ON cm."id" = pct."committee_member_id"
JOIN LATERAL (
	SELECT cu."id" AS "conference_user_id"
	FROM "conference_user" cu
	WHERE cu."committee_member_id" = cm."id"
	ORDER BY cu."created_at"
	LIMIT 1
) link ON true;--> statement-breakpoint
-- Final resolution vote results become completed SHOW_OF_HANDS voting sessions
-- (reusing the old row id as session id). majority/majority_amount were not
-- stored in the old model and are reconstructed as a simple majority of the
-- cast pro/con votes. SENT_BACK has no equivalent and is mapped to REJECTED.
INSERT INTO "voting_session" ("id", "created_at", "updated_at", "committee_id", "started_by_conference_user_id", "mode", "vote_name", "majority", "with_abstentions", "majority_amount", "current_stage", "votes_pro", "votes_con", "votes_abstain", "current_member_index", "completed_at", "outcome")
SELECT rvr."id", rvr."created_at", rvr."updated_at", rp."committee_id", NULL, 'SHOW_OF_HANDS', NULL, 'SIMPLE', false, ((rvr."votes_for" + rvr."votes_against") / 2) + 1, NULL, rvr."votes_for", rvr."votes_against", rvr."votes_abstain", 0, COALESCE(rvr."updated_at", rvr."created_at"),
	CASE rvr."outcome"::text WHEN 'ADOPTED' THEN 'ADOPTED'::"voting_outcome" ELSE 'REJECTED'::"voting_outcome" END
FROM "resolution_vote_result" rvr
JOIN "resolution_paper" rp ON rp."id" = rvr."paper_id";--> statement-breakpoint
UPDATE "resolution_paper" rp
SET "vote_voting_session_id" = rvr."id"
FROM "resolution_vote_result" rvr
WHERE rvr."paper_id" = rp."id";--> statement-breakpoint
-- Operative clause vote tallies move onto their own voting sessions
-- (same reconstruction as above, session id = operative_clause_vote id).
INSERT INTO "voting_session" ("id", "created_at", "updated_at", "committee_id", "started_by_conference_user_id", "mode", "vote_name", "majority", "with_abstentions", "majority_amount", "current_stage", "votes_pro", "votes_con", "votes_abstain", "current_member_index", "completed_at", "outcome")
SELECT ocv."id", ocv."created_at", ocv."updated_at", rp."committee_id", NULL, 'SHOW_OF_HANDS', NULL, 'SIMPLE', false, ((ocv."votes_for" + ocv."votes_against") / 2) + 1, NULL, ocv."votes_for", ocv."votes_against", ocv."votes_abstain", 0, COALESCE(ocv."updated_at", ocv."created_at"),
	CASE ocv."outcome"::text WHEN 'ADOPTED' THEN 'ADOPTED'::"voting_outcome" ELSE 'REJECTED'::"voting_outcome" END
FROM "operative_clause_vote" ocv
JOIN "resolution_paper" rp ON rp."id" = ocv."paper_id";--> statement-breakpoint
UPDATE "operative_clause_vote" SET "voting_session_id" = "id";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" ALTER COLUMN "voting_session_id" SET NOT NULL;--> statement-breakpoint
-- Backfill NULLs before the NOT NULL constraints below.
UPDATE "committee" SET "paper_support_threshold" = 10 WHERE "paper_support_threshold" IS NULL;--> statement-breakpoint
UPDATE "committee" SET "current_operative_index" = 0 WHERE "current_operative_index" IS NULL;--> statement-breakpoint
-- ----------------------------------------------------------------------------
-- end of hand-edited data migration
-- ----------------------------------------------------------------------------
DROP TABLE "nsa_presence_event";--> statement-breakpoint
DROP TABLE "presence_changed_timestamp";--> statement-breakpoint
DROP TABLE "resolution_vote_result";--> statement-breakpoint
ALTER TABLE "amendment" DROP COLUMN "sequence_number";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "max_draft_resolutions";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "current_operative_clause_id";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "resolution_headline";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "outcome";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "votes_for";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "votes_against";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP COLUMN "votes_abstain";--> statement-breakpoint
ALTER TABLE "resolution_paper" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "resolution_paper" DROP COLUMN "sequence_number";--> statement-breakpoint
ALTER TABLE "resolution_paper" DROP COLUMN "deleted_at";--> statement-breakpoint
ALTER TABLE "conference" DROP COLUMN "resolution_feature_enabled";--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "paper_support_threshold" SET DEFAULT 10;--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "paper_support_threshold" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "current_operative_index" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "committee" ALTER COLUMN "current_operative_index" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "content" SET DATA TYPE text USING "content"::text;--> statement-breakpoint
-- hand-edited: snapshots without content would violate NOT NULL; keep the rows
UPDATE "paper_content_snapshot" SET "content" = '{}' WHERE "content" IS NULL;--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
-- hand-edited: old trigger was free text; map known values, everything else (incl. NULL) to MANUAL
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "trigger" SET DATA TYPE "snapshot_trigger" USING (
	CASE "trigger"
		WHEN 'SUBMITTED' THEN 'SUBMITTED'
		WHEN 'AMENDMENT_APPLIED' THEN 'AMENDMENT_APPLIED'
		WHEN 'VOTE_CONCLUDED' THEN 'VOTE_CONCLUDED'
		ELSE 'MANUAL'
	END
)::"snapshot_trigger";--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" ALTER COLUMN "trigger" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_id_user_email_unique" UNIQUE("conference_id","user_email");--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_obsoleted_by_amendment_id_amendment_id_fkey" FOREIGN KEY ("obsoleted_by_amendment_id") REFERENCES "amendment"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_trigger_amendment_id_amendment_id_fkey" FOREIGN KEY ("trigger_amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_subject_amendment_id_amendment_id_fkey" FOREIGN KEY ("subject_amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_roll_call_session_id_roll_call_session_id_fkey" FOREIGN KEY ("active_roll_call_session_id") REFERENCES "roll_call_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("active_voting_session_id") REFERENCES "voting_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fkey" FOREIGN KEY ("active_draft_resolution_id") REFERENCES "resolution_paper"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "operative_clause_vote" ADD CONSTRAINT "operative_clause_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("voting_session_id") REFERENCES "voting_session"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_conference_user_id_conference_user_id_fkey" FOREIGN KEY ("conference_user_id") REFERENCES "conference_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_xznprRrYgWYA_fkey" FOREIGN KEY ("triggered_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_roll_call_session_id_roll_call_session_id_fkey" FOREIGN KEY ("roll_call_session_id") REFERENCES "roll_call_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("vote_voting_session_id") REFERENCES "voting_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "roll_call_session" ADD CONSTRAINT "roll_call_session_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "roll_call_session" ADD CONSTRAINT "roll_call_session_J2lptyrzjtLx_fkey" FOREIGN KEY ("started_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "voting_session" ADD CONSTRAINT "voting_session_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "voting_session" ADD CONSTRAINT "voting_session_CFZOAYRJVkye_fkey" FOREIGN KEY ("started_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "voting_vote" ADD CONSTRAINT "voting_vote_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("voting_session_id") REFERENCES "voting_session"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "voting_vote" ADD CONSTRAINT "voting_vote_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;--> statement-breakpoint
DROP TYPE "nsa_presence_event_type";--> statement-breakpoint
DROP TYPE "vote_outcome";
