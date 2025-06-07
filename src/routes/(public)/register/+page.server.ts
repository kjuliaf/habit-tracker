import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;
		const first_name = formData.get('first_name') as string;

		if (!email || !password || !confirmPassword || !first_name) {
			return fail(400, { error: 'All fields are required', email, first_name });
		}

		if (password.length < 6) {
			return fail(400, { error: 'Password must be at least 6 characters long', email, first_name });
		}

		if (password !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match', email, first_name });
		}

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					first_name
				}
			}
		});
		if (error) {
			let errorMessage = 'An error occurred while creating account. Please try again';
			if (error.message.includes('User already registered')) {
				errorMessage = 'An account with this email already exists.';
			} else if (error.message.includes('All fields are required')) {
				errorMessage = 'All fields are required.';
			} else if (error.message.includes('Password should be at least')) {
				errorMessage = 'Password must be at least 6 characters long.';
			} else if (error.message.includes('Passwords do not match')) {
				errorMessage = 'Passwords do not match.';
			} else if (error.message.includes('Invalid email')) {
				errorMessage = 'Please enter a valid email address.';
			}
			return fail(400, { error: errorMessage });
		} else {
			redirect(303, '/login');
		}
	}
};
