<script lang="ts">
	let { data } = $props();
	let user = data?.session?.user;
	let firstName = user?.user_metadata?.first_name;
	import FluentWeatherSunnyLow20Regular from '~icons/fluent/weather-sunny-low-20-regular';
	import MaterialSymbolsCheck from '~icons/material-symbols/check';
	import Datepicker from '../../../components/(authenticated)/Datepicker.svelte';
	import { iconRegistry } from '$lib/utils/iconRegistry.js';

	let IconComponent = $derived(iconRegistry['twemoji:shower'].component);
	let iconColor = $derived(iconRegistry['twemoji:shower'].color);

	let OtherIconComponent = $derived(iconRegistry['twemoji:toothbrush'].component);
	let otherIconColor = $derived(iconRegistry['twemoji:toothbrush'].color);
</script>

<div class="flex flex-col items-center justify-center">
	<div class="absolute -z-1 mt-120 h-150 max-h-full w-150 max-w-full bg-[url('morning-background.png')] bg-cover"></div>
</div>

<div class="mx-8 flex flex-col items-center justify-center">
	<div class="prose prose-sm mt-30">
		<h1 class="text-primary">Good morning, {firstName}!</h1>
	</div>

	<div class="bg-base-100 collapse-arrow collapse mt-10 max-w-140 rounded-xl border-[1.5px] border-(--border-color)">
		<input type="checkbox" checked={true} />
		<div class="collapse-title font-semibold opacity-50">
			<h2 class="flex h-6 items-center gap-1.5 text-sm">
				<FluentWeatherSunnyLow20Regular class="h-5 w-5" />
				Morning
			</h2>
		</div>
		<div class="collapse-content text-sm">
			<ul class="list">
				<li class="list-row -mt-1 items-center px-0 py-2.5">
					<div class="flex flex-col items-center gap-0.25 pt-1 pl-1">
						<div class="relative">
							<!-- Border circle -->
							<div class="border-base-300 absolute inset-0 rounded-full border-[2.5px]"></div>
							<!-- Progress on top -->
							<div
								class="radial-progress text-primary relative z-1"
								style="--value:100; --size:2em; --thickness: 2.5px;"
								aria-valuenow="100"
								role="progressbar"
							>
								<MaterialSymbolsCheck class="mt-0.5 h-6 w-6" />
							</div>
						</div>
					</div>
					<div>
						<div>Drink a glass of water</div>
						<div class="text-xs opacity-60">500/500 ml</div>
					</div>
					<div>
						<button class="btn btn-square btn-ghost h-8 w-8 text-2xl text-gray-400">+</button>
					</div>
				</li>

				<li class="list-row -mt-1 items-center px-0 py-2.5">
					<div class="flex flex-col items-center gap-0.25 pt-1 pl-1">
						<div class="relative">
							<!-- Border circle -->
							<div class="border-base-300 absolute inset-0 rounded-full border-[2.5px]"></div>
							<!-- Progress on top -->
							<div
								class="radial-progress text-primary relative z-1"
								style="--value:50; --size:2em; --thickness: 2.5px;"
								aria-valuenow="50"
								role="progressbar"
							>
								<OtherIconComponent class="mx-auto h-4 w-4" style="color: {otherIconColor}" />
							</div>
						</div>
					</div>
					<div>
						<div>Brush teeth</div>
						<div class="text-xs opacity-60">1/2 minutes</div>
					</div>
					<div>
						<button class="btn btn-square btn-ghost h-8 w-8 text-2xl text-gray-400">+</button>
					</div>
				</li>

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
								<IconComponent class="mx-auto h-4 w-4" style="color: {iconColor}" />
							</div>
						</div>
					</div>
					<div>
						<div>Take a shower</div>
						<div class="text-xs opacity-60">0/1 times</div>
					</div>
					<div>
						<button class="btn btn-square btn-ghost h-8 w-8 text-2xl text-gray-400">+</button>
					</div>
				</li>
			</ul>
		</div>
	</div>

	<div class="bg-base-100 collapse-arrow collapse mt-3 max-w-140 rounded-xl border-[1.5px] border-(--border-color)">
		<input type="checkbox" />
		<div class="collapse-title font-semibold opacity-50">
			<h2 class="flex h-6 items-center gap-1.5 text-sm">
				<FluentWeatherSunnyLow20Regular class="h-5 w-5" />
				Day
			</h2>
		</div>
	</div>

	<div class="bg-base-100 collapse-arrow collapse mt-3 max-w-140 rounded-xl border-[1.5px] border-(--border-color)">
		<input type="checkbox" />
		<div class="collapse-title font-semibold opacity-50">
			<h2 class="flex h-6 items-center gap-1.5 text-sm">
				<FluentWeatherSunnyLow20Regular class="h-5 w-5" />
				Night
			</h2>
		</div>
	</div>
</div>

<Datepicker />
