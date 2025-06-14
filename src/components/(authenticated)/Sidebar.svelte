<script lang="ts">
	import { page } from '$app/state';
	import TablerChecks from '~icons/tabler/checks';
	import TablerChartLine from '~icons/tabler/chart-line';
	import TablerStopwatch from '~icons/tabler/stopwatch';
	import TablerList from '~icons/tabler/list';
	import TablerUser from '~icons/tabler/user';
	import MynauiSidebar from '~icons/mynaui/sidebar'
	import { onMount } from 'svelte';

	let hoverActive = false;
	let mobileMenuOpen = false;
	let isFullScreen = false;

	function setHoverActive(status: boolean) {
		hoverActive = status;
	}

	function toggleOpenMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	// Helper function to check if route is active
	function isActiveRoute(route: string): boolean {
		return page.url.pathname === route;
	}

	function getActiveClasses(route: string): string {
		return isActiveRoute(route) ? 'text-primary bg-[#E1E5F6]' : 'text-gray-500';
	}

	function handleNavClick() {
		mobileMenuOpen = false;
	}

	onMount(() => {
		function handleResize() {
			if (window.innerWidth >= 768) {
				isFullScreen = true;
			} else {
				isFullScreen = false;
			}
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<!-- Backdrop - only shows on mobile when menu is open -->
{#if mobileMenuOpen}
	<button
		class="fixed inset-0 z-2 bg-black opacity-20 transition-opacity duration-300 md:hidden"
		on:click={closeMobileMenu}
		aria-label="Close sidebar menu"
	></button>
{/if}

<!-- For mobile -->
<div class="fixed z-3 h-12 w-full border-b-[1.5px] border-(--border-color) bg-(--background-color) px-4 py-2.5 md:hidden">
	<button aria-label="Open sidebar menu" on:click={toggleOpenMobileMenu}>
		<MynauiSidebar class="min-h-7 min-w-7 cursor-pointer text-gray-500" />
	</button>
</div>

<div
	class="fixed h-full {hoverActive && isFullScreen
		? 'w-60'
		: 'w-18'} z-2 flex-col justify-between border-r-[1.5px] border-(--border-color) bg-(--background-color) transition-[width] duration-300 ease-in-out md:flex {mobileMenuOpen &&
	!isFullScreen
		? 'flex w-60'
		: 'hidden'}"
	on:mouseenter={() => setHoverActive(true)}
	on:mouseleave={() => setHoverActive(false)}
	role="region"
>
	<!-- Top section -->
	<div>
		<div class="h-12 w-full border-b-[1.5px] border-(--border-color) bg-(--background-color) px-4 py-3 md:hidden"></div>
		<div>
			<a
				class="hover:text-primary flex cursor-pointer items-center gap-2.5 border-b-[1.5px] border-(--border-color) px-5 py-3 hover:bg-[#E1E5F6] {getActiveClasses(
					'/app'
				)}"
				href="/app"
				on:click={handleNavClick}
			>
				<TablerChecks class="min-h-8 min-w-8" />
				<p
					class="whitespace-nowrap {!hoverActive && (!mobileMenuOpen || isFullScreen)
						? 'opacity-0'
						: 'opacity-100'} transition-opacity duration-300 {hoverActive ? 'delay-100' : 'delay-0'}"
				>
					Habits
				</p>
			</a>

			<a
				class="hover:text-primary flex cursor-pointer items-center gap-2.5 border-b-[1.5px] border-(--border-color) px-5 py-3 hover:bg-[#E1E5F6] {getActiveClasses(
					'/app/overview'
				)}"
				href="/app/overview"
				on:click={handleNavClick}
			>
				<TablerChartLine class="min-h-8 min-w-8" />
				<p
					class="whitespace-nowrap {!hoverActive && (!mobileMenuOpen || isFullScreen)
						? 'opacity-0'
						: 'opacity-100'} transition-opacity duration-300 {hoverActive ? 'delay-100' : 'delay-0'}"
				>
					Overview
				</p>
			</a>

			<a
				class="hover:text-primary flex cursor-pointer items-center gap-2.5 border-b-[1.5px] border-(--border-color) px-5 py-3 hover:bg-[#E1E5F6] {getActiveClasses(
					'/app/focus-timer'
				)}"
				href="/app/focus-timer"
				on:click={handleNavClick}
			>
				<TablerStopwatch class="min-h-8 min-w-8" />
				<p
					class="whitespace-nowrap {!hoverActive && (!mobileMenuOpen || isFullScreen)
						? 'opacity-0'
						: 'opacity-100'} transition-opacity duration-300 {hoverActive ? 'delay-100' : 'delay-0'}"
				>
					Focus timer
				</p>
			</a>
		</div>
	</div>

	<!-- Bottom section -->
	<div>
		<div>
			<a
				class="hover:text-primary flex cursor-pointer items-center gap-2.5 border-t-[1.5px] border-b-[1.5px] border-(--border-color) px-5 py-3 hover:bg-[#E1E5F6] {getActiveClasses(
					'/app/manage-habits'
				)}"
				href="/app/manage-habits"
				on:click={handleNavClick}
			>
				<TablerList class="min-h-8 min-w-8" />
				<p
					class="whitespace-nowrap {!hoverActive && (!mobileMenuOpen || isFullScreen)
						? 'opacity-0'
						: 'opacity-100'} transition-opacity duration-300 {hoverActive ? 'delay-100' : 'delay-0'}"
				>
					Manage habits
				</p>
			</a>

			<a
				class="hover:text-primary flex cursor-pointer items-center gap-2.5 px-5 py-3 hover:bg-[#E1E5F6] {getActiveClasses(
					'/app/account'
				)}"
				href="/app/account"
				on:click={handleNavClick}
			>
				<TablerUser class="min-h-8 min-w-8" />
				<p
					class="whitespace-nowrap {!hoverActive && (!mobileMenuOpen || isFullScreen)
						? 'opacity-0'
						: 'opacity-100'} transition-opacity duration-300 {hoverActive ? 'delay-100' : 'delay-0'}"
				>
					Account
				</p>
			</a>
		</div>
	</div>
</div>
