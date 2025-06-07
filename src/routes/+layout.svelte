<script lang="ts">
	import '../style.css';
	import '@fontsource-variable/manrope';
	import '@fontsource-variable/nunito-sans';

	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_: any, newSession: typeof session) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

{@render children()}
