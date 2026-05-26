UPDATE "presence_event" SET "marker" = 'NSA_SCAN' WHERE "marker" IS NULL;--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "marker" SET NOT NULL;
