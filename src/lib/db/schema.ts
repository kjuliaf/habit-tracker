import { pgTable, serial, uuid, text, integer, date, unique, real } from 'drizzle-orm/pg-core';
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
	targetValue: real('target_value'),
	unit: text('unit'),
	frequency: text('frequency').notNull(),
	days: text('days').array(),
	displayOrder: integer('display_order').notNull(),
	startDate: date('start_date').notNull(),
	startTime: text('start_time'),
	endTime: text('end_time')
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

export const habitCompletions = pgTable(
	'habit_completions',
	{
		id: serial('id').primaryKey(),
		userId: uuid('user_id').notNull(),
		habitId: integer('habit_id').notNull(),
		completedDate: date('completed_date').notNull(),
		value: real('value'),
		entryMethod: text('entry_method')
	},
	(table) => ({
		habitDateUnique: unique('habit_id_completed_date_unique').on(table.habitId, table.completedDate)
	})
);

export const habitCompletionRelations = relations(habitCompletions, ({ one }) => ({
	habit: one(habits, {
		fields: [habitCompletions.habitId],
		references: [habits.id]
	})
}));
