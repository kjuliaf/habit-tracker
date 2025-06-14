import { pgTable, serial, uuid, text, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const habitLists = pgTable('habit_lists', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	name: text('name').notNull(),
	displayOrder: integer('display_order').notNull()
});

export const habits = pgTable('habits', {
	id: serial('id').primaryKey(),
	userId: uuid('user_id').notNull(),
	listId: integer('list_id').notNull(),
	icon: text('icon').notNull(),
	name: text('name').notNull(),
	description: text('description'),
	targetValue: integer('target_value'),
	unit: text('unit'),
	days: text('days').array(),
	displayOrder: integer('display_order').notNull()
});

export const habitListRelations = relations(habitLists, ({ many }) => ({
	habits: many(habits)
}));

export const habitRelations = relations(habits, ({ one }) => ({
	habitList: one(habitLists, {
		fields: [habits.listId],
		references: [habitLists.id]
	})
}));
