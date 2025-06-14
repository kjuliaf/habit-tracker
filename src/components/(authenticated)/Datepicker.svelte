<script lang="ts">
	import HugeiconsCalendar03 from '~icons/hugeicons/calendar-03';
	import MaterialSymbolsArrowBackIosNew from '~icons/material-symbols/arrow-back-ios-new';
	import MaterialSymbolsArrowForwardIos from '~icons/material-symbols/arrow-forward-ios';
</script>

<div
	class="fixed bottom-0 z-1 flex w-full items-center justify-center border-t-[1.5px] border-(--border-color) bg-(--background-color)"
>
	<MaterialSymbolsArrowBackIosNew class="cursor-pointer text-gray-400" />
	<div class="m-3 flex items-center gap-4">
		<button class="btn btn-sm btn-outline py-5 text-gray-400">
			<div>
				<p class="text-center font-bold">Mon</p>
				<p class="text-center text-xs">June 13</p>
			</div>
		</button>

		<button class="btn btn-primary btn-outline py-6">
			<HugeiconsCalendar03 class="h-7 w-7" />
			<div>
				<p class="text-center font-bold">Today</p>
				<p class="text-center text-xs">June 14</p>
			</div>
		</button>

		<button class="btn btn-sm btn-outline py-5 text-gray-400">
			<div>
				<p class="text-center font-bold">Wed</p>
				<p class="text-center text-xs">June 15</p>
			</div>
		</button>

		<MaterialSymbolsArrowForwardIos class="cursor-pointer text-gray-400" />
	</div>
</div>
