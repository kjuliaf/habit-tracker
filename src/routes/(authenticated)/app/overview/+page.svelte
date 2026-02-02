<script lang="ts">
	import HabitCompletionsOverview from '../../../../components/(authenticated)/app/overview/HabitCompletionsOverview.svelte';
	import { iconRegistry } from '$lib/utils/iconRegistry';

	let { data } = $props();
	let habitsGroupedByList = data?.habitsGroupedByList || [];

	const today = new Date();
	let viewMonth = $state(new Date(today.getFullYear(), today.getMonth(), 1));

	let monthLabel = $derived(
		viewMonth.toLocaleDateString('en-US', {
			month: 'long',
			year: 'numeric'
		})
	);

	function addMonths(d: Date, delta: number) {
		return new Date(d.getFullYear(), d.getMonth() + delta, 1);
	}

	function prevMonth() {
		viewMonth = addMonths(viewMonth, -1);
		monthLabel = viewMonth.toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric'
		});
	}
	function nextMonth() {
		viewMonth = addMonths(viewMonth, 1);
		monthLabel = viewMonth.toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric'
		});
	}

	function getMonthStart(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), 1);
	}
</script>

<div class="mb-20 flex flex-col items-center justify-center">
	<div class="prose prose-sm mt-22 sm:min-w-xl">
		<h1 class="text-primary text-center">Overview</h1>

		<div class="rounded-xl py-4">
			<div class="flex items-center justify-center gap-4">
				<button class="btn btn-md" type="button" onclick={prevMonth} aria-label="Previous month">←</button>
				<div class="w-40 text-center text-xl font-semibold capitalize">{monthLabel}</div>
				<button class="btn btn-md" type="button" onclick={nextMonth} aria-label="Next month">→</button>
			</div>
			<div class="grid gap-2 sm:grid-cols-2 sm:gap-3">
				{#each habitsGroupedByList as list}
					{#each list.habits as habit}
						{#if getMonthStart(new Date(habit.startDate)).getTime() <= getMonthStart(viewMonth).getTime()}
							<div class="mt-4 rounded-xl border border-neutral-200 bg-neutral-50">
								<div class="-mt-6 flex items-center justify-center gap-2 py-4">
									{#if habit.icon}
										{@const IconComponent = iconRegistry[habit.icon].component}
										{@const iconColor = iconRegistry[habit.icon].color}
										<IconComponent class="mt-4" style="color: {iconColor}" />
									{/if}
									<h3 class="text-center text-base">{habit.name}</h3>
								</div>

								<HabitCompletionsOverview completions={habit.completions} {viewMonth} frequency={habit.frequency} days={habit.days} />
							</div>
						{/if}
					{/each}
				{/each}
			</div>
		</div>
	</div>
</div>
