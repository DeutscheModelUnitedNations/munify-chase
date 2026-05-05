ALTER TABLE "committee" ADD COLUMN "current_operative_clause_id" text;--> statement-breakpoint
ALTER TABLE "conference" ADD COLUMN "resolution_feature_enabled" boolean DEFAULT true NOT NULL;