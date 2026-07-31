CREATE TABLE "display_device" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"name" text,
	"revoked" boolean DEFAULT false NOT NULL,
	"conference_id" text,
	"committee_id" text,
	"last_seen_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "display_device" ADD CONSTRAINT "display_device_conference_id_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "display_device" ADD CONSTRAINT "display_device_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE SET NULL;