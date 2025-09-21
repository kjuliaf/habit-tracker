<script lang="ts">
	import { calcProgress } from '$lib/utils/habitUtils';
	import StreamlineCheckSolid from '~icons/streamline/check-solid';
	import StreamlineDelete1Solid from '~icons/streamline/delete-1-solid';

	let { habit, selectedDate } = $props();
</script>

{#if habit.completions[selectedDate.toISOString().split('T')[0]] || calcProgress(habit, selectedDate) >= 100}
	<div class="flex flex-row-reverse gap-3 sm:flex-row">
		{#if habit.completions[selectedDate
				.toISOString()
				.split('T')[0]] && calcProgress(habit, selectedDate) > 0 && (habit.frequency === 'weekly' || habit.frequency === 'monthly')}
			<div class="badge badge-xs badge-neutral badge-outline -mr-2 min-w-max whitespace-nowrap opacity-60">
				<StreamlineCheckSolid class="-mr-1 h-2 w-2" />
				{habit.completions[selectedDate.toISOString().split('T')[0]]?.value?.toLocaleString('sv-SE')}
				{habit.unit} today
			</div>
		{/if}
		{#if calcProgress(habit, selectedDate) >= 100}
			<div class="badge badge-xs badge-success badge-outline -mr-2 whitespace-nowrap">
				<StreamlineCheckSolid class="-mr-1 h-2 w-2" />
				Completed
			</div>
		{/if}
		{#if habit.completions[selectedDate.toISOString().split('T')[0]] && habit.completions[selectedDate
					.toISOString()
					.split('T')[0]].entryMethod === 'uncompleted'}
			<div class="badge badge-xs badge-error badge-outline -mr-2 whitespace-nowrap">
				<StreamlineDelete1Solid class="-mr-1 h-1.5 w-1.5" />
				Not completed
			</div>
		{/if}
	</div>
{/if}
