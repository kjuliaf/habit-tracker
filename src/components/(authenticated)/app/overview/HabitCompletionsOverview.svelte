<script lang="ts">
	import StreamlineCheckSolid from '~icons/streamline/check-solid';

	type Frequency = 'daily' | 'weekly' | 'monthly';

	type Days = string[] | null;

	type Completions =
		| Record<string, { completedDate: string | Date }>
		| Array<{ completedDate: string | Date }>
		| null
		| undefined;

	let { completions, viewMonth, frequency, days } = $props() as {
		completions: Completions;
		viewMonth: Date;
		frequency: Frequency;
		days: Days;
	};

	const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

	function startOfMonth(d: Date) {
		return new Date(d.getFullYear(), d.getMonth(), 1);
	}

	function endOfMonth(d: Date) {
		return new Date(d.getFullYear(), d.getMonth() + 1, 0);
	}

	function addDays(d: Date, days: number) {
		const x = new Date(d);
		x.setDate(x.getDate() + days);
		return x;
	}

	function pad2(n: number) {
		return String(n).padStart(2, '0');
	}

	function toYMD(d: Date) {
		const y = d.getFullYear();
		const m = pad2(d.getMonth() + 1);
		const day = pad2(d.getDate());
		return `${y}-${m}-${day}`;
	}

	function completionDateToYMD(input: string | Date) {
		if (input instanceof Date) return toYMD(input);
		if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

		const parsed = new Date(input);
		if (!Number.isNaN(parsed.getTime())) return toYMD(parsed);

		return String(input);
	}

	const completionSet = $derived.by(() => {
		const set = new Set<string>();
		if (!completions) return set;

		if (Array.isArray(completions)) {
			for (const c of completions) set.add(completionDateToYMD(c.completedDate));
		} else {
			for (const [key, c] of Object.entries(completions)) {
				const ymd = c?.completedDate ? completionDateToYMD(c.completedDate) : key;
				set.add(ymd);
			}
		}
		return set;
	});

	function mondayIndex(d: Date) {
		return (d.getDay() + 6) % 7;
	}

	function weekCompleted(weekStart: Date) {
		// weekStart is Monday
		for (let i = 0; i < 7; i++) {
			if (completionSet.has(toYMD(addDays(weekStart, i)))) return true;
		}
		return false;
	}

	function monthCompleted() {
		const first = startOfMonth(viewMonth);
		const last = endOfMonth(viewMonth);
		for (let d = new Date(first); d <= last; d = addDays(d, 1)) {
			if (completionSet.has(toYMD(d))) return true;
		}
		return false;
	}

	type Cell = {
		kind: 'day' | 'week' | 'month';
		date: Date;
		ymd: string;
		inMonth: boolean;
		completed: boolean;
		colSpan: number;
		label?: string;
		includesDay: boolean;
	};

	const cells = $derived.by(() => {
		const first = startOfMonth(viewMonth);
		const startOffset = mondayIndex(first);

		const gridStart = new Date(first);
		gridStart.setDate(first.getDate() - startOffset);

		if (frequency === 'monthly') {
			return [
				{
					kind: 'month',
					date: first,
					ymd: `${first.getFullYear()}-${pad2(first.getMonth() + 1)}`,
					inMonth: true,
					completed: monthCompleted(),
					colSpan: 7,
					label: `${first.toLocaleDateString('en-US', { month: 'long' })} ${startOfMonth(first).getDate()}–${endOfMonth(first).getDate()}`,
					includesDay: true
				} satisfies Cell
			];
		}

		if (frequency === 'weekly') {
			const result: Cell[] = [];
			for (let w = 0; w < 6; w++) {
				const weekStart = addDays(gridStart, w * 7);
				const weekEnd = addDays(weekStart, 6);

				// consider it "inMonth" if any day in that week is in the current month
				const inMonth = weekStart.getMonth() === viewMonth.getMonth() || weekEnd.getMonth() === viewMonth.getMonth();

				const completed = weekCompleted(weekStart);

				const sameMonth = weekStart.getMonth() === weekEnd.getMonth();

				const label = `${weekStart.toLocaleDateString('en-US', { month: 'long' })} ${weekStart.getDate()}–${!sameMonth ? weekEnd.toLocaleDateString('en-US', { month: 'long' }) : ''}${!sameMonth ? ' ' : ''}${weekEnd.getDate()}`;

				result.push({
					kind: 'week',
					date: weekStart,
					ymd: `week-${toYMD(weekStart)}`,
					inMonth,
					completed,
					colSpan: 7,
					label,
					includesDay: true
				});
			}
			return result;
		}

		const result: Cell[] = [];
		for (let i = 0; i < 42; i++) {
			const d = addDays(gridStart, i);
			const ymd = toYMD(d);
			const inMonth = d.getMonth() === viewMonth.getMonth();
			const completed = completionSet.has(ymd);

			let includesDay = true;
			if (days && days.length > 0) {
				if (!days.includes(new Date(d).toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase())) {
					includesDay = false;
				}
			}

			result.push({
				kind: 'day',
				date: d,
				ymd,
				inMonth,
				completed,
				colSpan: 1,
				includesDay: includesDay
			});
		}
		return result;
	});
</script>

<div class="w-full max-w-md">
	<div class="mb-1 grid grid-cols-7 text-xs opacity-70">
		{#if frequency === 'daily' || (days && days?.length > 0)}
			{#each WEEKDAYS as w}
				<div class="px-2 py-1 text-center">{w}</div>
			{/each}
		{/if}
	</div>

	<div class="mx-2 grid grid-cols-7 gap-1 pb-4">
		{#each cells as cell (cell.ymd)}
			<div
				style={`grid-column: span ${cell.colSpan};`}
				class={[
					'm-0.5 flex items-center justify-center rounded-full border border-neutral-200 text-xs select-none',
					cell.kind === 'day' && 'aspect-square',
					cell.kind === 'week' && 'h-8 rounded-sm',
					cell.kind === 'month' && 'h-55 rounded-sm',
					!cell.inMonth && cell.kind === 'day' && 'opacity-20',
					!cell.inMonth && cell.kind === 'week' && 'opacity-0',
					cell.completed && cell.inMonth ? 'bg-primary text-primary-content' : 'bg-base-200',
					!cell.includesDay && 'opacity-20'
				].join(' ')}
				title={cell.ymd}
			>
				{#if cell.completed && (cell.kind == 'week' || cell.kind == 'month')}
					<div class="flex items-center gap-1">
						<StreamlineCheckSolid class="h-3 w-3" />
						{cell.label}
					</div>
				{:else if cell.completed}
					<StreamlineCheckSolid class="h-3 w-3" />
				{:else if cell.kind === 'day'}
					{cell.date.getDate()}
				{:else}
					{cell.label}
				{/if}
			</div>
		{/each}
	</div>
</div>
