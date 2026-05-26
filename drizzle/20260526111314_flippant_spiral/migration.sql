ALTER TYPE "vote_outcome" RENAME TO "paper_vote_outcome";--> statement-breakpoint
ALTER TABLE "nsa_presence_event" DROP CONSTRAINT "nsa_presence_event_conference_id_conference_id_fkey";--> statement-breakpoint
DROP INDEX "nsa_presence_event_conference_ts_idx";--> statement-breakpoint
ALTER TABLE "nsa_presence_event" DROP COLUMN "conference_id";--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_id_user_email_unique" UNIQUE("conference_id","user_email");--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_user_email_key" UNIQUE("user_email");