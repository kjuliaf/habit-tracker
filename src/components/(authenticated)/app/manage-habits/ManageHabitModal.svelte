<script lang="ts">
	import IconPicker from './IconPicker.svelte';
	import { enhance } from '$app/forms';

	let { data, dialog = $bindable(), editHabit } = $props();
	let habitLists = data?.habitLists || [];

	let icon = $state<string>('none');
	let name = $state<string>('');
	let description = $state<string>('');
	let listId = $state<number>(habitLists[0]?.id || 0);
	let targetValue = $state<number>(1);
	let unit = $state<string>('times');

	let frequency: string = $state('daily');

	let days: string[] = $state([]);

	$effect(() => {
		if (editHabit || editHabit === null) {
			icon = editHabit?.icon || 'none';
			name = editHabit?.name || '';
			description = editHabit?.description || '';
			listId = editHabit?.listId || habitLists[0]?.id || 0;
			targetValue = editHabit?.targetValue || 1;
			unit = editHabit?.unit || 'times';
			frequency = editHabit?.frequency || 'daily';
			days = editHabit?.days || [];
		}
	});

	const weekdays = [
		{ key: 'mon', label: 'Mon' },
		{ key: 'tue', label: 'Tue' },
		{ key: 'wed', label: 'Wed' },
		{ key: 'thu', label: 'Thu' },
		{ key: 'fri', label: 'Fri' },
		{ key: 'sat', label: 'Sat' },
		{ key: 'sun', label: 'Sun' }
	];

	let frequencyOptions = [
		{ key: 'daily', label: 'Daily' },
		{ key: 'weekly', label: 'Weekly' },
		{ key: 'monthly', label: 'Monthly' }
	];

	function setFrequency(frequencyOption: string) {
		days = [];
		frequency = frequencyOption;
	}

	function toggleWeekday(day: string) {
		frequency = 'custom';

		if (days.includes(day)) {
			days = days.filter((d: string) => d !== day);
		} else {
			days = [...days, day];
		}
	}
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-xl">
		<form method="dialog">
			<button class="btn btn-md btn-circle btn-ghost absolute top-2 right-2 mt-5 mr-2 text-xl">✕</button>
		</form>

		<h3 class="prose text-primary pt-2 text-center text-2xl">{editHabit ? 'Edit habit' : 'New habit'}</h3>

		<form
			method="POST"
			action={editHabit ? '?/updateHabit' : '?/createHabit'}
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						dialog?.close();
						setTimeout(() => {
							window.location.reload();
						}, 100);
					}
				};
			}}
			class="py-6"
		>
			<div class="flex">
				<IconPicker bind:icon />

				<div class="w-full">
					<legend class="fieldset-legend text-xs text-gray-500">Habit name</legend>
					<input type="text" name="name" class="input w-full" bind:value={name} required />
				</div>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Description</legend>
				<textarea name="description" class="textarea w-full" bind:value={description}></textarea>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Category</legend>
				<select name="listId" class="select w-full" bind:value={listId}>
					{#each habitLists as list}
						<option value={list.id}>{list.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Goal</legend>
				<div class="join w-full">
					<input
						name="targetValue"
						type="number"
						class="input join-item w-full"
						bind:value={targetValue}
						min="1"
						step={unit === 'km' ? '0.1' : '1'}
						required
					/>
					<select name="unit" class="select join-item w-40" bind:value={unit}>
						<option value="times">times</option>
						<option value="minutes">minutes</option>
						<option value="pages">pages</option>
						<option value="km">km</option>
						<option value="steps">steps</option>
						<option value="ml">ml</option>
						<option value="glasses">glasses</option>
					</select>
				</div>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Frequency</legend>

				<div class="items-cente flex flex-wrap gap-2">
					{#each frequencyOptions as { key, label }}
						<label class="cursor-pointer">
							<input type="radio" class="sr-only" checked={frequency === key} onchange={() => setFrequency(key)} />
							<div
								class="btn btn-sm {frequency === key ? 'btn-primary' : 'btn-outline'} {frequency === 'custom'
									? 'opacity-30'
									: ''}"
							>
								{label}
							</div>
						</label>
					{/each}
				</div>

				<div class="divider m-2 text-xs text-gray-500">or choose days</div>

				<div class="flex flex-wrap items-center gap-2">
					{#each weekdays as { key, label }}
						<label class="cursor-pointer">
							<input type="checkbox" class="sr-only" checked={days.includes(key)} onchange={() => toggleWeekday(key)} />
							<div
								class="btn btn-sm {days.includes(key) ? 'btn-primary' : 'btn-outline'} {frequency !== 'custom'
									? 'opacity-30'
									: ''}"
							>
								{label}
							</div>
						</label>
					{/each}
				</div>
			</div>

			<!-- Hidden inputs for complex data -->
			<input type="hidden" name="icon" value={icon} />
			<input type="hidden" name="frequency" value={frequency} />
			<input type="hidden" name="days" value={JSON.stringify(days)} />
			{#if editHabit}
				<input type="hidden" name="habitId" value={editHabit.id} />
			{/if}

			<div class="text-center">
				<button type="submit" class="btn btn-primary mt-10"> {editHabit ? 'Save changes' : 'Create habit'} </button>
			</div>
		</form>
	</div>
</dialog>
