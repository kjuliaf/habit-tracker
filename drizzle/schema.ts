import { pgTable, serial, uuid, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const habitLists = pgTable("habit_lists", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: text().notNull(),
	displayOrder: integer("display_order").notNull(),
});

export const habits = pgTable("habits", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	listId: integer("list_id").notNull(),
	icon: text().notNull(),
	name: text().notNull(),
	description: text(),
	targetValue: integer("target_value"),
	unit: text(),
	days: text().array(),
	displayOrder: integer("display_order").notNull(),
});
