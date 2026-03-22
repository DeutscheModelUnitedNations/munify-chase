CREATE TABLE "spoken_time_period" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_member_id" text,
	"conference_member_id" text,
	"speakers_list_id" text NOT NULL,
	"start_timestamp" timestamp NOT NULL,
	"end_timestamp" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "last_resolution_adoption_date" timestamp;--> statement-breakpoint
ALTER TABLE "spoken_time_period" ADD CONSTRAINT "spoken_time_period_committee_member_id_committee_member_id_fk" FOREIGN KEY ("committee_member_id") REFERENCES "public"."committee_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spoken_time_period" ADD CONSTRAINT "spoken_time_period_conference_member_id_conference_member_id_fk" FOREIGN KEY ("conference_member_id") REFERENCES "public"."conference_member"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "spoken_time_period" ADD CONSTRAINT "spoken_time_period_speakers_list_id_speakers_list_id_fk" FOREIGN KEY ("speakers_list_id") REFERENCES "public"."speakers_list"("id") ON DELETE cascade ON UPDATE no action;