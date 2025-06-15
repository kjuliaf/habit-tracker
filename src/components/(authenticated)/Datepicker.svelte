<script lang="ts">
	import SolarCalendarLinear from '~icons/solar/calendar-linear';
	import MaterialSymbolsArrowBackIosNew from '~icons/material-symbols/arrow-back-ios-new';
	import MaterialSymbolsArrowForwardIos from '~icons/material-symbols/arrow-forward-ios';
	import { browser } from '$app/environment';

	let { selectedDate = $bindable(new Date()) } = $props();

	let myDatepicker: HTMLInputElement | null = null;
	let picker: any;
	/* let selectedDate: Date = $state(new Date()); */

	let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	function goPrevDate() {
		selectedDate = new Date(selectedDate.valueOf() - 1000 * 3600 * 24);
		picker.setDate(selectedDate, true);
	}

	function goNextDate() {
		selectedDate = new Date(selectedDate.valueOf() + 1000 * 3600 * 24);
		picker.setDate(selectedDate, true);
	}

	function dateToString(date: Date): string {
		const weekday = date.toDateString() === new Date().toDateString() ? 'Today' : weekdays[date.getDay()];
		const day = date.getDate();
		const month = months[date.getMonth()];
		return `${weekday} ${month} ${day}`;
	}

	function dateSplit(date: string) {
		const parts = date.split(' ');
		const weekday = parts[0];
		const dayMonth = parts[1] + ' ' + parts[2];
		return [weekday, dayMonth];
	}

	function repositionPicker() {
		if (picker && picker.isVisible()) {
			picker.adjustPosition();
		}
	}

	$effect(() => {
		if (browser && myDatepicker) {
			import('pikaday').then(({ default: Pikaday }) => {
				picker = new Pikaday({
					field: myDatepicker,
					toString(date) {
						return dateToString(date);
					},
					firstDay: 1,
					defaultDate: selectedDate,
					setDefaultDate: true,
					onSelect: function (date) {
						selectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0);
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
</script>

<div
	class="fixed bottom-0 z-1 flex w-full items-center justify-center border-t-[1.5px] border-(--border-color) bg-(--background-color)"
>
	<div class="m-3 flex items-center gap-4">
		<button onclick={goPrevDate}>
			<MaterialSymbolsArrowBackIosNew class="text-primary cursor-pointer" />
		</button>
		<button class="btn btn-primary btn-outline relative h-14 w-36">
			<SolarCalendarLinear class="absolute left-2.5 h-7.5 w-7.5" />
			<input
				type="text"
				readonly
				class="input pika-single absolute h-14 w-36 cursor-pointer opacity-0"
				bind:this={myDatepicker}
			/>

			<div
				class="input pointer-events-none absolute flex h-14 w-36 flex-col items-start justify-center gap-0 bg-transparent pl-12 text-left"
			>
				<p class="font-bold">{dateSplit(dateToString(selectedDate))[0]}</p>
				<p class="-mt-0.5 text-xs">{dateSplit(dateToString(selectedDate))[1]}</p>
			</div>
		</button>
		<button onclick={goNextDate}>
			<MaterialSymbolsArrowForwardIos class="text-primary cursor-pointer" />
		</button>
	</div>
</div>

<style>
	:global(.pika-single:not(input)) {
		margin-left: -5em !important;
	}

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

	@media (max-width: 400px) {
		:global(.pika-single:not(input)) {
			margin-left: 5em !important;
		}
	}
</style>
