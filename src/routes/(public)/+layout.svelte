<script lang="ts">
	import Header from '../../components/Header.svelte';
	let { children } = $props();
</script>

<div class="bg-[url('background.png')] xl:bg-[length:100%_auto] bg-no-repeat">
	<Header />
	{@render children()}
</div>
