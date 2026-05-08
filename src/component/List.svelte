<script>
	import Head from '@comp/Head.svelte';
	import Tag from '@comp/Tag.svelte';
	import Item from '@comp/Item.svelte';
	import Footer from '@comp/Footer.svelte';
	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { config } from '@lib/config.svelte.js';
	import { filter_manager } from '@lib/filter.svelte.js';
	import { fade } from 'svelte/transition';

	let { isLoading, } = $props();

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
		{#if isLoading || !pokemonStore.groups.length}
			<div class="loader pokeball" out:fade={{ duration: 300 }}></div>
		{:else}
			{#each pokemonStore.groups as [group_name, pms] (group_name)}
				<div class="pm-group">
					{#each pms as pm (pm.pid)}
						{#if !pm._hidden}
							<Item {pm} />
						{/if}
					{/each}
				</div>
			{/each}
		{/if}
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
	position: relative;
	display: flex;
	flex-wrap: wrap;
	gap: 2em;
	max-width: var(--max-width, 1200px);
	margin: 2em auto;
	padding: 0 3vw 3em;
	text-align: center;
	justify-content: center;

	@media (max-width: 600px) {
		gap: 1.5em 1em;
		padding-left: 2vw;
		padding-right: 2vw;
	}

	/* FIXME */
	/* max-height: 50vh; */
	/* overflow-y: scroll; */
}

.loader {
	position: absolute;
	inset: 0;
	margin: auto;
	z-index: 100;
	width: 1em;
	height: 1em;
	background-image:
		radial-gradient(circle at center, #fff 10%, #000 10.5%, #000 18%, #fff0 18.5%),
		linear-gradient(#f00 47%, #000 0%, #000 53%, #fff 0%);
	box-shadow: inset 0 0 0 .06em #000;
	border-radius: 50%;
	font-size: 4rem;
	/* margin: 10vh auto; */

	animation: bounce 1200ms infinite;
	transform-origin: center bottom
}

/* from animate.css */
@keyframes bounce {
	0%,20%,53%,80%,to {
		animation-timing-function: cubic-bezier(.215,.61,.355,1);
		transform: translateZ(0) rotate(0);
	}

	40%,43% {
		transform: translate3d(0,-30px,0);
	}

	40%,43%,70% {
		animation-timing-function: cubic-bezier(.755,.05,.855,.06);
	}

	70% {
		transform: translate3d(0,-15px,0);
	}

	90% {
		transform: translate3d(0,-4px,0);
	}
}

</style>
