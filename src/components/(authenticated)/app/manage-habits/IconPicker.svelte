<script lang="ts">
	import { iconRegistry } from '$lib/utils/iconRegistry.js';

	let { icon = $bindable() } = $props();
	let currentIconConfig = $derived(iconRegistry[icon]);
</script>

<div>
	<legend class="fieldset-legend text-xs text-gray-500">Icon</legend>
	<div class="dropdown">
		<div tabindex="0" role="button" class="btn btn-circle mr-3 rounded-4xl border-[#D7D7D7] bg-transparent">
			{#if currentIconConfig.component}
				{@const IconComponent = currentIconConfig.component}
				{@const iconColor = currentIconConfig.color === 'transparent' ? '#D7D7D7' : currentIconConfig.color}
				<IconComponent class="min-h-5 min-w-5" style="color: {iconColor}" />
			{/if}
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
							<input
								type="radio"
								name="icon"
								class="sr-only"
								value={iconKey}
								bind:group={icon}
								onchange={() => {
									if (document.activeElement) {
										(document.activeElement as HTMLElement).blur();
									}
								}}
							/>
							<div
								class="m-1 rounded-lg border-2 p-2 text-center transition-all {icon === iconKey
									? 'border-primary bg-primary/10'
									: 'border-base-300 hover:border-base-400'}"
							>
								{#if iconConfig.component}
									{@const IconComponent = iconConfig.component}
									{@const iconColor = iconConfig.color === 'transparent' ? '#D7D7D7' : iconConfig.color}
									<IconComponent class="min-h-5 min-w-5" style="color: {iconColor}" />
								{/if}
							</div>
						</label>
					</div>
				{/each}
			</fieldset>
		</div>
	</div>
</div>
