ALTER TABLE "habit_completions" ALTER COLUMN "value" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "habit_completions" ADD COLUMN "entry_method" text;