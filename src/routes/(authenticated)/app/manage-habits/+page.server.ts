import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { habits } from '$lib/db/schema';
import { eq, max, sql, and, gt } from 'drizzle-orm';

export async function load({ parent }) {
	const parentData = await parent();
	return parentData;
}

export const actions = {
	createHabit: async ({ request, locals }) => {
		try {
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();

			if (!user) {
				throw redirect(303, '/login');
			}

			const formData = await request.formData();
			const listId = parseInt(formData.get('listId') as string);

			// Get the highest displayOrder for this list
			const lastHabit = await db
				.select({ maxOrder: max(habits.displayOrder) })
				.from(habits)
				.where(
					and(
						eq(habits.listId, listId),
						eq(habits.userId, user.id) // ← Add this filter
					)
				);

			const nextDisplayOrder = (lastHabit[0]?.maxOrder || 0) + 1;

			const habitData = {
				userId: user.id,
				listId: parseInt(formData.get('listId') as string),
				icon: formData.get('icon') as string,
				name: formData.get('name') as string,
				description: formData.get('description') as string,
				targetValue: parseInt(formData.get('targetValue') as string),
				unit: formData.get('unit') as string,
				days: JSON.parse(formData.get('days') as string),
				displayOrder: nextDisplayOrder
			};

			const result = await db.insert(habits).values(habitData).returning();
			return { success: true, habit: result[0] };
		} catch (error) {
			console.error('Error creating habit:', error);
			return fail(500, { error: 'Failed to create habit' });
		}
	},

	updateHabit: async ({ request, locals }) => {
		try {
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();

			if (!user) {
				throw redirect(303, '/login');
			}

			const formData = await request.formData();
			const habitId = parseInt(formData.get('habitId') as string);

			if (!habitId) {
				return fail(400, { error: 'Habit ID is required' });
			}

			// Get the existing habit first
			const existingHabit = await db.select().from(habits).where(eq(habits.id, habitId)).limit(1);

			if (existingHabit.length === 0) {
				return fail(404, { error: 'Habit not found' });
			}

			if (existingHabit[0].userId !== user.id) {
				return fail(403, { error: 'Not authorized to edit this habit' });
			}

			const newListId = parseInt(formData.get('listId') as string);
			const oldListId = existingHabit[0].listId;

			// Always update basic fields
			const basicHabitData = {
				listId: newListId,
				icon: formData.get('icon') as string,
				name: formData.get('name') as string,
				description: formData.get('description') as string,
				targetValue: parseInt(formData.get('targetValue') as string),
				unit: formData.get('unit') as string,
				days: JSON.parse(formData.get('days') as string)
			};

			await db.update(habits).set(basicHabitData).where(eq(habits.id, habitId));

			// If listId changed, update displayOrder separately
			if (newListId !== oldListId) {
				// Get the highest displayOrder in the new list
				const lastHabitInNewList = await db
					.select({ maxOrder: max(habits.displayOrder) })
					.from(habits)
					.where(and(eq(habits.listId, newListId), eq(habits.userId, user.id)));

				const nextDisplayOrder = (lastHabitInNewList[0]?.maxOrder || 0) + 1;

				// Update displayOrder separately
				await db.update(habits).set({ displayOrder: nextDisplayOrder }).where(eq(habits.id, habitId));

				// Clean up old list's display orders
				await db
					.update(habits)
					.set({ displayOrder: sql`display_order - 1` })
					.where(
						and(
							eq(habits.listId, oldListId),
							gt(habits.displayOrder, existingHabit[0].displayOrder),
							eq(habits.userId, user.id)
						)
					);
			}

			// Get the final updated habit
			const result = await db.select().from(habits).where(eq(habits.id, habitId)).limit(1);

			return { success: true, habit: result[0] };
		} catch (error) {
			console.error('Error updating habit:', error);
			return fail(500, { error: 'Failed to update habit' });
		}
	},

	deleteHabit: async ({ request, locals }) => {
		try {
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();

			if (!user) {
				throw redirect(303, '/login');
			}

			const formData = await request.formData();
			const habitId = parseInt(formData.get('habitId') as string);

			if (!habitId) {
				return fail(400, { error: 'Habit ID is required' });
			}

			// Verify the habit belongs to the current user before deleting
			const existingHabit = await db.select().from(habits).where(eq(habits.id, habitId)).limit(1);

			if (existingHabit.length === 0) {
				return fail(404, { error: 'Habit not found' });
			}

			if (existingHabit[0].userId !== user.id) {
				return fail(403, { error: 'Not authorized to delete this habit' });
			}

			const deletedHabit = existingHabit[0];

			// Delete the habit
			await db.delete(habits).where(eq(habits.id, habitId));

			await db
				.update(habits)
				.set({ displayOrder: sql`display_order - 1` })
				.where(
					and(
						eq(habits.listId, deletedHabit.listId),
						gt(habits.displayOrder, deletedHabit.displayOrder),
						eq(habits.userId, user.id)
					)
				);

			return { success: true };
		} catch (error) {
			console.error('Error deleting habit:', error);
			return fail(500, { error: 'Failed to delete habit' });
		}
	},

	reorderHabits: async ({ request, locals }) => {
		try {
			const {
				data: { user }
			} = await locals.supabase.auth.getUser();
			if (!user) throw redirect(303, '/login');

			const formData = await request.formData();
			const habitUpdates = JSON.parse(formData.get('habitUpdates') as string);

			for (const update of habitUpdates) {
				await db.update(habits).set({ displayOrder: update.displayOrder }).where(eq(habits.id, update.id));
			}

			return { success: true };
		} catch (error) {
			console.error('Error reordering habits:', error);
			return fail(500, { error: 'Failed to reorder habits' });
		}
	}
};
