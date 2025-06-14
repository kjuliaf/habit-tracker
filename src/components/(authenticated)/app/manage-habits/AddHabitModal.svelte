<script lang="ts">
	import IconPicker from './IconPicker.svelte';
	import { enhance } from '$app/forms';

	let { data, dialog = $bindable() } = $props();
	let habitLists = data?.habitLists || [];

	let icon = $state<string>('none');
	let name = $state<string>('');
	let description = $state<string>('');
	let listId = $state<number>(habitLists[0]?.id || 0);
	let targetValue = $state<number>(1);
	let unit = $state<string>('times');
	let isEveryday = $state(true);
	let days = $state(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);

	const weekdays = [
		{ key: 'mon', label: 'Mon' },
		{ key: 'tue', label: 'Tue' },
		{ key: 'wed', label: 'Wed' },
		{ key: 'thu', label: 'Thu' },
		{ key: 'fri', label: 'Fri' },
		{ key: 'sat', label: 'Sat' },
		{ key: 'sun', label: 'Sun' }
	];

	function toggleEveryday() {
		isEveryday = true;
		days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
	}

	function toggleWeekday(day: string) {
		if (isEveryday) {
			isEveryday = false;
			days = [];
		}
		if (days.includes(day)) {
			days = days.filter((d) => d !== day);
		} else {
			days = [...days, day];
		}
	}

	function handleSubmit() {
		console.log('Habit Name:', name);
		console.log('Description:', description);
		console.log('listId:', listId);
		console.log('Target Value:', targetValue);
		console.log('Unit:', unit);
		console.log('Selected Icon:', icon);
		console.log('Selected Weekdays:', days);
		dialog?.close();
	}
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-xl">
		<form method="dialog">
			<button class="btn btn-md btn-circle btn-ghost absolute top-2 right-2 mt-5 mr-2 text-xl">✕</button>
		</form>

		<h3 class="prose text-primary pt-2 text-center text-2xl">New habit</h3>

		<form
			method="POST"
			action="?/createHabit"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						dialog?.close();
						icon = 'none';
						name = '';
						description = '';
						listId = habitLists[0]?.id || 0;
						targetValue = 1;
						unit = 'times';
						isEveryday = true;
						days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
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
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Daily goal</legend>
				<div class="join w-full">
					<input
						name="targetValue"
						type="number"
						class="input join-item w-full"
						bind:value={targetValue}
						min="1"
						required
					/>
					<select name="unit" class="select join-item w-40" bind:value={unit}>
						<option value="times">times/day</option>
						<option value="glasses">glasses/day</option>
						<option value="ml">ml/day</option>
						<option value="km">km/day</option>
					</select>
				</div>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Days</legend>
				<fieldset class="overflow-hidden">
					<div class="flex flex-wrap items-center gap-2">
						<label class="cursor-pointer">
							<input type="checkbox" class="sr-only" onchange={() => toggleEveryday()} />
							<div class="btn btn-sm {isEveryday ? 'btn-primary' : 'btn-outline opacity-30'}">Everyday</div>
						</label>
						<p class="mx-1 text-xs text-gray-500">or</p>
						{#each weekdays as { key, label }}
							<label class="cursor-pointer">
								<input
									type="checkbox"
									class="sr-only"
									checked={days.includes(key)}
									onchange={() => toggleWeekday(key)}
								/>
								<div
									class="btn btn-sm {days.includes(key) && !isEveryday ? 'btn-primary' : 'btn-outline'} {isEveryday
										? 'opacity-30'
										: ''}"
								>
									{label}
								</div>
							</label>
						{/each}
					</div>
				</fieldset>
			</div>

			<!-- Hidden inputs for complex data -->
			<input type="hidden" name="icon" value={icon} />
			<input type="hidden" name="days" value={JSON.stringify(days)} />

			<div class="text-center">
				<button type="submit" class="btn btn-primary mt-10">Create habit</button>
			</div>
		</form>
	</div>
</dialog>
