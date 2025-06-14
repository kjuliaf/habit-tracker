<script lang="ts">
	import AddHabitModal from '../../../../components/(authenticated)/app/manage-habits/AddHabitModal.svelte';

	let dialog: HTMLDialogElement;

	function openAddHabitModal() {
		dialog.showModal();
	}
</script>


<AddHabitModal bind:dialog />

<div class="mx-8 flex flex-col items-center justify-center">
	<div class="prose prose-sm mt-30">
		<h1 class="text-primary">My habits</h1>
		<p>No habits added yet</p>

		<button class="btn btn-primary px-3" on:click={openAddHabitModal}>
			<span class="text-primary flex h-5 w-5 items-center justify-center rounded-md bg-(--background-color) text-xl"
				>+</span
			>
			Habit
		</button>
		<button class="btn btn-primary btn-outline px-3">Manage lists</button>
	</div>
</div>
