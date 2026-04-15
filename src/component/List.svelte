<script>
	import Head from '@comp/Head.svelte';
	import Tag from '@comp/Tag.svelte';
	import Item from '@comp/Item.svelte';
	import Footer from '@comp/Footer.svelte';
	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { config } from '@lib/config.svelte.js';
	import { filter_manager } from '@lib/filter.svelte.js';

	let filter_styles = $derived(
		filter_manager.get_filter_css(pokemonStore.pid_with_tags)
	);

</script>



<svelte:head>
	{@html `<style id="filter-rules">${filter_styles}</style>`}
</svelte:head>

<div class="workspace">

	<Head />

	<Tag />

	{#each pokemonStore.status_counts as count}
		<div>
			{count}
		</div>
	{/each}

	<input type="checkbox" id="list-locker" class="sr-only-u" bind:checked={config.locked} />

	<main class="pm-list">
		{#each pokemonStore.groups as [group_name, pms] (group_name)}
			<div class="pm-group">
				{#each pms as pm (pm.pid)}
					<Item {pm} />
				{/each}
			</div>
		{/each}
	</main>

	<Footer />

</div>



<style>
.workspace {
	color: var(--main-color);
	background-color: var(--main-bgc);
}
#list-locker:checked + .pm-list {
	pointer-events: none;
}
@layer component {
	.pm-group {
		position: relative;
		display: none;
		flex-wrap: wrap;
		place-content: center;
		gap: .5em;

		--group-height: var(--grid-size, 96px);

		content-visibility: auto;
		contain-intrinsic-size: auto var(--group-height);

    @media (max-width: 768px) {
			--group-height: calc(var(--grid-size, 96px) * .75);
    }
	}
}

/* .group-name {
	display: none;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 10;
	pointer-events: none;

	.pm-group:hover & {
		display: block;
	}
} */

.pm-list {
	display: flex;
	flex-wrap: wrap;
	gap: 2em;
	max-width: var(--max-width, 1200px);
	margin: 0 auto;
	padding: 0 3vw 3em;
	text-align: center;
	justify-content: center;

	/* FIXME */
	/* max-height: 50vh; */
	/* overflow-y: scroll; */
}
</style>