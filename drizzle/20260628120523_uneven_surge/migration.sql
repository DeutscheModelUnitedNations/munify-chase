CREATE TYPE "amendment_review_phase" AS ENUM('OBSOLESCENCE', 'REWRITE', 'RESOLVED');--> statement-breakpoint
CREATE TABLE "amendment_review_item" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"trigger_amendment_id" text NOT NULL,
	"subject_amendment_id" text NOT NULL,
	"phase" "amendment_review_phase" NOT NULL,
	"ai_obsolete" boolean,
	"ai_obsolete_reason" text,
	"ai_rewrite_suggestion" text,
	"verdict_obsolete" boolean,
	"verdict_rewrite" text
);
--> statement-breakpoint
ALTER TABLE "conference_user" DROP CONSTRAINT "conference_user_user_email_key";--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "old_content" text;--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "presented_at" timestamp;--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "obsoleted_by_amendment_id" text;--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_obsoleted_by_amendment_id_amendment_id_fkey" FOREIGN KEY ("obsoleted_by_amendment_id") REFERENCES "amendment"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_trigger_amendment_id_amendment_id_fkey" FOREIGN KEY ("trigger_amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_subject_amendment_id_amendment_id_fkey" FOREIGN KEY ("subject_amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;