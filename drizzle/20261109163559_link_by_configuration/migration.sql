ALTER TABLE "conference_user" DROP COLUMN "delegator_user_id";--> statement-breakpoint
ALTER TABLE "instance_link" DROP COLUMN "status";--> statement-breakpoint
ALTER TABLE "instance_link" DROP COLUMN "inbound_token_hash";--> statement-breakpoint
ALTER TABLE "instance_link" DROP COLUMN "outbound_token";--> statement-breakpoint
ALTER TABLE "instance_link" DROP COLUMN "confirmation_code";--> statement-breakpoint
ALTER TABLE "instance_link" DROP COLUMN "linked_at";--> statement-breakpoint
DROP TYPE "instance_link_status";