import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/db';
import { habits } from '$lib/db/schema';

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

			const habitData = {
				userId: user.id,
				listId: parseInt(formData.get('listId') as string), // This should be the list ID
				icon: formData.get('icon') as string,
				name: formData.get('name') as string,
				description: formData.get('description') as string,
				targetValue: parseInt(formData.get('targetValue') as string),
				unit: formData.get('unit') as string,
				days: JSON.parse(formData.get('days') as string), // Parse the days array
				displayOrder: 1 // You might want to calculate this based on existing habits
			};

			console.log('Creating habit with data:', habitData);

			const result = await db.insert(habits).values(habitData).returning();

			console.log('Habit created:', result);

			return { success: true, habit: result[0] };
		} catch (error) {
			console.error('Error creating habit:', error);
			return fail(500, { error: 'Failed to create habit' });
		}
	}
};
