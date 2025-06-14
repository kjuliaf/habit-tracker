<script lang="ts">
	import { iconRegistry } from '$lib/utils/iconRegistry.js';

	export let icon = 'none';

	$: currentIconConfig = iconRegistry[icon];
</script>

<div>
	<legend class="fieldset-legend text-xs text-gray-500">Icon</legend>
	<div class="dropdown">
		<div tabindex="0" role="button" class="btn btn-circle mr-3 rounded-4xl border-[#D7D7D7] bg-transparent">
			<svelte:component
				this={currentIconConfig.component}
				class="h-5 w-5"
				style="color: {currentIconConfig.color === 'transparent' ? '#D7D7D7' : currentIconConfig.color}"
			/>
		</div>

		<div
			tabindex="0"
			role="menu"
			class="dropdown-content menu bg-base-100 rounded-box z-1 border-1 border-[#D7D7D7] shadow-sm"
		>
			<fieldset class="grid w-70 grid-cols-5">
				{#each Object.entries(iconRegistry) as [iconKey, iconConfig]}
					<div class="form-control">
						<label class="label cursor-pointer">
							<input type="radio" name="icon" class="sr-only" value={iconKey} bind:group={icon} />
							<div
								class="m-1 rounded-lg border-2 p-2 text-center transition-all {icon === iconKey
									? 'border-primary bg-primary/10'
									: 'border-base-300 hover:border-base-400'}"
							>
								<svelte:component
									this={iconConfig.component}
									class="mx-auto h-6 w-6"
									style="color: {iconConfig.color === 'transparent' ? '#D7D7D7' : iconConfig.color}"
								/>
							</div>
						</label>
					</div>
				{/each}
			</fieldset>
		</div>
	</div>
</div>
