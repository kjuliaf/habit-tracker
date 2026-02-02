<script lang="ts">
	let { data } = $props();
	let user = data?.session?.user;
	let firstName = user?.user_metadata?.first_name;
	import Datepicker from '../../../components/(authenticated)/app/habits/Datepicker.svelte';
	import HabitDetailModal from '../../../components/(authenticated)/app/habits/habit-details/HabitDetailModal.svelte';
	let habitsGroupedByList = data?.habitsGroupedByList || [];
	import { browser } from '$app/environment';
	import Greeting from '../../../components/(authenticated)/app/habits/Greeting.svelte';
	import ProgressCircle from '../../../components/(authenticated)/app/habits/HabitProgressCircle.svelte';
	import HabitTitle from '../../../components/(authenticated)/app/habits/HabitTitle.svelte';
	import HabitCompletionInfo from '../../../components/(authenticated)/app/habits/HabitCompletionInfo.svelte';
	import HabitListTitle from '../../../components/(authenticated)/app/habits/HabitListTitle.svelte';
	import type { Habit } from '$lib/utils/habitUtils';
	import AppBackground from '../../../components/(authenticated)/app/habits/AppBackground.svelte';

	let currentHabit: Habit | null = $state(null);
	let isLoaded = $state(false);
	let dialog: HTMLDialogElement | null = $state(null);
	let selectedDate = $state(new Date());
	const STORAGE_KEY = `selectedDate${data.user?.id}`;

	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				selectedDate = new Date(saved);
			}
			isLoaded = true;
		}
	});

	$effect(() => {
		if (browser && selectedDate && isLoaded) {
			localStorage.setItem(STORAGE_KEY, selectedDate.toISOString());
		}
	});

	function openHabitDetailModal(habit: Habit) {
		currentHabit = habit;
		dialog?.showModal();
	}

	let filteredHabitsGroupedByList = $derived(
		habitsGroupedByList
			.map((list) => ({
				...list,
				habits: list.habits.filter((habit) => {
					let habitDate = new Date(habit.startDate);
					return selectedDate >= habitDate;
				})
			}))
			.filter((list) => list.habits.length > 0) // Remove empty lists
	);

	let visibleHabitsGroupedByList = $derived(
		filteredHabitsGroupedByList
			.map((list) => ({
				...list,
				habits: list.habits.filter((habit) => checkCustomDay(habit) /* && !checkAlreadyCompletedWeekMonth(habit) */)
			}))
			.filter((list) => list.habits.length > 0) // Remove empty lists
	);

	function checkCustomDay(habit: Habit) {
		if (habit.frequency === 'custom') {
			const daysStr = String(habit.days);
			let customDays = daysStr.split(',').map((day) => day.trim());
			let currentDay = getWeekdayShort(selectedDate);
			return customDays.includes(currentDay);
		}
		return true;
	}

	function getWeekdayShort(date: Date) {
		const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
		return days[date.getDay()];
	}
</script>

{#if isLoaded}
	<HabitDetailModal bind:dialog habit={currentHabit} date={selectedDate} />

	<div class="flex flex-col items-center justify-center">
		<Greeting {firstName} />
		<AppBackground />
	</div>
	<div class="mx-5 mb-30 flex flex-col items-center justify-center">
		<div class="mt-6"></div>
		{#each visibleHabitsGroupedByList as list}
			<div class="bg-base-100 collapse-arrow collapse mt-3 max-w-140 rounded-xl border-[1.5px] border-(--border-color)">
				<HabitListTitle {data} {visibleHabitsGroupedByList} {list} />

				<div class="collapse-content text-sm">
					<ul class="list">
						{#each list.habits as habit}
							<li class="list-row -mt-1 items-center px-0 py-2.5">
								<ProgressCircle {habit} {selectedDate} />
								<div>
									<div class="flex flex-col items-baseline justify-between gap-1 sm:flex-row sm:items-center">
										<HabitTitle {habit} {selectedDate} />
										<HabitCompletionInfo {habit} {selectedDate} />
									</div>
								</div>
								<div>
									<button
										onclick={() => openHabitDetailModal(habit)}
										class="btn btn-square btn-ghost h-8 w-8 text-2xl text-gray-400">+</button
									>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}

		{#if habitsGroupedByList.every((list) => list.habits.length === 0)}
			<div class="prose mt-6 text-center">
				<p>You have nothing to track yet. Let's add your first habit!</p>
				<a href="/app/manage-habits" class="btn btn-primary mt-5">Manage habits →</a>
			</div>
		{:else if visibleHabitsGroupedByList.length === 0}
			<div class="prose mt-6 text-center">
				<p>You have no habits to track for this day.</p>
			</div>
		{/if}
	</div>
{/if}

<Datepicker bind:selectedDate />
