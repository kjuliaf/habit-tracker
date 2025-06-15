CREATE TABLE "habit_completions" (
	"id" serial PRIMARY KEY NOT NULL,
	"habit_id" integer NOT NULL,
	"completed_date" date NOT NULL,
	"value" integer
);
--> statement-breakpoint
ALTER TABLE "habits" ADD COLUMN "created_at" date DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "habit_id_completed_date_unique" ON "habit_completions" USING btree ("habit_id","completed_date");