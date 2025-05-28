CREATE TABLE "presence_changed_timestamp" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_member_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"present_set_to" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "presence_changed_timestamp" ADD CONSTRAINT "presence_changed_timestamp_committee_member_id_committee_member_id_fk" FOREIGN KEY ("committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;