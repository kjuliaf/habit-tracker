<script lang="ts">
	import { isMorning, isAfternoon } from '$lib/utils/time';

	let { firstName } = $props();

	function getGreeting() {
		if (isMorning()) {
			return 'Good morning,';
		} else if (isAfternoon()) {
			return 'Good afternoon,';
		} else {
			return 'Good evening,';
		}
	}
</script>

<div class="prose prose-sm mt-22">
	<h1 class="text-primary">{getGreeting()} {firstName}!</h1>
</div>
