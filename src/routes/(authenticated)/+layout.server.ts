import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { habitLists, habits, habitCompletions } from '$lib/db/schema';
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

		const userHabitCompletions = await db.select().from(habitCompletions).where(eq(habitCompletions.userId, user.id));

		// Group habits by list ID for easier frontend consumption
		/* const habitsGroupedByList = existingLists.map((list) => ({
			...list,
			habits: userHabits.filter((habit) => habit.listId === list.id)
		})); */

		const habitsGroupedByList = existingLists.map((list) => ({
			...list,
			habits: userHabits
				.filter((habit) => habit.listId === list.id)
				.map((habit) => {
					// Create completions map for this habit
					const completions: Record<string, number> = {};

					userHabitCompletions
						.filter((completion) => completion.habitId === habit.id)
						.forEach((completion) => {
							completions[completion.completedDate] = completion.value ?? 0;
						});

					return {
						...habit,
						completions
					};
				})
		}));

		return {
			user,
			habitLists: existingLists,
			habits: userHabits,
			habitCompletions: userHabitCompletions,
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
