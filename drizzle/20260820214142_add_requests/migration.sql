CREATE TYPE "request_status" AS ENUM('PENDING', 'RESOLVED', 'WITHDRAWN');--> statement-breakpoint
CREATE TABLE "request" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"committee_id" text NOT NULL,
	"request_type_id" text NOT NULL,
	"conference_user_id" text NOT NULL,
	"status" "request_status" DEFAULT 'PENDING'::"request_status" NOT NULL,
	"resolved_by_conference_user_id" text,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "request_type" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"conference_id" text NOT NULL,
	"name" text NOT NULL,
	"fa_icon" text,
	"priority" smallint NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	CONSTRAINT "request_type_conference_id_name_unique" UNIQUE("conference_id","name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "request_pending_unique" ON "request" ("committee_id","conference_user_id","request_type_id") WHERE "status" = 'PENDING';--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_committee_id_committee_id_fkey" FOREIGN KEY ("committee_id") REFERENCES "committee"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_request_type_id_request_type_id_fkey" FOREIGN KEY ("request_type_id") REFERENCES "request_type"("id");--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_conference_user_id_conference_user_id_fkey" FOREIGN KEY ("conference_user_id") REFERENCES "conference_user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "request" ADD CONSTRAINT "request_resolved_by_conference_user_id_conference_user_id_fkey" FOREIGN KEY ("resolved_by_conference_user_id") REFERENCES "conference_user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "request_type" ADD CONSTRAINT "request_type_conference_id_conference_id_fkey" FOREIGN KEY ("conference_id") REFERENCES "conference"("id") ON DELETE CASCADE;