<script lang="ts">
	import FluentWeatherSunnyLow20Regular from '~icons/fluent/weather-sunny-low-20-regular';
	import { browser } from '$app/environment';
	import { isMorning, isAfternoon, isEvening } from '$lib/utils/time';

	let { data, visibleHabitsGroupedByList, list } = $props();

	let categoriesOpen = $state<number[]>([]);
	const STORAGE_KEY = `categoriesOpen${data.user?.id}`;

	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				categoriesOpen = JSON.parse(saved);
			} else {
				const hasMorning = visibleHabitsGroupedByList.some((list: { name: string }) => list.name === 'Morning');
				const hasDay = visibleHabitsGroupedByList.some((list: { name: string }) => list.name === 'Day');
				const hasNight = visibleHabitsGroupedByList.some((list: { name: string }) => list.name === 'Night');

				if (hasMorning && hasDay && hasNight) {
					if (isMorning()) {
						categoriesOpen = [1];
					} else if (isAfternoon()) {
						categoriesOpen = [2];
					} else if (isEvening()) {
						categoriesOpen = [3];
					}
				} else {
					categoriesOpen = visibleHabitsGroupedByList.map((list: { displayOrder: any }) => list.displayOrder);
				}
			}
		}
	});
</script>

<input
	type="checkbox"
	checked={categoriesOpen.includes(list.displayOrder)}
	onchange={(e) => {
		const target = e.target as HTMLInputElement;
		if (target?.checked) {
			if (!categoriesOpen.includes(list.displayOrder)) {
				categoriesOpen = [...categoriesOpen, list.displayOrder];
			}
		} else {
			categoriesOpen = categoriesOpen.filter((order) => order !== list.displayOrder);
		}
		if (browser) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(categoriesOpen));
		}
	}}
/>
<div class="collapse-title font-semibold opacity-50">
	<h2 class="flex h-6 items-center gap-1.5 text-sm">
		<FluentWeatherSunnyLow20Regular class="h-5 w-5" />
		{list.name}
	</h2>
</div>
