DROP INDEX "roll_call_session_active_unique";--> statement-breakpoint
DROP INDEX "voting_session_active_unique";--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_roll_call_session_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD COLUMN "active_voting_session_id" text;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_roll_call_session_id_roll_call_session_id_fkey" FOREIGN KEY ("active_roll_call_session_id") REFERENCES "roll_call_session"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "committee" ADD CONSTRAINT "committee_active_voting_session_id_voting_session_id_fkey" FOREIGN KEY ("active_voting_session_id") REFERENCES "voting_session"("id") ON DELETE SET NULL;