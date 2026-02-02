<script lang="ts">
	import { isMorning, isAfternoon, isEvening } from '$lib/utils/time';

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

	function getBackgroundImage() {
		if (isMorning()) {
			return "bg-[url('/morning-background.png')]";
		} else if (isAfternoon()) {
			return "bg-[url('/afternoon-background.png')]";
		} else {
			return "bg-[url('/evening-background.png')]";
		}
	}
</script>	
	
<div class="flex flex-col items-center justify-center">
	<div
		class="absolute -z-1 mt-100 h-140 max-h-full w-140 max-w-full {getBackgroundImage()} bg-cover bg-center bg-no-repeat"
	></div>

	<div class="prose prose-sm mt-22">
		<h1 class="text-primary">{getGreeting()} {firstName}!</h1>
	</div>
</div>
