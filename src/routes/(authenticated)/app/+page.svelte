<script lang="ts">
	let { data } = $props();
	let user = data?.session?.user;
	let firstName = user?.user_metadata?.first_name;
	import FluentWeatherSunnyLow20Regular from '~icons/fluent/weather-sunny-low-20-regular';
	import Datepicker from '../../../components/(authenticated)/Datepicker.svelte';
	import { iconRegistry } from '$lib/utils/iconRegistry.js';
	let habitsGroupedByList = data?.habitsGroupedByList || [];
</script>

<div class="flex flex-col items-center justify-center">
	<div
		class="absolute -z-1 mt-120 h-150 max-h-full w-140 max-w-full bg-[url('/morning-background.png')] bg-cover bg-center bg-no-repeat"
	></div>
</div>

<div class="mx-8 mt-22 mb-30 flex flex-col items-center justify-center">
	<div class="prose prose-sm">
		<h1 class="text-primary">Good morning, {firstName}!</h1>
	</div>

	<div class=" mt-6"></div>

	{#each habitsGroupedByList as list}
		{#if list.habits.length > 0}
			<div class="bg-base-100 collapse-arrow collapse mt-3 max-w-140 rounded-xl border-[1.5px] border-(--border-color)">
				<input type="checkbox" checked={list.name === 'Morning'} />
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
								<div class="flex flex-col items-center gap-0.25 pt-1 pl-1">
									<div class="relative">
										<!-- Border circle -->
										<div class="border-base-300 absolute inset-0 rounded-full border-[2.5px]"></div>
										<!-- Progress on top -->
										<div
											class="radial-progress text-primary relative z-1"
											style="--value:0; --size:2em; --thickness: 2.5px;"
											aria-valuenow="0"
											role="progressbar"
										>
											{#if habit.icon}
												{@const IconComponent = iconRegistry[habit.icon].component}
												{@const iconColor = iconRegistry[habit.icon].color}
												<IconComponent style="color: {iconColor}" />
											{/if}
										</div>
									</div>
								</div>
								<div>
									<div>{habit.name}</div>
									<div class="text-xs opacity-60">0/{habit.targetValue} {habit.unit}</div>
								</div>
								<div>
									<button class="btn btn-square btn-ghost h-8 w-8 text-2xl text-gray-400">+</button>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		{/if}
	{/each}
</div>

<Datepicker />
