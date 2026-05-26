CREATE TYPE "presence_event_marker" AS ENUM('AUTO_SWITCH');--> statement-breakpoint
CREATE TYPE "presence_event_type" AS ENUM('CHECK_IN', 'CHECK_OUT');--> statement-breakpoint
CREATE TABLE "presence_event" (
	"id" text PRIMARY KEY,
	"conference_user_id" text NOT NULL,
	"committee_id" text NOT NULL,
	"triggered_by_conference_user_id" text,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"event_type" "presence_event_type" NOT NULL,
	"marker" "presence_event_marker",
	"note" text
);
--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_conference_user_id_conference_user_id_fkey" FOREIGN KEY ("conference_user_id") REFERENCES "conference_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "presence_event" ADD CONSTRAINT "presence_event_xznprRrYgWYA_fkey" FOREIGN KEY ("triggered_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;
--> statement-breakpoint
-- Migrate NSA presence events; 'AUTO_SWITCH' notes become typed markers, other notes stay as free text
INSERT INTO "presence_event" ("id", "conference_user_id", "committee_id", "triggered_by_conference_user_id", "timestamp", "event_type", "marker", "note")
SELECT
    id,
    conference_user_id,
    committee_id,
    triggered_by_conference_user_id,
    "timestamp",
    type::text::"presence_event_type",
    CASE WHEN note = 'AUTO_SWITCH' THEN 'AUTO_SWITCH'::"presence_event_marker" ELSE NULL END,
    CASE WHEN note = 'AUTO_SWITCH' THEN NULL ELSE note END
FROM "nsa_presence_event";
--> statement-breakpoint
-- Migrate delegate presence flips; derive conference_user and committee via committee_member
INSERT INTO "presence_event" ("id", "conference_user_id", "committee_id", "triggered_by_conference_user_id", "timestamp", "event_type", "marker", "note")
SELECT
    pct.id,
    cu.id,
    cm.committee_id,
    NULL,
    pct."timestamp",
    CASE WHEN pct.present_set_to THEN 'CHECK_IN'::"presence_event_type" ELSE 'CHECK_OUT'::"presence_event_type" END,
    NULL,
    NULL
FROM "presence_changed_timestamp" pct
JOIN "committee_member" cm ON cm.id = pct.committee_member_id
JOIN "conference_user" cu ON cu.committee_member_id = pct.committee_member_id;