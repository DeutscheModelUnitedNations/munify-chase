ALTER TABLE "presence_event" ADD COLUMN "committee_member_id" text;--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "conference_user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;