CREATE TABLE "display_token" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"conference_id" text NOT NULL,
	"code" text NOT NULL UNIQUE,
	"label" text DEFAULT '' NOT NULL,
	"show_state_of_debate" boolean DEFAULT false NOT NULL,
	"created_by_id" text,
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "display_token" ADD CONSTRAINT "display_token_conference_id_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "display_token" ADD CONSTRAINT "display_token_created_by_id_user_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL;