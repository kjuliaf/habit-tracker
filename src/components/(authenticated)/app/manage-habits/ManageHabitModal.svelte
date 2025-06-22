<script lang="ts">
	import IconPicker from './IconPicker.svelte';
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';

	let { data, dialog = $bindable(), editHabit, manageHabitModalOpen = $bindable(false) } = $props();
	let habitLists = data?.habitLists || [];

	let icon = $state<string>('none');
	let name = $state<string>('');
	let description = $state<string>('');
	let listId = $state<number>(habitLists[0]?.id || 0);
	let targetValue = $state<number>(1);
	let unit = $state<string>('done');
	let startDate = $state<Date>(new Date());
	let originalStartDate = $state<Date | null>(null);
	let startTime = $state<string>();
	let endTime = $state<string>('');
	let picker: any;
	let frequency: string = $state('daily');
	let days: string[] = $state([]);

	$effect(() => {
		if (editHabit || editHabit === null) {
			icon = editHabit?.icon || 'none';
			name = editHabit?.name || '';
			description = editHabit?.description || '';
			listId = editHabit?.listId || habitLists[0]?.id || 0;
			targetValue = editHabit?.targetValue || 1;
			unit = editHabit?.unit || 'done';
			startDate = editHabit?.startDate ? new Date(editHabit.startDate) : new Date();
			originalStartDate = editHabit?.startDate ? new Date(editHabit.startDate) : null;
			startTime = editHabit?.startTime || '';
			endTime = editHabit?.endTime || '';
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

	function repositionPicker() {
		if (picker && picker.isVisible()) {
			picker.adjustPosition();
		}
	}

	let myDatepicker: HTMLInputElement | null = null;
	$effect(() => {
		if (browser && myDatepicker) {
			import('pikaday').then(({ default: Pikaday }) => {
				picker = new Pikaday({
					field: myDatepicker,
					toString(date) {
						const year = date.getFullYear();
						const month = String(date.getMonth() + 1).padStart(2, '0');
						const day = String(date.getDate()).padStart(2, '0');
						return `${year}-${month}-${day}`;
					},
					firstDay: 1,
					onSelect: function (date) {
						startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
					},
					container: myDatepicker ? myDatepicker.parentElement : undefined,
					reposition: false,
					onOpen() {
						picker.el.classList.add('calendar-2');
					}
				});

				window.addEventListener('resize', repositionPicker);
			});

			return () => {
				if (picker) {
					picker.destroy();
				}
				window.removeEventListener('resize', repositionPicker);
			};
		}
	});

	$effect(() => {
		if (startTime === '') {
			endTime = '';
		}
	});
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog
	bind:this={dialog}
	class="modal"
	onclose={() => setTimeout(() => (manageHabitModalOpen = false), 100)}
	oncancel={() => setTimeout(() => (manageHabitModalOpen = false), 100)}
>
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
				{#if manageHabitModalOpen}
					<IconPicker bind:icon />
				{/if}

				<div class="w-full">
					<legend class="fieldset-legend text-xs text-gray-500">Habit name</legend>
					<input type="text" name="name" class="input w-full" bind:value={name} required />
				</div>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Description</legend>
				<textarea name="description" class="textarea w-full" bind:value={description}></textarea>
			</div>

			<div class="flex gap-2">
				<div class="w-full">
					<legend class="fieldset-legend mt-2 text-xs text-gray-500">Category</legend>
					<select name="listId" class="select w-full" bind:value={listId}>
						{#each habitLists as list}
							<option value={list.id}>{list.name}</option>
						{/each}
					</select>
				</div>
				<div>
					<legend class="fieldset-legend mt-2 text-xs text-gray-500">Start time</legend>
					<input type="time" class="input w-22" bind:value={startTime} name="startTime" />
				</div>
				<div>
					<legend class="fieldset-legend mt-2 text-xs text-gray-500">End time</legend>
					<input type="time" class="input w-22" bind:value={endTime} name="endTime" disabled={!startTime} />
				</div>
			</div>

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Goal</legend>
				<div class="join w-full">
					{#if unit !== 'done'}
						<input
							name="targetValue"
							type="number"
							class="input join-item w-full"
							bind:value={targetValue}
							min="1"
							{...unit === 'done' ? { max: 1 } : {}}
							step={unit === 'km' ? '0.1' : '1'}
							required
						/>
					{/if}

					<select name="unit" class="select join-item {unit === 'done' ? 'w-full' : 'w-40'}" bind:value={unit}>
						<option value="done">Achieve it all</option>
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

			<div class="relative w-full">
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Start date</legend>
				<input
					type="text"
					class="input pika-single w-full"
					bind:this={myDatepicker}
					value={startDate ? startDate.toISOString().split('T')[0] : ''}
				/>
			</div>
			{#if originalStartDate && originalStartDate.getDate() < startDate.getDate()}
				<p class="text-xs text-red-600">*Any habit tracking prior to the new start date will be deleted</p>
			{/if}

			<div>
				<legend class="fieldset-legend mt-2 text-xs text-gray-500">Frequency</legend>

				<div class="flex w-full items-center gap-2">
					{#each frequencyOptions as { key, label }}
						<label class="w-full cursor-pointer">
							<input type="radio" class="sr-only" checked={frequency === key} onchange={() => setFrequency(key)} />
							<div
								class="btn btn-sm btn-block {frequency === key ? 'btn-primary' : 'btn-outline'} {frequency === 'custom'
									? 'opacity-30'
									: ''}"
							>
								{label}
							</div>
						</label>
					{/each}
				</div>

				<div class="divider m-4 text-xs text-gray-500">or choose days</div>

				<div class="flex flex-wrap items-center gap-2 min-[460px]:w-full min-[460px]:flex-nowrap">
					{#each weekdays as { key, label }}
						<label class="cursor-pointer min-[460px]:w-full">
							<input type="checkbox" class="sr-only" checked={days.includes(key)} onchange={() => toggleWeekday(key)} />
							<div
								class="btn btn-sm min-[460px]:btn-block {days.includes(key)
									? 'btn-primary'
									: 'btn-outline'} {frequency !== 'custom' ? 'opacity-30' : ''}"
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
			<input type="hidden" name="startDate" value={startDate.toISOString().split('T')[0]} />

			<div class="text-center">
				<button type="submit" class="btn btn-primary mt-10"> {editHabit ? 'Save changes' : 'Create habit'} </button>
			</div>
		</form>
	</div>
</dialog>

<style>
	:global(.pika-single .is-today .pika-button) {
		border-radius: 0.25rem;
	}

	:global(.pika-single .is-today .pika-button:hover) {
		background: hsl(from var(--color-primary) h s calc(l * 0.93));
		color: var(--color-primary-content) !important;
	}

	:global(.pika-single .is-selected .pika-button:hover) {
		background-color: var(--color-neutral) !important;
		color: var(--color-base-100) !important;
	}

	:global(.calendar-2) {
		margin-left: -100% !important;
		margin-top: -25.5em !important;
	}
</style>
