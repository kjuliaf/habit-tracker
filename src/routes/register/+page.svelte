<div class="flex h-dvh p-8 sm:p-0">
	<div class="prose-sm sm:prose-base m-auto flex flex-col items-center py-36">
		<h1>Create accout</h1>
		<!-- Register form -->
		<form class="fieldset w-xs border-none bg-none">
			<label for="name" class="fieldset-label">First name</label>
			<input type="text" id="name" class="input" placeholder="First name" />
			<label for="email" class="fieldset-label">Email</label>
			<input type="email" id="email" class="input" placeholder="Email" autocomplete="username" />
			<label for="password" class="fieldset-label">Password</label>
			<input type="password" id="password" class="input" placeholder="Password" autocomplete="new-password" />
			<label for="confirm-password" class="fieldset-label">Confirm password</label>
			<input type="password" id="confirm-password" class="input" placeholder="Confirm password" autocomplete="off" />
			<button type="submit" class="btn btn-neutral mt-6">Create account</button>
		</form>
		<p class="mt-10 text-sm">Have an account? <a href="/login" class="text-primary">Log in here</a></p>
	</div>
</div>
