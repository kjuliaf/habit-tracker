<script lang="ts">
	import IconPicker from './IconPicker.svelte';

	export let dialog: HTMLDialogElement;
	let selectedIcon: string;

	// Use separate state for different selection modes
	let isEveryday = true;
	let selectedWeekdays: any[] = []; // Array for multiple weekdays

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
		selectedWeekdays = [];
	}

	function toggleWeekday(day: string) {
		isEveryday = false;

		if (selectedWeekdays.includes(day)) {
			selectedWeekdays = selectedWeekdays.filter((d) => d !== day);
		} else {
			selectedWeekdays = [...selectedWeekdays, day];
		}
	}

	// Computed value for form submission
	$: selectedDays = isEveryday ? 'everyday' : selectedWeekdays.join(',');
</script>

<!-- Open the modal using ID.showModal() method -->
<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-xl">
		<form method="dialog">
			<button class="btn mt-5 mr-2 btn-md text-xl btn-circle btn-ghost absolute top-2 right-2">✕</button>
		</form>

		<h3 class="prose text-primary pt-2 text-center text-2xl">New habit</h3>

		<form action="" class="py-6">
			<div class="flex">
				<IconPicker bind:selectedIcon />

				<div class="w-full">
					<legend class="fieldset-legend text-xs text-gray-500">Habit name</legend>
					<input type="text" class="input w-full" />
				</div>
			</div>

			<div>
				<legend class="fieldset-legend text-xs text-gray-500">Description</legend>
				<textarea class="textarea w-full"></textarea>
			</div>

			<div>
				<legend class="fieldset-legend text-xs text-gray-500">Category</legend>

				<select class="select w-full">
					<option selected>Morning</option>
					<option>Day</option>
					<option>Night</option>
					<option>Other</option>
				</select>
			</div>

			<div>
				<legend class="fieldset-legend text-xs text-gray-500">Daily goal</legend>

				<div class="join w-full">
					<input class="input join-item w-full" value="1" />
					<select class="select join-item w-40">
						<option selected>times/day</option>
						<option>glasses/day</option>
						<option>ml/day</option>
						<option>km/day</option>
					</select>
				</div>
			</div>

			<div>
				<legend class="fieldset-legend text-sm text-gray-500">Days</legend>
				<fieldset class="oversflow-hidden">
					<div class="flex flex-wrap items-center gap-2">
						<label class="cursor-pointer">
							<input type="checkbox" class="sr-only" on:change={() => toggleEveryday()} />
							<div class="btn btn-sm {isEveryday ? 'btn-primary' : 'btn-outline opacity-30'}">Everyday</div>
						</label>
						<p class="text-xs text-gray-500">or</p>
						{#each weekdays as { key, label }}
							<label class="cursor-pointer">
								<input
									type="checkbox"
									class="sr-only"
									checked={selectedWeekdays.includes(key)}
									on:change={() => toggleWeekday(key)}
								/>
								<div
									class="btn btn-sm {selectedWeekdays.includes(key) && !isEveryday
										? 'btn-primary'
										: 'btn-outline'} {isEveryday ? 'opacity-30' : ''}"
								>
									{label}
								</div>
							</label>
						{/each}
					</div>
				</fieldset>
			</div>
			<div class="text-center"><button class="btn btn-primary mt-10">Create habit</button></div>
		</form>
	</div>
</dialog>
