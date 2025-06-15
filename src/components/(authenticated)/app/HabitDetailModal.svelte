<script lang="ts">
	import { iconRegistry } from '$lib/utils/iconRegistry';

	let { dialog = $bindable(), habit, date } = $props();
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-md btn-circle btn-ghost absolute top-2 right-2 mt-5 mr-2 text-xl">✕</button>
		</form>

		<h3 class="prose text-primary pt-2 text-center text-2xl">Habit details</h3>

		<div class="flex items-center justify-center gap-2 py-4">
			{#if habit?.icon}
				{@const IconComponent = iconRegistry[habit?.icon].component}
				{@const iconColor = iconRegistry[habit?.icon].color}
				<IconComponent style="color: {iconColor}" />
			{/if}
			<h4 class="prose text-center text-lg">{habit?.name}</h4>
		</div>

		<p class="text-center">#{habit?.displayOrder}</p>
		<p class="text-center">{habit?.description}</p>
		<p class="text-center">Created at: {habit?.createdAt}</p>
		<p class="text-center">{habit?.targetValue} {habit?.unit} {habit?.frequency}</p>
		<p class="text-center">{habit?.frequency === 'custom' ? 'on' : ''} {habit?.days}</p>
		{#if habit?.completions}
			<p class="text-center">Completions count: {Object.keys(habit.completions).length}</p>
		{/if}
	</div>
</dialog>
