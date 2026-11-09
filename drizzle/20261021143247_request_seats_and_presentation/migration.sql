ALTER TABLE "committee" ADD COLUMN "presentation_show_requests" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN "committee_member_id" text;--> statement-breakpoint
ALTER TABLE "request" ADD COLUMN "conference_member_id" text;--> statement-breakpoint
ALTER TABLE "request_type" ADD COLUMN "show_on_presentation" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "request" ALTER COLUMN "conference_user_id" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "request_pending_committee_member_unique" ON "request" ("committee_id","committee_member_id","request_type_id") WHERE "status" = 'PENDING';--> statement-breakpoint
CREATE UNIQUE INDEX "request_pending_conference_member_unique" ON "request" ("committee_id","conference_member_id","request_type_id") WHERE "status" = 'PENDING';--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_committee_member_id_committee_member_id_fkey" FOREIGN KEY ("committee_member_id") REFERENCES "committee_member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_conference_member_id_conference_member_id_fkey" FOREIGN KEY ("conference_member_id") REFERENCES "conference_member"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_has_requester" CHECK (num_nonnulls("conference_user_id", "committee_member_id", "conference_member_id") >= 1);