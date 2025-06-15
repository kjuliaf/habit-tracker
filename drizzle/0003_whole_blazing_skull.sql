DROP INDEX "habit_id_completed_date_unique";--> statement-breakpoint
ALTER TABLE "habit_completions" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "habit_completions" ADD CONSTRAINT "habit_id_completed_date_unique" UNIQUE("habit_id","completed_date");