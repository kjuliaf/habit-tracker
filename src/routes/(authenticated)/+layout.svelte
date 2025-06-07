<script lang="ts">
	import Sidebar from '../../components/(authenticated)/Sidebar.svelte';
	let { children } = $props();
</script>

<Sidebar />
{@render children()}
