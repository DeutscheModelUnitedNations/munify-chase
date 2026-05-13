CREATE TYPE "nsa_presence_event_type" AS ENUM('CHECK_IN', 'CHECK_OUT');--> statement-breakpoint
CREATE TABLE "nsa_presence_event" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"conference_user_id" text NOT NULL,
	"committee_id" text NOT NULL,
	"conference_id" text NOT NULL,
	"type" "nsa_presence_event_type" NOT NULL,
	"timestamp" timestamp NOT NULL,
	"triggered_by_conference_user_id" text,
	"note" text
);
--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "attendance_code" text;--> statement-breakpoint
ALTER TABLE "conference_user" ADD CONSTRAINT "conference_user_conference_id_attendance_code_unique" UNIQUE("conference_id","attendance_code");--> statement-breakpoint
CREATE INDEX "nsa_presence_event_user_ts_idx" ON "nsa_presence_event" ("conference_user_id","timestamp" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "nsa_presence_event_committee_ts_idx" ON "nsa_presence_event" ("committee_id","timestamp" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "nsa_presence_event_conference_ts_idx" ON "nsa_presence_event" ("conference_id","timestamp" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "nsa_presence_event" ADD CONSTRAINT "nsa_presence_event_conference_user_id_conference_user_id_fkey" FOREIGN KEY ("conference_user_id") REFERENCES "conference_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "nsa_presence_event" ADD CONSTRAINT "nsa_presence_event_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "nsa_presence_event" ADD CONSTRAINT "nsa_presence_event_conference_id_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "nsa_presence_event" ADD CONSTRAINT "nsa_presence_event_OSeq3jTKWzsp_fkey" FOREIGN KEY ("triggered_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;