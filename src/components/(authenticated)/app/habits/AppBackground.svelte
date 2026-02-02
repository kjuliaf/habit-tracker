<script lang="ts">
	import { isMorning, isAfternoon } from '$lib/utils/time';
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

<div
	class="absolute -z-1 mt-100 h-140 max-h-full w-140 max-w-full {getBackgroundImage()} bg-cover bg-center bg-no-repeat"
></div>
