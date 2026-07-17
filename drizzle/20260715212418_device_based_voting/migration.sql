ALTER TYPE "voting_mode" ADD VALUE 'DEVICE_BASED';--> statement-breakpoint
ALTER TABLE "voting_session" ADD COLUMN "device_voting_window_seconds" integer;--> statement-breakpoint
ALTER TABLE "voting_session" ADD COLUMN "device_voting_started_at" timestamp;