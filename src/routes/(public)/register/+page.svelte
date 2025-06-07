<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<div class="flex h-dvh p-8 sm:p-0">
	<div class="prose-sm sm:prose-base m-auto flex flex-col items-center py-36">
		<h1>Create accout</h1>
		<!-- Register form -->
		<form method="POST" action="?/signup" class="fieldset w-xs border-none bg-none" use:enhance>
			<label for="first_name" class="fieldset-label">First name</label>
			<input
				type="text"
				id="first_name"
				name="first_name"
				class="input"
				placeholder="First name"
				required
			/>
			<label for="email" class="fieldset-label">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				class="input"
				placeholder="Email"
				autocomplete="username"
				required
			/>
			<label for="password" class="fieldset-label">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				class="input"
				placeholder="Password"
				autocomplete="new-password"
				required
			/>
			<label for="confirm-password" class="fieldset-label">Confirm password</label>
			<input
				type="password"
				id="confirm-password"
				name="confirm-password"
				class="input"
				placeholder="Confirm password"
				autocomplete="off"
				required
			/>
			{#if form?.error}
				<p class="!mb-0 text-red-500">{form.error}</p>
			{/if}
			<button class="btn btn-neutral mt-6">Create account</button>
		</form>
		<p class="mt-10 text-sm">Have an account? <a href="/login" class="text-primary underline">Log in here</a></p>
	</div>
</div>
