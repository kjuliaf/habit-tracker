<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<div class="flex h-dvh p-8 sm:p-0">
	<div class="prose prose-sm sm:prose-base m-auto flex flex-col items-center py-36">
		<h1>Welcome back</h1>
		<!-- Login form -->
		<form method="POST" action="?/login" class="fieldset w-xs border-none bg-none" use:enhance>
			<label for="email" class="fieldset-label">Email</label>
			<input
				type="email"
				id="email"
				name="email"
				class="input"
				placeholder="Email"
				autocomplete="username"
			/>
			<label class="fieldset-label" for="password">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				class="input"
				placeholder="Password"
				autocomplete="current-password"
			/>
			{#if form?.error}
				<p class="!mb-0 text-red-500">{form.error}</p>
			{/if}
			<button class="btn btn-neutral mt-6">Login</button>
		</form>
		<p class="mt-10 text-sm">
			Don't have an account? <a href="/register" class="text-primary underline">Register here</a>
		</p>
	</div>
</div>
