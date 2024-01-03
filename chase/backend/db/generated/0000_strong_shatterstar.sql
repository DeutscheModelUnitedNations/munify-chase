CREATE TABLE IF NOT EXISTS "committees" (
	"id" char(20) PRIMARY KEY NOT NULL,
	"name" varchar,
	"abbreviation" varchar,
	"conference" varchar,
	CONSTRAINT "committees_conference_name_unique" UNIQUE("conference","name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conferences" (
	"id" char(20) PRIMARY KEY NOT NULL,
	"name" varchar,
	"start" date,
	"end" date
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "committees" ADD CONSTRAINT "committees_conference_conferences_id_fk" FOREIGN KEY ("conference") REFERENCES "conferences"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
