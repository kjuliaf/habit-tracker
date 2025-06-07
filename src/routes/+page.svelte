<script lang="ts">
	import Header from '../components/Header.svelte';
</script>

<Header />
<div class="bg-[url('background.png')] bg-no-repeat xl:bg-[length:100%_auto]">
	<!-- Landing page information -->
	<div class="flex min-h-dvh flex-col p-8 sm:p-0">
		<div
			class="prose prose-sm sm:prose-base lg:prose-lg prose-h1:text-[2rem] sm:prose-h1:text-[2.5rem] lg:prose-h1:text-[3rem] m-auto flex flex-col items-center py-36"
		>
			<h1 class="text-center">Build better habits and create balance with HabitZen.</h1>
			<p class="mb-12 px-4 text-center sm:mb-14 sm:px-12 lg:mb-16">
				Life moves fast, but true growth comes from slowing down and focusing on what truly matters. HabitZen helps you
				build meaningful habits that bring stability, clarity, and balance to your daily life.
			</p>
			<div class="flex gap-3 sm:gap-5">
				<a href="#about" class="btn btn-md sm:btn-lg btn-primary">Learn more</a>
				<a href="/register" class="btn btn-md sm:btn-lg btn-outline btn-primary">Get started →</a>
			</div>
		</div>
	</div>

	<!-- About information -->
	<div
		class="prose prose-sm sm:prose-base lg:prose-lg align-center mb-24 flex w-full max-w-none scroll-mt-20 justify-center px-8 sm:mb-30 sm:px-12 md:-mt-18 lg:px-16"
		id="about"
	>
		<div class="grid max-w-300 justify-between md:grid-cols-2 md:items-center">
			<div class="max-w-140 place-self-center md:mr-10 md:max-w-full">
				<h2 class="text-primary !mt-0">One step a time</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
				</p>
			</div>
			<img src="demo.png" alt="" class="w-140 place-self-center md:w-full" />
		</div>
	</div>

	<div class="absolute -z-1 -mt-60 h-200 w-full bg-[url('background-section.png')] bg-cover"></div>

	<div
		class="prose prose-sm sm:prose-base lg:prose-lg align-center mb-24 flex w-full max-w-none justify-center px-8 sm:mb-30 sm:px-12 lg:px-16"
	>
		<div class="grid max-w-300 justify-between md:grid-cols-2 md:items-center">
			<div class="max-w-140 place-self-center md:order-last md:ml-16 md:max-w-full">
				<h2 class="text-primary !mt-0">Track your progress</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
				</p>
			</div>
			<img src="demo.png" alt="" class="w-140 place-self-center md:w-full" />
		</div>
	</div>

	<div
		class="prose prose-sm sm:prose-base lg:prose-lg align-center mb-24 flex w-full max-w-none justify-center px-8 sm:mb-30 sm:px-12 lg:px-16"
	>
		<div class="grid max-w-300 justify-between md:grid-cols-2 md:items-center">
			<div class="max-w-140 place-self-center md:mr-10 md:max-w-full">
				<h2 class="text-primary !mt-0">Focus your time</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
					magna aliqua.
				</p>
			</div>
			<img src="demo.png" alt="" class="w-140 place-self-center md:w-full" />
		</div>
	</div>

	<div
		class="prose prose-sm sm:prose-base lg:prose-lg align-center flex w-full max-w-none flex-col items-center justify-center bg-[#E6E7F5] px-8 py-20 sm:px-12 lg:px-16"
	>
		<h2>Try HabitZen today</h2>
		<p>Create an account for free.</p>
		<a href="/register" class="btn btn-md sm:btn-lg btn-outline btn-primary mt-6 sm:mt-8">Get started →</a>
	</div>

	<footer class="flex h-16 items-center justify-center p-20">
		<p class="text-gray-400">Footer content</p>
	</footer>
</div>
