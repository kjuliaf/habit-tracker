<script lang="ts">
	import { enhance } from '$app/forms';

	let { dialog = $bindable(), deleteHabit } = $props();
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box max-w-lg">
		<form method="dialog">
			<button class="btn btn-md btn-circle btn-ghost absolute top-2 right-2 mt-5 mr-2 text-xl">✕</button>
		</form>

		<h3 class="prose text-error pt-2 text-center text-2xl">Delete habit</h3>
		<p class="mt-4 text-center">
			Are you sure you want to delete the habit <span class="text-error">{deleteHabit?.name}</span>?
		</p>

		<form
			method="POST"
			action={'?/deleteHabit'}
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						dialog?.close();
						setTimeout(() => {
							window.location.reload();
						}, 100);
					}
				};
			}}
			class="py-6"
		>
			<input type="hidden" name="habitId" value={deleteHabit?.id} />

			<div class="flex items-center justify-center gap-3">
				<button class="btn btn-error btn-outline" onclick={dialog?.close()}>Cancel</button>
				<button type="submit" class="btn btn-error">Delete</button>
			</div>
		</form>
	</div>
</dialog>
