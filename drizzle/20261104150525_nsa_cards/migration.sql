ALTER TABLE "conference_user" DROP CONSTRAINT "conference_user_conference_id_attendance_code_unique";--> statement-breakpoint
ALTER TABLE "conference_user" ADD COLUMN "card_number" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "instance_link" ADD COLUMN "remote_identity_key" text;--> statement-breakpoint
ALTER TABLE "conference_user" DROP COLUMN "attendance_code";