<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import AppBackground from '../../../../components/(authenticated)/app/habits/AppBackground.svelte';

	let { data } = $props();

	type Mode = 'focus' | 'break';

	const STORAGE_KEY = `focusTimer${data.user?.id}`;

	let focusMinutes = $state(25);
	let breakMinutes = $state(5);

	let mode: Mode = $state('focus');
	let isRunning = $state(false);

	// When running, store the time the session ends
	let endAtMs: number | null = null;
	let remaining = $derived(focusMinutes * 60);

	let interval: ReturnType<typeof setInterval> | null = null;

	function nowMs() {
		return Date.now();
	}

	function totalSecondsFor(m: Mode) {
		return (m === 'focus' ? focusMinutes : breakMinutes) * 60;
	}

	function clamp(n: number, min: number, max: number) {
		return Math.max(min, Math.min(max, n));
	}

	function formatTime(seconds: number) {
		const s = Math.max(0, seconds);
		const m = Math.floor(s / 60);
		const r = s % 60;
		return `${m}:${String(r).padStart(2, '0')}`;
	}

	function computeRemaining() {
		if (!isRunning || endAtMs === null) {
			// Not running: remaining is whatever is currently set for this mode (or loaded)
			return;
		}
		const diff = Math.ceil((endAtMs - nowMs()) / 1000);
		remaining = clamp(diff, 0, totalSecondsFor(mode));
	}

	function save() {
		const payload = {
			focusMinutes,
			breakMinutes,
			mode,
			isRunning,
			endAtMs,
			// also store remaining for paused state
			remaining
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	}

	function load() {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;

		try {
			const data = JSON.parse(raw) as {
				focusMinutes: number;
				breakMinutes: number;
				mode: Mode;
				isRunning: boolean;
				endAtMs: number | null;
				remaining: number;
			};

			focusMinutes = data.focusMinutes ?? focusMinutes;
			breakMinutes = data.breakMinutes ?? breakMinutes;
			mode = data.mode ?? mode;
			isRunning = !!data.isRunning;
			endAtMs = data.endAtMs ?? null;

			// If paused, restore remaining; if running, recompute from endAtMs.
			remaining = data.remaining ?? totalSecondsFor(mode);

			if (isRunning && endAtMs) {
				// If end time already passed while we were away, advance mode appropriately.
				syncIfOverdue();
			} else {
				remaining = clamp(remaining, 0, totalSecondsFor(mode));
			}
		} catch {
			// Ignore corrupted storage
		}
	}

	function startTicker() {
		if (interval) return;
		interval = setInterval(() => {
			if (!isRunning) return;

			// Recompute based on endAtMs so it stays correct even if tab was throttled
			computeRemaining();

			if (remaining <= 0) {
				switchMode(true);
			}

			save();
		}, 250); // 250ms keeps it snappy; remaining is still seconds
	}

	function stopTicker() {
		if (!interval) return;
		clearInterval(interval);
		interval = null;
	}

	function start() {
		if (isRunning) return;

		isRunning = true;

		// If we have remaining from a paused state, set endAt accordingly.
		endAtMs = nowMs() + remaining * 1000;

		startTicker();
		save();
	}

	function pause() {
		if (!isRunning) return;

		// Update remaining based on current time
		computeRemaining();

		isRunning = false;
		endAtMs = null;

		save();
	}

	function reset() {
		isRunning = false;
		endAtMs = null;
		mode = 'focus';
		remaining = totalSecondsFor('focus');
		save();
	}

	function switchMode(autoStart: boolean) {
		// move to next mode
		mode = mode === 'focus' ? 'break' : 'focus';
		remaining = totalSecondsFor(mode);

		if (autoStart) {
			isRunning = true;
			endAtMs = nowMs() + remaining * 1000;
		} else {
			isRunning = false;
			endAtMs = null;
		}

		save();
	}

	// If the user was away for longer than one session, advance correctly.
	function syncIfOverdue() {
		if (!isRunning || endAtMs === null) return;

		let t = nowMs();
		let end = endAtMs;
		let currentMode: Mode = mode;

		// Loop through sessions if we skipped multiple
		// (usually at most 1–2, but this is safe)
		while (t >= end) {
			// switch mode and set new end
			currentMode = currentMode === 'focus' ? 'break' : 'focus';
			const dur = totalSecondsFor(currentMode) * 1000;
			end = end + dur;
		}

		mode = currentMode;
		endAtMs = end;

		remaining = clamp(Math.ceil((endAtMs - t) / 1000), 0, totalSecondsFor(mode));
		save();
	}

	let total = $derived(totalSecondsFor(mode));
	let progress = $derived(total === 0 ? 0 : 100 - (remaining / total) * 100);

	onMount(() => {
		load();

		// If running, recompute remaining and start ticker
		if (isRunning) {
			computeRemaining();
			startTicker();
		}

		// Save when leaving the page
		const onVis = () => {
			if (document.visibilityState === 'hidden') {
				if (isRunning) computeRemaining();
				save();
			}
		};
		document.addEventListener('visibilitychange', onVis);

		return () => document.removeEventListener('visibilitychange', onVis);
	});

	onDestroy(() => {
		stopTicker();
	});
</script>

<div class="flex flex-col items-center justify-center">
	<div class="prose prose-sm mt-22">
		<h1 class="text-primary text-center">Focus timer</h1>

		<div class="flex flex-col items-center gap-6">
			<h2 class="text-2xl font-semibold">
				Now: {mode === 'break' ? 'Break' : 'Focus'}
			</h2>

			<div class="relative mb-4">
				<div class="absolute inset-0 rounded-full border-[20px] border-neutral-300"></div>

				<div class="radial-progress text-primary" style={`--value:${progress}; --size:14rem; --thickness:1.25rem;`}>
					<span class="font-mono text-3xl">{formatTime(remaining)}</span>
				</div>
			</div>

			<div class="flex gap-2 text-sm">
				<label class="input input-ghost border-neutral-300">
					<span class="label">Focus time</span>

					<input
						type="number"
						min="1"
						class="input input-bordered w-10"
						bind:value={focusMinutes}
						disabled={progress > 0}
					/>
				</label>

				<label class="input input-ghost border-neutral-300">
					<span class="label">Break time</span>

					<input
						type="number"
						min="1"
						class="input input-bordered w-10"
						bind:value={breakMinutes}
						disabled={progress > 0}
					/>
				</label>
			</div>

			<div class="grid w-full grid-cols-3 gap-2">
				<button class="btn btn-primary" onclick={start} disabled={isRunning}> Start </button>
				<button class="btn" onclick={pause} disabled={!isRunning}> Pause </button>
				<button class="btn btn-error btn-outline" onclick={reset}> Reset </button>
			</div>
		</div>
	</div>
</div>
