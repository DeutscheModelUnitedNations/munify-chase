ALTER TABLE "amendment" DROP CONSTRAINT "amendment_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "amendment_sponsor" DROP CONSTRAINT "amendment_sponsor_amendment_id_amendment_id_fk";--> statement-breakpoint
ALTER TABLE "committee" DROP CONSTRAINT "committee_active_draft_resolution_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "committee" DROP CONSTRAINT "committee_active_amendment_id_amendment_id_fk";--> statement-breakpoint
ALTER TABLE "nsa_presence_event" DROP CONSTRAINT "nsa_presence_event_conference_id_conference_id_fkey";--> statement-breakpoint
ALTER TABLE "operative_clause_vote" DROP CONSTRAINT "operative_clause_vote_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "paper_content_snapshot" DROP CONSTRAINT "paper_content_snapshot_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "paper_editor" DROP CONSTRAINT "paper_editor_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "paper_share_code" DROP CONSTRAINT "paper_share_code_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "paper_sponsor" DROP CONSTRAINT "paper_sponsor_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "paper_yjs_doc" DROP CONSTRAINT IF EXISTS "paper_yjs_doc_paper_id_resolution_paper_id_fkey";--> statement-breakpoint
ALTER TABLE "resolution_comment" DROP CONSTRAINT "resolution_comment_paper_id_resolution_paper_id_fk";--> statement-breakpoint
ALTER TABLE "resolution_vote_result" DROP CONSTRAINT "resolution_vote_result_paper_id_resolution_paper_id_fk";--> statement-breakpoint
DROP TABLE "amendment";--> statement-breakpoint
DROP TABLE "amendment_sponsor";--> statement-breakpoint
DROP TABLE "operative_clause_vote";--> statement-breakpoint
DROP TABLE "paper_content_snapshot";--> statement-breakpoint
DROP TABLE "paper_editor";--> statement-breakpoint
DROP TABLE "paper_share_code";--> statement-breakpoint
DROP TABLE "paper_sponsor";--> statement-breakpoint
DROP TABLE "paper_yjs_doc";--> statement-breakpoint
DROP TABLE "resolution_comment";--> statement-breakpoint
DROP TABLE "resolution_paper";--> statement-breakpoint
DROP TABLE "resolution_vote_result";--> statement-breakpoint
DROP INDEX "nsa_presence_event_conference_ts_idx";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "custom_paper_support_threshold";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "last_resolution_adoption_date";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "max_draft_resolutions";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "active_draft_resolution_id";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "current_operative_index";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "current_operative_clause_id";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "support_re_evaluation_open";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "amendment_submission_open";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "amendment_sponsoring_open";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "active_amendment_id";--> statement-breakpoint
ALTER TABLE "committee" DROP COLUMN "resolution_headline";--> statement-breakpoint
ALTER TABLE "conference" DROP COLUMN "resolution_feature_enabled";--> statement-breakpoint
ALTER TABLE "nsa_presence_event" DROP COLUMN "conference_id";--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_id_user_email_unique" UNIQUE("conference_id","user_email");--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_user_email_key" UNIQUE("user_email");--> statement-breakpoint
DROP TYPE "amendment_status";--> statement-breakpoint
DROP TYPE "amendment_type";--> statement-breakpoint
DROP TYPE "comment_visibility";--> statement-breakpoint
DROP TYPE "paper_status";--> statement-breakpoint
DROP TYPE "share_code_permission";--> statement-breakpoint
DROP TYPE "vote_outcome";