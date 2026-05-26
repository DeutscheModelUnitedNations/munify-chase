ALTER TABLE "presence_event" RENAME COLUMN "event_type" TO "present";--> statement-breakpoint
ALTER TABLE "presence_event" ALTER COLUMN "present" SET DATA TYPE boolean USING ("present"::text = 'CHECK_IN');--> statement-breakpoint
DROP TYPE "presence_event_type";