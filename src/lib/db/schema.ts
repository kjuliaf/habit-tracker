import { pgTable, uuid, text } from 'drizzle-orm/pg-core';

export const profileTable = pgTable('profile', {
	id: uuid('id').primaryKey(),
	firstName: text('first_name').notNull(),
	email: text('email').notNull()
});
