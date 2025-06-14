import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { habitLists, habits } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

const defaultHabitLists = [
	{ name: 'Morning', displayOrder: 1 },
	{ name: 'Day', displayOrder: 2 },
	{ name: 'Night', displayOrder: 3 },
	{ name: 'Other', displayOrder: 4 }
];

export async function load({ locals }) {
	try {
		const {
			data: { user }
		} = await locals.supabase.auth.getUser();

		if (!user) {
			throw redirect(303, '/login');
		}

		// Query existing habit lists
		let existingLists = await db
			.select()
			.from(habitLists)
			.where(eq(habitLists.userId, user.id))
			.orderBy(habitLists.displayOrder);

		// Create default lists if none exist
		if (existingLists.length === 0) {
			const inserts = defaultHabitLists.map((list) => ({
				userId: user.id,
				name: list.name,
				displayOrder: list.displayOrder
			}));

			await db.insert(habitLists).values(inserts);

			existingLists = await db
				.select()
				.from(habitLists)
				.where(eq(habitLists.userId, user.id))
				.orderBy(habitLists.displayOrder);
		}

		const userHabits = await db.select().from(habits).where(eq(habits.userId, user.id)).orderBy(habits.displayOrder);

		// Group habits by list ID for easier frontend consumption
		const habitsGroupedByList = existingLists.map((list) => ({
			...list,
			habits: userHabits.filter((habit) => habit.listId === list.id)
		}));

		return {
			user,
			habitLists: existingLists,
			habits: userHabits,
			habitsGroupedByList
		};
	} catch (error) {
		if (error instanceof Error) {
			console.error('Database error:', error.message);
		}
		return {
			user: null,
			habitLists: []
		};
	}
}
