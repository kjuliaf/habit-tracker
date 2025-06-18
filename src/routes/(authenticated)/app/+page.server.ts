// +page.server.ts with upsert
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db';
import { habitCompletions } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const actions = {
	updateCompletion: async ({ request, locals }) => {
		const user = locals.user;
		if (!user) {
			throw redirect(302, '/login');
		}

		try {
			const data = await request.formData();
			const habitId = parseInt(data.get('habitId') as string);
			const habitUnit = data.get('habitUnit') as string;
			const value = data.get('value') as string;
			const completedDate = data.get('completedDate') as string;
			const entryMethod = data.get('entryMethod') as string;

			// Validate inputs
			if (!habitId || !completedDate) {
				return fail(400, { error: 'Missing required fields' });
			}

			if (!/^\d{4}-\d{2}-\d{2}$/.test(completedDate)) {
				return fail(400, { error: 'Invalid date format' });
			}

			if (value === 'null' || value === null || value === '' || (value === '0' && entryMethod !== 'uncompleted')) {
				// User unchecked - delete completion
				await db
					.delete(habitCompletions)
					.where(
						and(
							eq(habitCompletions.habitId, habitId),
							eq(habitCompletions.completedDate, completedDate),
							eq(habitCompletions.userId, user.id)
						)
					);
			} else {
				const completionValue = habitUnit === 'km' ? parseFloat(value) : parseInt(value, 10);

				if (isNaN(completionValue)) {
					return fail(400, { error: 'Invalid completion value' });
				}

				await db
					.insert(habitCompletions)
					.values({
						userId: user.id,
						habitId: habitId,
						completedDate: completedDate,
						value: completionValue,
						entryMethod: entryMethod
					})
					.onConflictDoUpdate({
						target: [habitCompletions.habitId, habitCompletions.completedDate],
						set: {
							value: completionValue,
							entryMethod: entryMethod
						}
					});
			}

			return { success: true };
		} catch (error) {
			console.error('Error updating completion:', error);
			return fail(500, { error: 'Failed to update completion' });
		}
	}
};
