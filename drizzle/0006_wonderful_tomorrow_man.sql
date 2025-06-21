ALTER TABLE "habits" RENAME COLUMN "created_at" TO "start_date";--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "start_time" text;--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "end_time" text;