<script lang="ts">
	let { habit, selectedDate } = $props();
	import { iconRegistry } from "$lib/utils/iconRegistry";
	import { calcProgress } from "$lib/utils/habitUtils";
	import StreamlineCheckSolid from '~icons/streamline/check-solid';
</script>

<div class="pt-1 pl-1">
	<div class="relative">
		<!-- Border circle -->
		<div class="border-base-300 absolute inset-0 rounded-full border-[3px]"></div>
		<!-- Progress on top -->
		<div
			class="radial-progress text-primary relative z-1"
			style="--value:{calcProgress(habit, selectedDate)}; --size:2em; --thickness: 3px;"
			aria-valuenow={calcProgress(habit, selectedDate)}
			role="progressbar"
		>
			{#if calcProgress(habit, selectedDate) < 100}
				{#if habit.icon}
					{@const IconComponent = iconRegistry[habit.icon].component}
					{@const iconColor = iconRegistry[habit.icon].color}
					<IconComponent style="color: {iconColor}" />
				{/if}
			{:else}
				<StreamlineCheckSolid class="text-primary mt-0.25 h-3.75 w-3.75" />
			{/if}
		</div>
	</div>
</div>

<style>
	.radial-progress::before {
		transition: none !important;
	}

	.radial-progress::after {
		transition: none !important;
	}
</style>