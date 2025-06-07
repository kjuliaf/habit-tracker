import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			let errorMessage = 'An error occurred while logging in. Please try again.';
			if (error.message.includes('Invalid login credentials')) {
				errorMessage = 'Invalid email or password.';
			}
			return fail(400, { error: errorMessage });
		} else {
			redirect(303, '/app');
		}
	}
};
