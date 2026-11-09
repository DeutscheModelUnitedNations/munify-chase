CREATE TYPE "instance_link_status" AS ENUM('PENDING', 'ACTIVE', 'FROZEN');--> statement-breakpoint
CREATE TABLE "instance_link" (
	"id" text PRIMARY KEY,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"remote_url" text NOT NULL,
	"status" "instance_link_status" DEFAULT 'PENDING'::"instance_link_status" NOT NULL,
	"inbound_token_hash" text,
	"outbound_token" text NOT NULL,
	"confirmation_code" text NOT NULL,
	"linked_at" timestamp,
	"last_event_at" timestamp,
	"last_reconcile_at" timestamp,
	"last_error" text,
	"remote_signing_keys" jsonb
);
--> statement-breakpoint
ALTER TABLE "conference_user" DROP CONSTRAINT "conference_user_conference_id_attendance_code_unique";--> statement-breakpoint
ALTER TABLE "agenda_item" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "committee_member" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_member" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "delegator_user_id" text;--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "card_number" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "representation" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "delegator_paper_id" text;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "delegator_version" integer;--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD COLUMN "detached_at" timestamp;--> statement-breakpoint
ALTER TABLE "conference_user" DROP COLUMN "attendance_code";--> statement-breakpoint
ALTER TABLE "resolution_paper" ADD CONSTRAINT "resolution_paper_delegator_paper_id_key" UNIQUE("delegator_paper_id");--> statement-breakpoint
CREATE UNIQUE INDEX "instance_link_single_row" ON "instance_link" ((true));