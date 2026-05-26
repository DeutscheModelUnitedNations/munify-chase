ALTER TABLE "presence_event" DROP CONSTRAINT "presence_event_committee_member_id_committee_member_id_fkey";--> statement-breakpoint
ALTER TABLE "presence_event" DROP COLUMN "committee_member_id";--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "conference_user_id" SET NOT NULL;