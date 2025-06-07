<script lang="ts">
    let { data } = $props();

	let user = data?.session?.user;
    let firstName = user?.user_metadata?.first_name;
</script>

<div class="flex h-dvh flex-col items-center justify-center p-8 sm:p-0">
	<div class="prose">
		<h2 class="text-primary">Hello, {firstName}</h2>
		<a href="/logout" class="btn">Logout</a>
	</div>
</div>
