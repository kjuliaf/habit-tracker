<script lang="ts">
	import AddHabitModal from '../../../../components/(authenticated)/app/manage-habits/AddHabitModal.svelte';

	let { data } = $props();
	let habitLists = data?.habitLists || [];

	let dialog: HTMLDialogElement | null = $state(null);

	function openAddHabitModal() {
		dialog?.showModal();
	}
</script>

<AddHabitModal bind:dialog {data} />

<div class="mx-8 flex flex-col items-center justify-center">
	<div class="prose prose-sm mt-30">
		<h1 class="text-primary">My habits</h1>

		{#each habitLists as list}
			<p>{list.name}</p>
		{/each}

		<button class="btn btn-primary px-3" onclick={openAddHabitModal}>
			<span class="text-primary flex h-5 w-5 items-center justify-center rounded-md bg-(--background-color) text-xl"
				>+</span
			>
			Habit
		</button>
		<button class="btn btn-primary btn-outline px-3">Manage lists</button>
	</div>
</div>
