CREATE TABLE "habit_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"display_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "habits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"list_id" integer NOT NULL,
	"icon" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"target_value" integer,
	"unit" text,
	"days" text[],
	"display_order" integer NOT NULL
);
