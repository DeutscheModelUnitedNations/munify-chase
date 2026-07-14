ALTER TABLE "spoken_time_period" ADD COLUMN "queued_at" timestamp;--> statement-breakpoint
ALTER TABLE "spoken_time_period" ADD COLUMN "phase" "speakers_list_phase";--> statement-breakpoint

-- Backfill: best proxy for queue time is the speech start; best proxy for phase is 'SPEECH'
UPDATE "spoken_time_period" SET "queued_at" = "start_timestamp" WHERE "queued_at" IS NULL;--> statement-breakpoint
UPDATE "spoken_time_period" SET "phase" = 'SPEECH' WHERE "phase" IS NULL;--> statement-breakpoint

ALTER TABLE "spoken_time_period" ALTER COLUMN "queued_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "spoken_time_period" ALTER COLUMN "phase" SET NOT NULL;
