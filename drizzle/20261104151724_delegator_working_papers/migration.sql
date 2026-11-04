ALTER TABLE "resolution_paper" ADD COLUMN "delegator_paper_id" text;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "delegator_version" integer;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "detached_at" timestamp;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_delegator_paper_id_key" UNIQUE("delegator_paper_id");