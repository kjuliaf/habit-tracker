<script lang="ts">
	import { iconRegistry } from '$lib/utils/iconRegistry';
	import TdesignEdit1 from '~icons/tdesign/edit-1';
	import ManageHabitModal from '../../../../components/(authenticated)/app/manage-habits/ManageHabitModal.svelte';
	import TdesignDelete from '~icons/tdesign/delete';
	import DeleteHabitModal from '../../../../components/(authenticated)/app/manage-habits/DeleteHabitModal.svelte';
	import MaterialSymbolsDragIndicator from '~icons/material-symbols/drag-indicator';

	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let habitsGroupedByList = data?.habitsGroupedByList || [];

	let editHabitDialog: HTMLDialogElement | null = $state(null);
	let deleteHabitDialog: HTMLDialogElement | null = $state(null);
	let currentHabit: any = $state(null);
	let manageHabitModalOpen = $state(false);

	function openManageHabitModal(habit: any) {
		currentHabit = habit;
		manageHabitModalOpen = true;
		editHabitDialog?.showModal();
	}

	function openDeleteHabitModal(habit: any) {
		currentHabit = habit;
		deleteHabitDialog?.showModal();
	}

	onMount(() => {
		document.querySelectorAll('[data-sortable]').forEach((element) => {
			Sortable.create(element as HTMLElement, {
				handle: '.drag-handle',
				animation: 150,
				onEnd: async () => {
					const habitElements = [...(element as HTMLElement).children];

					const habitUpdates = habitElements.map((el, index) => ({
						id: parseInt(el.getAttribute('data-habit-id') ?? '0'),
						displayOrder: index + 1
					}));

					const formData = new FormData();
					formData.append('habitUpdates', JSON.stringify(habitUpdates));
					await fetch('?/reorderHabits', { method: 'POST', body: formData });
					await invalidateAll();
				}
			});
		});
	});
</script>

<ManageHabitModal bind:dialog={editHabitDialog} {data} editHabit={currentHabit} bind:manageHabitModalOpen />
<DeleteHabitModal bind:dialog={deleteHabitDialog} deleteHabit={currentHabit} />

<div class="mx-8 flex flex-col items-center justify-center">
	<div class="prose prose-sm my-22 w-full max-w-140">
		<h1 class="text-primary mb-10 text-center">My habits</h1>

		{#each habitsGroupedByList as list}
			<div class="mb-6">
				<h2 class="!mb-0 text-sm font-semibold">{list.name}</h2>
				<div class="divider !mb-0"></div>

				{#if list.habits.length > 0}
					<div data-sortable data-list-id={list.id}>
						{#each list.habits as habit}
							<div
								data-habit-id={habit.id}
								class="bg-base-100 my-2 flex items-center justify-between rounded-xl border-[1.5px] border-(--border-color) p-2.5 px-4"
							>
								<div class="flex items-center gap-2.5">
									{#if habit.icon}
										{@const IconComponent = iconRegistry[habit.icon].component}
										{@const iconColor = iconRegistry[habit.icon].color}
										<IconComponent class="min-h-5 min-w-5" style="color: {iconColor}" />
									{/if}
									<div>{habit.name}</div>
								</div>

								<div class="flex items-center gap-1">
									<div class="drag-handle cursor-grab p-1">
										<MaterialSymbolsDragIndicator class="h-5 w-5 text-gray-400" />
									</div>
									<button class="cursor-pointer p-1" onclick={() => openManageHabitModal(habit)}>
										<TdesignEdit1 class="h-5 w-5 text-gray-400" />
									</button>
									<button class="cursor-pointer p-1" onclick={() => openDeleteHabitModal(habit)}>
										<TdesignDelete class="text-error h-5 w-5" />
									</button>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="!mt-0 text-sm text-gray-500 italic">No habits in this list yet</p>
				{/if}
			</div>
		{/each}

		<div class="mt-8 flex items-center justify-center gap-3">
			<button class="btn btn-primary px-3" onclick={() => openManageHabitModal(null)}>
				<span
					class="text-primary mr-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-sm bg-(--background-color) text-xl"
					>+</span
				>
				Add habit
			</button>
			<!-- <button class="btn btn-primary btn-outline px-3">Manage lists</button> -->
		</div>
	</div>
</div>
