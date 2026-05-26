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
ALTER TABLE "roll_call_session" ADD CONSTRAINT "roll_call_session_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "roll_call_session" ADD CONSTRAINT "roll_call_session_J2lptyrzjtLx_fkey" FOREIGN KEY ("started_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;