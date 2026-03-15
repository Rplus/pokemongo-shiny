<script>
	import { pm_data, } from '@lib/pm.svelte.js';
	import { _, } from 'svelte-i18n';
	import { ordered_style, flat_group_style, get_item, set_item, } from '@lib/u.js';
	import { config, } from '@/stores.js';

	let { tags, } = pm_data;

	let all_tags = Object.keys(tags).sort();
	let cached_tags = get_cached_tags(all_tags);

	let is_cap = $state(get_item('filter_is_cap') || false);

	let tags_cloud = $state(
		all_tags.map(tag => {
			return {
				label: tag,
				checked: Object.prototype.hasOwnProperty.call(cached_tags, tag),
				inverted: cached_tags[tag] || false,
				count: tags[tag].length,
			};
		})
	);

	$effect(() => {
		set_item('filter_is_cap', is_cap);
	})

	function invert_tag_label(label = '') {
		return label.startsWith('-') ? label.slice(1) : `-${label}`;
	}

	function get_cached_tags(tag_labels = []) {
		let cached_tags = get_item('checked_tags') || [];
		if (Array.isArray(cached_tags)) {
			let lookup = {};
			let remaining_tags = new Set(cached_tags);

			tag_labels.forEach(tag => {
				if (remaining_tags.delete(tag)) {
					lookup[tag] = false;
				}
			});

			tag_labels.forEach(tag => {
				if (remaining_tags.delete(invert_tag_label(tag))) {
					lookup[tag] = true;
				}
			});

			return lookup;
		}

		return Object.entries(cached_tags).reduce((all, [label, value]) => {
			if (value === 'include') {
				all[label] = false;
			} else if (value === 'exclude') {
				all[label] = true;
			} else if (typeof value === 'boolean') {
				all[label] = value;
			} else if (value) {
				all[label] = false;
			}
			return all;
		}, {});
	}

	function invert_tags() {
		tags_cloud.forEach(tag => {
			if (tag.checked) {
				tag.inverted = !tag.inverted;
			}
		})
	}

	function get_tag_display_label(tag) {
		return tag.inverted ? invert_tag_label(tag.label) : tag.label;
	}

	function sync_tag(tag) {
		if (!tag.checked) {
			tag.inverted = false;
		}
	}

	function get_selectors(tags = []) {
		if (is_cap) {
			return '.pm-list .pm' + tags.map(tag => `.tag-${tag}`).join('');
		}
		return tags.map(tag => `.pm-list .pm.tag-${tag}`).join(',');
	}

	let style = $derived.by(() => {
		let selected_tags = tags_cloud.reduce((all, tag) => {
			if (tag.checked) {
				all[tag.label] = tag.inverted;
			}
			return all;
		}, {});
		set_item('checked_tags', selected_tags);

		let include_tags = tags_cloud.filter(tag => tag.checked && !tag.inverted).map(tag => tag.label);
		let exclude_tags = tags_cloud.filter(tag => tag.checked && tag.inverted).map(tag => tag.label);

		if (!include_tags.length && !exclude_tags.length) {
			return '';
		}

		let style = include_tags.length
			? ordered_style + get_selectors(include_tags) + `{ display:flex; }`
			: flat_group_style;

		if (exclude_tags.length) {
			style += get_selectors(exclude_tags) + `{ display:none !important; }`;
		}
		return style;
	});

	function reset_tags() {
		is_cap = false;
		tags_cloud.forEach(tag => {
			tag.checked = false;
			tag.inverted = false;
		})
	}

	let style_tag = 'style';

</script>

<details bind:open={$config.open_tags} class="tag-details margin:auto background-color:#9993 padding:0|3vw">
	<summary class="text-align:center hide-for-print opacity:0 transition:opacity|.3s"
		accesskey="t">
		🔖 {$_('tag')}
	<label class="display:inline-flex width:fit-content margin:.5em|auto">
		<input class="switcher" type="checkbox" data-inactive="∪" data-active="∩"
			title={is_cap ? $_('tag.intersection_selected') : $_('tag.union_selected')}
			bind:checked={is_cap}
		/>
	</label>
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
					<input type="checkbox" class="sr-only-u" bind:checked={tag.checked} onchange={() => sync_tag(tag)}>
					{get_tag_display_label(tag)}
					<!-- <sup>({tag.count})</sup> -->
				</label>
			{/each}

			<div class="border-right:1px|dotted height:1em align-self:center"></div>

			<input type="button" value={$_('tag.invert')} onclick={invert_tags}>
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
