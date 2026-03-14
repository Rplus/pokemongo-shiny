<script>
	import { pm_data, } from '@lib/pm.svelte.js';
	import { _, } from 'svelte-i18n';
	import { ordered_style, flat_group_style, get_item, set_item, } from '@lib/u.js';
	import { config, } from '@/stores.js';

	let { tags, } = pm_data;

	let cached_tags = get_item('checked_tags') || [];

	let is_cap = $state(get_item('filter_is_cap') || false);
	let is_exclude = $state(get_item('filter_is_exclude') || false);

	let tags_cloud = $state(
		Object.keys(tags).sort().map(tag => {
			return {
				label: tag,
				checked: cached_tags.includes(tag),
				count: tags[tag].length,
			};
		})
	);

	$effect(() => {
		set_item('filter_is_cap', is_cap);
	})

	$effect(() => {
		set_item('filter_is_exclude', is_exclude);
	})

	function get_selectors(tags = []) {
		if (is_cap) {
			return '.pm-list .pm' + tags.map(tag => `.tag-${tag}`).join('');
		}
		return tags.map(tag => `.pm-list .pm.tag-${tag}`).join(',');
	}

	let style = $derived.by(() => {
		let _tags = tags_cloud.map(tag => tag.checked && tag.label).filter(Boolean);
		set_item('checked_tags', _tags);

		if (!_tags.length) {
			return '';
		}

		let selectors = get_selectors(_tags);
		if (is_exclude) {
			return flat_group_style + selectors + `{ display:none !important; }`;
		}
		return ordered_style + selectors + `{ display:flex; }`;
	});

	function reset_tags() {
		is_cap = false;
		is_exclude = false;
		tags_cloud.forEach(tag => {
			tag.checked = false;
		})
	}

	let style_tag = 'style';

</script>

<details bind:open={$config.open_tags} class="tag-details margin:auto background-color:#9993 padding:0|3vw">
	<summary class="text-align:center hide-for-print opacity:0 transition:opacity|.3s"
		accesskey="t">
		🔖 {$_('tag')}
	<span class="display:inline-flex gap:.25em margin:.5em|auto">
		<label class="display:inline-flex width:fit-content">
			<input class="switcher" type="checkbox" data-inactive="∪" data-active="∩"
				title={is_cap ? $_('tag.intersection_selected') : $_('tag.union_selected')}
				aria-label={is_cap ? $_('tag.intersection_selected') : $_('tag.union_selected')}
				bind:checked={is_cap}
			/>
		</label>
		<label class="display:inline-flex width:fit-content">
			<input class="switcher" type="checkbox" data-inactive="show" data-active="hide"
				title={is_exclude ? $_('tag.hide_selected') : $_('tag.show_selected')}
				aria-label={is_exclude ? $_('tag.hide_selected') : $_('tag.show_selected')}
				bind:checked={is_exclude}
			/>
		</label>
	</span>
	</summary>


	<div class="filter-box display:flex align-items:center justify-content:center margin:auto"
		 style="max-width: var(--max-width);"
	>
		<div class="tag-cloud display:flex flex-wrap:wrap gap:.5em place-content:center">
			{#each tags_cloud as tag (tag.label)}
				<label class="tag
					display:inline-flex place-items:center
					border-radius:1em
					padding:.5em|1em
					line-height:1
					border-bottom:3px|solid|#0000
					cursor:pointer
					text-transform:uppercase
					color:#fff
					background-color:#9996
					text-shadow:1px|1px|1px|#0009
					font-size:smaller
					font-weight:900"
					title="count:{tag.count}"
				>
					<input type="checkbox" class="sr-only-u" bind:checked={tag.checked}>
					{tag.label}
					<!-- <sup>({tag.count})</sup> -->
				</label>
			{/each}

			<div class="border-right:1px|dotted height:1em align-self:center"></div>

			<input type="reset" onclick={reset_tags}>
		</div>
		<svelte:element this={style_tag}>{style}</svelte:element>
	</div>
</details>

<style>
	.tag {
		&:has(input:checked) {
			background-color: var(--pm-grid-color1, #990a);
			border-bottom-color: var(--pm-grid-color2, var(--main-color));
		}
	}

	.switcher {
		appearance: none;
		font-family: inherit;
		font-size: smaller;
		cursor: pointer;
		line-height: 1.2;

		&::after,
		&::before {
			content: attr(data-inactive);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 1px 2px;
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

	.tag-details[open] {
		padding-bottom: 1em;
	}
	summary {
		.tag-details[open] &,
		.tag-details:hover & {
			opacity: 1;
		}
	}

</style>
