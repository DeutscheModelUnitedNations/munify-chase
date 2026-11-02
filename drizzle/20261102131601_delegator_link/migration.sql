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
	"last_error" text
);
--> statement-breakpoint
ALTER TABLE "agenda_item" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "committee_member" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_member" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "delegator_user_id" text;--> statement-breakpoint
ALTER TABLE "representation" ADD COLUMN "managed_by_delegator" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "instance_link_single_row" ON "instance_link" ((true));