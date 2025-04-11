<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	let showHamburgerMenu = false;
	beforeNavigate(() => (showHamburgerMenu = false));

	function setShowHamburgerMenu(show: boolean) {
		showHamburgerMenu = show;
	}
</script>

<header class="navbar absolute z-2 flex justify-between border-b-2 border-(--border-color) p-4 sm:px-6">
	<!-- Logo -->
	<div class="flex items-center gap-2">
		<a href="/"><img src="logo.png" alt="HabitZen Logo" class="w-[140px] sm:w-[150px]" /></a>
	</div>

	<!-- Buttons for desktop -->
	<div class="hidden gap-3 sm:flex">
		<a href="/register" class="btn btn-primary btn-outline">Register</a>
		<a href="/login" class="btn btn-primary">Log in</a>
	</div>

	<!-- Hamburger menu icon for mobile -->
	<label class="swap swap-rotate sm:hidden">
		<!-- This hidden checkbox controls the state -->
		<input type="checkbox" bind:checked={showHamburgerMenu} on:click={() => setShowHamburgerMenu(!showHamburgerMenu)} />

		<!-- Hamburger icon -->
		<svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 512 512">
			<path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
		</svg>

		<!-- Close icon -->
		<svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 512 512">
			<polygon
				points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49"
			/>
		</svg>
	</label>
</header>

<!-- Hamburger menu content -->
<div
	class="absolute flex {showHamburgerMenu ? '' : 'hidden'} 
	top-0 right-0 h-75 w-full border-b-2 border-(--border-color) bg-(--background-color) sm:hidden"
>
	<div class="m-auto flex w-full flex-col items-center gap-6 p-8 pt-24">
		<a href="/register" class="btn btn-primary btn-outline btn-block">Register</a>
		<a href="/login" class="btn btn-primary btn-block">Log in</a>
	</div>
</div>
