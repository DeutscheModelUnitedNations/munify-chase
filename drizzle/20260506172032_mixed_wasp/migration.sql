CREATE TABLE "paper_yjs_doc" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"paper_id" text NOT NULL UNIQUE,
	"state" bytea NOT NULL
);
--> statement-breakpoint
DROP TABLE "paper_clause_lock";--> statement-breakpoint
ALTER TABLE "paper_yjs_doc" ADD CONSTRAINT "paper_yjs_doc_paper_id_resolution_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "resolution_paper"("id") ON DELETE CASCADE;