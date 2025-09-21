<script lang="ts">
	import { iconRegistry } from '$lib/utils/iconRegistry';
	import { enhance } from '$app/forms';
	import { getPrevMonthDays, getPrevWeekDays } from '$lib/utils/habitUtils';

	let { dialog = $bindable(), habit, date } = $props();

	let dailyTotal = $derived(habit?.completions?.[date.toISOString().split('T')[0]]?.value);
	let initialRangeValue = $state(0);
	let rangeInputValue = $derived(initialRangeValue);
	let initialManualValue = $state<number | null>(null);
	let manualInputValue = $derived(initialManualValue);
	let initialUncompleted = $state(false);
	let markedUncompleted = $derived(initialUncompleted);

	$effect(() => {
		if (habit) {
			initialRangeValue = 0;
			rangeInputValue = 0;
			initialManualValue = null;
			manualInputValue = null;
			initialUncompleted = false;
			markedUncompleted = false;
		}
	});

	$effect(() => {
		const dateStr = date.toISOString().split('T')[0];

		if (habit?.completions?.[dateStr]?.entryMethod === 'range') {
			initialRangeValue = habit.completions[dateStr].value;
		} else {
			initialRangeValue = 0;
		}
	});

	$effect(() => {
		const dateStr = date.toISOString().split('T')[0];

		if (habit?.completions?.[dateStr]?.entryMethod === 'manual') {
			initialManualValue = habit.completions[dateStr].value;
		} else {
			initialManualValue = null;
		}
	});

	$effect(() => {
		const dateStr = date.toISOString().split('T')[0];

		if (habit?.completions?.[dateStr]?.entryMethod === 'uncompleted') {
			initialUncompleted = true;
		} else {
			initialUncompleted = false;
		}
	});

	let habitUnitShort = $derived(
		habit?.unit === 'done'
			? '✓'
			: habit?.unit === 'times'
				? 'x'
				: habit?.unit === 'minutes'
					? 'min'
					: habit?.unit === 'pages'
						? 'pp.'
						: habit?.unit
	);

	let weekDays = $derived(getPrevWeekDays(date));
	let monthDays = $derived(getPrevMonthDays(date));

	let weeklyTotal = $derived(weekDays.reduce((total, day) => total + (habit?.completions?.[day]?.value || 0), 0));

	let monthlyTotal = $derived(monthDays.reduce((total, day) => total + (habit?.completions?.[day]?.value || 0), 0));

	let customDays: string[] = $state([]);

	$effect(() => {
		// Reset when habit changes
		if (!habit || !habit?.id) {
			customDays = [];
			return;
		}

		if (habit?.frequency?.toLowerCase() !== 'custom' || !habit?.days) {
			customDays = [];
			return;
		}

		const daysStr = String(habit?.days);
		customDays = daysStr
			.split(',')
			.map((day) => day.trim().charAt(0).toUpperCase() + day.trim().slice(1))
			.filter((day) => day.length > 0);
	});
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-xl">
		<form method="dialog">
			<button class="btn btn-md btn-circle btn-ghost absolute top-2 right-2 mt-5 mr-2 text-xl">✕</button>
		</form>

		<h3 class="prose text-primary flex items-center justify-center gap-3 pt-2 text-center text-2xl">
			{#if habit?.icon}
				{@const IconComponent = iconRegistry[habit?.icon].component}
				{@const iconColor = iconRegistry[habit?.icon].color}
				<IconComponent class="min-h-7 min-w-7" style="color: {iconColor}" />
			{/if}
			{habit?.name}
		</h3>

		<p class="mt-2 text-center text-sm">
			{habit?.targetValue}
			{habit?.unit === 'done' ? 'to do' : habit?.unit}
			{habit?.frequency === 'custom' ? 'per day' : habit?.frequency} | {habit?.startTime && habit?.endTime
				? habit?.startTime + '-' + habit?.endTime + ' | '
				: habit?.startTime
					? habit?.startTime + ' | '
					: ''} Since <span class="whitespace-nowrap">{habit?.startDate}</span>
		</p>

		<div class="my-5 flex flex-col gap-4">
			{#if habit?.frequency === 'custom' && customDays.length > 0}
				<div class="rounded-sm border-1 border-(--border-color) pb-2">
					<p class="my-b -mt-2 ml-2 w-max bg-white text-xs font-semibold text-gray-400">Days</p>
					<div class="mx-3 mt-2 mb-1 flex flex-wrap gap-1">
						{#each customDays as day}
							<div class="badge badge-sm badge-outline badge-primary">{day}</div>
						{/each}
					</div>
				</div>
			{/if}

			{#if habit?.description !== ''}
				<div class="rounded-sm border-1 border-(--border-color) pb-2">
					<p class="my-b -mt-2 ml-2 w-max bg-white text-xs font-semibold text-gray-400">Description</p>
					<p class="mx-4 mt-2 mb-1 text-sm">{habit?.description}</p>
				</div>
			{/if}

			<div class="rounded-sm border-1 border-(--border-color) pb-2">
				<p class="my-b -mt-2 ml-2 w-max bg-white text-xs font-semibold text-gray-400">Current progress</p>
				<div class="m-3 flex justify-center">
					{#each [dailyTotal, weeklyTotal, monthlyTotal] as total, i}
						<div class="min-w-15">
							<p class=" text-center text-lg">
								{total > 1000 ? (total / 1000).toFixed(0) + 'K' : (total ?? 0)}<span
									class="ml-0.5 text-[0.625em] text-gray-400"
								>
									{habitUnitShort}
								</span>
							</p>
							<p class="text-center text-xs">this {i === 0 ? 'day' : i === 1 ? 'week' : 'month'}</p>
						</div>
						{#if i < 2}
							<div class="divider divider-horizontal mx-2"></div>
						{/if}
					{/each}
				</div>
			</div>

			<div class="rounded-sm border-1 border-(--border-color) pb-2">
				<p class="my-b -mt-2 ml-2 w-max bg-white text-xs font-semibold text-gray-400">Track progress</p>

				<div class="m-4 flex flex-col items-center justify-center gap-4">
					<form
						class="w-full max-w-xs"
						method="POST"
						action="?/updateCompletion"
						use:enhance={() => {
							return async ({ result }) => {
								if (result.type === 'success') {
									dialog?.close();

									setTimeout(() => {
										window.location.reload();
									}, 100);
								} else if (result.type === 'failure') {
									console.error('Error updating completion:', result.data?.error);
								}
							};
						}}
					>
						<h4 class="text-primary mb-6 text-center text-sm {manualInputValue !== null ? 'text-gray-400' : 'black'}">
							Track progress for {date.toLocaleDateString('en', { month: 'long' })}
							{date.getDate()}
						</h4>

						<div class="w-full max-w-xs">
							<div class="mb-2 flex justify-between text-sm">
								<p class={manualInputValue !== null || markedUncompleted ? 'text-gray-400' : 'black'}>Select value:</p>
								<p
									class="badge {manualInputValue !== null || markedUncompleted
										? 'badge-ghost text-gray-400'
										: 'badge-soft badge-primary'}"
								>
									{rangeInputValue}
									{habit?.unit}
								</p>
							</div>

							<input
								type="range"
								min="0"
								max={habit?.targetValue}
								class="range range-primary range-xs"
								step={habit?.unit === 'km' ? '0.1' : '1'}
								bind:value={rangeInputValue}
								disabled={manualInputValue !== null || markedUncompleted}
							/>

							<div class="mt-2 flex justify-between px-2.5 text-xs">
								{#if habit?.unit === 'done'}
									<span class="-mt-1 text-gray-500">⨉</span>
									<span class="-mt-1 text-gray-500">✓</span>
								{:else}
									<span class="-mt-1 text-gray-500">0</span>
									<span class="-mt-1 text-gray-500">{habit?.targetValue}</span>
								{/if}
							</div>
						</div>

						{#if habit?.unit !== 'done'}
							<div class="divider my-6 text-sm text-gray-500">or</div>

							<div class="mt-2 flex w-full max-w-xs items-center gap-2">
								<p class="w-full text-sm {manualInputValue === null || markedUncompleted ? 'text-gray-400' : 'black'}">
									Enter manually:
								</p>
								<label class="input input-sm">
									<input
										type="number"
										min="0"
										bind:value={manualInputValue}
										step={habit?.unit === 'km' ? '0.1' : '1'}
										disabled={markedUncompleted}
									/>
									<span class="label">{habit?.unit}</span>
								</label>
							</div>
						{/if}

						<div class="divider my-6 text-sm text-gray-500">or</div>

						<div class="flex justify-between">
							<p class="text-sm {markedUncompleted ? 'black' : 'text-gray-400'}">Mark uncompleted:</p>
							<input type="checkbox" bind:checked={markedUncompleted} class="toggle toggle-primary" />
						</div>

						<input type="hidden" name="habitId" value={habit?.id} />
						<input type="hidden" name="habitUnit" value={habit?.unit} />
						<input
							type="hidden"
							name="value"
							value={markedUncompleted ? 0 : manualInputValue !== null ? manualInputValue : rangeInputValue}
						/>
						<input type="hidden" name="completedDate" value={date.toISOString().split('T')[0]} />
						<input
							type="hidden"
							name="entryMethod"
							value={markedUncompleted ? 'uncompleted' : manualInputValue !== null ? 'manual' : 'range'}
						/>

						<div class="mt-8 flex items-center justify-center gap-2">
							<button
								type="submit"
								class="btn btn-sm btn-outline btn-error"
								disabled={rangeInputValue === 0 && manualInputValue === null && !markedUncompleted}
								onclick={() => {
									if (rangeInputValue) rangeInputValue = 0;
									if (manualInputValue) manualInputValue = null;
									if (markedUncompleted) markedUncompleted = false;
								}}
							>
								Clear
							</button>
							<button type="submit" class="btn btn-sm btn-primary">Save changes</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</dialog>
