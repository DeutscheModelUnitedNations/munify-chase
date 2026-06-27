CREATE TYPE "amendment_review_phase" AS ENUM('OBSOLESCENCE', 'REWRITE');--> statement-breakpoint
CREATE TABLE "amendment_review_item" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL,
	"trigger_amendment_id" text NOT NULL,
	"subject_amendment_id" text NOT NULL,
	"phase" "amendment_review_phase" NOT NULL,
	"resolved" boolean DEFAULT false NOT NULL,
	"trigger_clause_old_content" text,
	"ai_obsolete" boolean,
	"ai_obsolete_reason" text,
	"ai_rewrite_suggestion" text,
	"ai_suggestion_applied" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "amendment_revision" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"amendment_id" text NOT NULL,
	"previous_content" text NOT NULL,
	"new_content" text NOT NULL,
	"caused_by_amendment_id" text,
	"review_item_id" text,
	"ai_suggestion_applied" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "presented_at" timestamp;--> statement-breakpoint
ALTER TABLE "amendment" ADD COLUMN "obsoleted_by_amendment_id" text;--> statement-breakpoint
ALTER TABLE "amendment" ADD CONSTRAINT "amendment_obsoleted_by_amendment_id_amendment_id_fkey" FOREIGN KEY ("obsoleted_by_amendment_id") REFERENCES "amendment"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_trigger_amendment_id_amendment_id_fkey" FOREIGN KEY ("trigger_amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_review_item" ADD CONSTRAINT "amendment_review_item_subject_amendment_id_amendment_id_fkey" FOREIGN KEY ("subject_amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_revision" ADD CONSTRAINT "amendment_revision_amendment_id_amendment_id_fkey" FOREIGN KEY ("amendment_id") REFERENCES "amendment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "amendment_revision" ADD CONSTRAINT "amendment_revision_caused_by_amendment_id_amendment_id_fkey" FOREIGN KEY ("caused_by_amendment_id") REFERENCES "amendment"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "amendment_revision" ADD CONSTRAINT "amendment_revision_review_item_id_amendment_review_item_id_fkey" FOREIGN KEY ("review_item_id") REFERENCES "amendment_review_item"("id") ON DELETE SET NULL;