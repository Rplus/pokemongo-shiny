<script>
	import { pm_data, } from '@lib/pm.svelte.js';
	import { _, } from 'svelte-i18n';
	import { ordered_style, get_item, set_item, } from '@lib/u.js';
	import { config, } from '@/stores.js';

	let { tags, } = pm_data;

	let cached_tags = get_item('checked_tags') || [];

	let is_cap = $state(get_item('filter_is_cap') || false);

	let tags_cloud = $state(
		Object.keys(tags).sort().map(tag => {
			return {
				label: tag,
				checked: cached_tags.includes(tag),
				count: tags[tag].length,
			};
		})
	);

	let primary_tags = $derived.by(() => tags_cloud.filter(tag => !tag.label.startsWith('-')));
	let complement_tags = $derived.by(() => tags_cloud.filter(tag => tag.label.startsWith('-')));

	$effect(() => {
		set_item('filter_is_cap', is_cap);
	})

	let style = $derived.by(() => {
		let _tags = tags_cloud.map(tag => tag.checked && tag.label).filter(Boolean);
		set_item('checked_tags', _tags);

		if (!_tags.length) {
			return '';
		}

		let selectors = '';
		if (is_cap) {
			selectors = '.pm-list .pm' + _tags.map(tag => `.tag-${tag}`).join('');
		} else {
			selectors = _tags.map(tag => `.pm-list .pm.tag-${tag}`).join(',');
		}
		return ordered_style + selectors + `{ display:flex; }`;
	});

	function invert_selection_tags() {
		tags_cloud.forEach(tag => {
			tag.checked = !tag.checked;
		})
	}

	function reset_tags() {
		is_cap = false;
		tags_cloud.forEach(tag => {
			tag.checked = false;
		})
	}

	let style_tag = 'style';

</script>

<details bind:open={$config.open_tags} class="tag-details">
	<summary accesskey="t" class="hide-for-print">
		🔖 {$_('tag')}
		<label>
			<input class="switcher" type="checkbox" data-inactive="∪" data-active="∩"
				title={is_cap ? $_('tag.intersection_selected') : $_('tag.union_selected')}
				bind:checked={is_cap}
			/>
		</label>
	</summary>


	<div class="filter-box margin:auto" style="max-width: var(--max-width);">
		<div class="tag-cloud">
			{#each primary_tags as tag (tag.label)}
				<label class="tag" title="count:{tag.count}">
					<input type="checkbox" class="sr-only-u" bind:checked={tag.checked}>
					{tag.label}
					<!-- <sup>({tag.count})</sup> -->
				</label>
			{/each}
		</div>

		{#if complement_tags.length}
			<div class="tag-cloud tag-cloud-complement">
				{#each complement_tags as tag (tag.label)}
					<label class="tag" title="count:{tag.count}">
						<input type="checkbox" class="sr-only-u" bind:checked={tag.checked}>
						{tag.label}
						<!-- <sup>({tag.count})</sup> -->
					</label>
				{/each}
			</div>
		{/if}

		<div class="tag-cloud-actions">
			<input type="reset" onclick={reset_tags}>
			<!-- <input type="button" value={$_('tag.invert_selection')} onclick={invert_selection_tags}> -->
		</div>
		<svelte:element this={style_tag}>{style}</svelte:element>
	</div>
</details>

<style>
	.tag {
		display: inline-flex;
		place-items: center;
		border-radius: 1em;
		padding: .5em 1em;
		line-height: 1;
		border-bottom: 3px solid #0000;
		cursor: pointer;
		text-transform: uppercase;
		color: #fff;
		background-color: #9996;
		text-shadow: 1px 1px 1px #0009;
		font-size: smaller;
		font-weight: 900;

		&:has(input:checked) {
			background-color: var(--pm-grid-color1, #990a);
			border-bottom-color: var(--pm-grid-color2, var(--main-color));
		}
	}

	.switcher {
		appearance: none;
		font-family: monospace;
		font-size: larger;
		cursor: pointer;

		&::after,
		&::before {
			content: attr(data-inactive);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 1px 3px;
			opacity: 0.5;
		}

		&::after {
			content: attr(data-active);
		}

		&:not(:checked)::before,
		&:checked::after {
			box-shadow: inset 0 0 0 1px #6669;
			background-color: #9999;
		}
	}

	.tag-details {
		margin: auto;
		background-color: #9993;
		padding: 0 3vw;

		&[open] {
			padding-bottom: 1em;
		}

		summary {
			text-align: center;
			opacity: 0;
			transition: opacity .3s;

			label {
				display: inline-flex;
				width: fit-content;
				margin: .5em auto;
			}
		}

		&[open] summary,
		&:hover summary {
			opacity: 1;
		}
	}

	.tag-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: .5em;
		place-content: center;
	}

	.tag-cloud-complement {
		margin-top: .5em;
		padding-top: .5em;
		border-top: 1px dashed #0003;
	}

	.tag-cloud-actions {
		max-width: 70%;
		border-top: 1px dashed #0003;
		margin: .5em auto 0;
		padding-top: .5em;
		text-align: center;
	}
</style>
