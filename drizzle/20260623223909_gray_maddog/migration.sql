ALTER TABLE "committee" ADD COLUMN "paper_support_threshold" smallint DEFAULT 10 NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "last_resolution_adoption_date" timestamp;