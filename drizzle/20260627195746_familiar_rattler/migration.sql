ALTER TABLE "amendment_review_item" ADD COLUMN "trigger_clause_old_content" text;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD COLUMN "ai_obsolete" boolean;--> statement-breakpoint
ALTER TABLE "amendment_review_item" DROP COLUMN "ai_obsolete_confidence";--> statement-breakpoint
ALTER TABLE "amendment" DROP COLUMN "presentation_order";