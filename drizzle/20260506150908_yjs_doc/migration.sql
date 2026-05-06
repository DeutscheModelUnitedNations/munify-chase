CREATE TABLE "paper_yjs_doc" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"paper_id" text NOT NULL,
	"state" "bytea" NOT NULL,
	CONSTRAINT "paper_yjs_doc_paper_id_unique" UNIQUE("paper_id")
);
--> statement-breakpoint
DROP TABLE "paper_clause_lock" CASCADE;--> statement-breakpoint
ALTER TABLE "paper_yjs_doc" ADD CONSTRAINT "paper_yjs_doc_paper_id_resolution_paper_id_fk" FOREIGN KEY ("paper_id") REFERENCES "public"."resolution_paper"("id") ON DELETE cascade ON UPDATE no action;
