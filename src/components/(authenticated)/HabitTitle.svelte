<script lang="ts">
	import { getResult } from '$lib/utils/habitUtils';
	import MdiClockOutline from '~icons/mdi/clock-outline';
	let { habit, selectedDate } = $props();

	function splitLastWord(text: string) {
		if (!text) return { first: '', last: '' };
		const words = text.trim().split(/\s+/);
		const last = words.pop();
		const first = words.join(' ').trim();
		return { first, last };
	}
</script>

<div>
	<div class="flex gap-2">
		<p class="text-sm">
			{#if splitLastWord(habit.name).first}
				{splitLastWord(habit.name).first}&nbsp;
			{/if}<span class="align-baseline whitespace-nowrap">
				<span>{splitLastWord(habit.name).last}</span>
				{#if habit.startTime}
					<span class="ml-1 inline-flex items-center gap-0.5 align-middle text-[0.6875rem] opacity-60">
						<MdiClockOutline class="mb-px h-3 w-3" />
						<span>
							{habit.startTime}{habit.endTime ? '–' + habit.endTime : ''}
						</span>
					</span>
				{/if}
			</span>
		</p>
	</div>

	<div class="mt-0.25 text-xs opacity-60">
		{getResult(habit, selectedDate)?.toLocaleString('sv-SE')}/{habit.targetValue?.toLocaleString('sv-SE')}
		{habit.unit}
		{habit.frequency === 'weekly' ? 'this week' : habit.frequency === 'monthly' ? 'this month' : 'today'}
	</div>
</div>
