<script lang="ts">
	let { data } = $props();
	let user = data?.session?.user;
	let firstName = user?.user_metadata?.first_name;
	import FluentWeatherSunnyLow20Regular from '~icons/fluent/weather-sunny-low-20-regular';
	import Datepicker from '../../../components/(authenticated)/Datepicker.svelte';
	import { iconRegistry } from '$lib/utils/iconRegistry.js';
	import HabitDetailModal from '../../../components/(authenticated)/app/HabitDetailModal.svelte';
	let habitsGroupedByList = data?.habitsGroupedByList || [];
	import StreamlineCheckSolid from '~icons/streamline/check-solid';
	import { browser } from '$app/environment';

	let currentHabit: any = $state(null);
	let isLoaded = $state(false);
	let dialog: HTMLDialogElement | null = $state(null);
	let selectedDate = $state(new Date());

	$effect(() => {
		if (browser) {
			const saved = sessionStorage.getItem('selectedDate');
			if (saved) {
				selectedDate = new Date(saved);
			}
			isLoaded = true;
		}
	});

	$effect(() => {
		if (browser && selectedDate && isLoaded) {
			sessionStorage.setItem('selectedDate', selectedDate.toISOString());
		}
	});

	function openHabitDetailModal(habit: any) {
		currentHabit = habit;
		dialog?.showModal();
	}

	function calcProgress(habit: any) {
		let completionCount = getResult(habit);
		return Math.round((completionCount / habit.targetValue) * 100);
	}

	let filteredHabitsGroupedByList = $derived(
		habitsGroupedByList
			.map((list) => ({
				...list,
				habits: list.habits.filter((habit) => {
					let habitDate = new Date(habit.createdAt);
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

	function checkCustomDay(habit: any) {
		if (habit.frequency === 'custom') {
			const daysStr = String(habit.days);
			let customDays = daysStr.split(',').map((day) => day.trim());
			let currentDay = getWeekdayShort(selectedDate);
			return customDays.includes(currentDay);
		}
		return true;
	}

	function checkAlreadyCompletedWeekMonth(habit: any) {
		if (habit.frequency === 'weekly' || habit.frequency === 'monthly') {
			return getResult(habit) >= habit.targetValue && !habit.completions[selectedDate.toISOString().split('T')[0]];
		}
	}

	function getWeekdayShort(date: Date) {
		const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
		return days[date.getDay()];
	}

	function getPrevWeekDays(date: Date) {
		const days = [];
		const startOfWeek = new Date(date);
		const dayOfWeek = date.getDay();
		const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
		startOfWeek.setDate(date.getDate() + diff);

		for (let i = 0; i < 7; i++) {
			const day = new Date(startOfWeek);
			day.setDate(startOfWeek.getDate() + i);
			if (day <= date) {
				days.push(day.toISOString().split('T')[0]);
			}
		}
		return days;
	}

	function getPrevMonthDays(date: Date) {
		const days = [];
		const year = date.getFullYear();
		const month = date.getMonth();

		for (let day = 1; day <= date.getDate(); day++) {
			const currentDay = new Date(year, month, day, 12, 0, 0);
			days.push(currentDay.toISOString().split('T')[0]);
		}
		return days;
	}

	function getWeeklyAccumulated(habit: any) {
		if (!habit?.completions) return 0;

		const weekDays = getPrevWeekDays(selectedDate);
		return weekDays.reduce((total, dateStr) => {
			return total + (habit.completions[dateStr]?.value ?? 0);
		}, 0);
	}

	function getMonthlyAccumulated(habit: any) {
		if (!habit?.completions) return 0;

		const monthDays = getPrevMonthDays(selectedDate);
		return monthDays.reduce((total, dateStr) => {
			return total + (habit.completions[dateStr]?.value ?? 0);
		}, 0);
	}

	function getResult(habit: any) {
		if (habit.frequency === 'weekly') {
			return getWeeklyAccumulated(habit);
		} else if (habit.frequency === 'monthly') {
			return getMonthlyAccumulated(habit);
		} else {
			return habit.completions[selectedDate.toISOString().split('T')[0]]?.value || 0;
		}
	}
</script>

{#if isLoaded}
	<HabitDetailModal bind:dialog habit={currentHabit} date={selectedDate} />

	<div class="flex flex-col items-center justify-center">
		<div
			class="absolute -z-1 mt-120 h-150 max-h-full w-140 max-w-full bg-[url('/morning-background.png')] bg-cover bg-center bg-no-repeat"
		></div>
	</div>

	<div class="mx-8 mt-22 mb-30 flex flex-col items-center justify-center">
		<div class="prose prose-sm">
			<h1 class="text-primary">Good morning, {firstName}!</h1>
		</div>

		<div class="mt-6"></div>
		{#each visibleHabitsGroupedByList as list}
			<div class="bg-base-100 collapse-arrow collapse mt-3 max-w-140 rounded-xl border-[1.5px] border-(--border-color)">
				<input type="checkbox" checked />
				<div class="collapse-title font-semibold opacity-50">
					<h2 class="flex h-6 items-center gap-1.5 text-sm">
						<FluentWeatherSunnyLow20Regular class="h-5 w-5" />
						{list.name}
					</h2>
				</div>

				<div class="collapse-content text-sm">
					<ul class="list">
						{#each list.habits as habit}
							<li class="list-row -mt-1 items-center px-0 py-2.5">
								<div class="pt-1 pl-1">
									<div class="relative">
										<!-- Border circle -->
										<div class="border-base-300 absolute inset-0 rounded-full border-[3px]"></div>
										<!-- Progress on top -->
										<div
											class="radial-progress text-primary relative z-1"
											style="--value:{calcProgress(habit)}; --size:2em; --thickness: 3px;"
											aria-valuenow={calcProgress(habit)}
											role="progressbar"
										>
											{#if calcProgress(habit) < 100}
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
								<div>
									<div>{habit.name}</div>
									<div class="text-xs opacity-60">
										{getResult(habit)}/{habit.targetValue}
										{habit.unit}
										{habit.frequency === 'weekly' ? 'this week' : habit.frequency === 'monthly' ? 'this month' : ''}
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

<style>
	.radial-progress::before {
		transition: none !important;
	}

	.radial-progress::after {
		transition: none !important;
	}
</style>
