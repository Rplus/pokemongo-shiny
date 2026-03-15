<script>
	import { _, locale, locales } from 'svelte-i18n';
	import { config, default_config } from '@/stores.js';

	const pm_source_url = {
		type: 'json',
		url: 'https://opensheet.elk.sh/1l1CXHdge8_2F2ifjMY71f23DJ_98Ei2QNZ9rPdBd8jQ/pm',
	};

	function reset_data_source() {
		$config.source_url = {...default_config.source_url};
	}

	function use_pm_data_source() {
		$config.source_url = {...pm_source_url};
	}

	function reset_all_config() {
		$config = {...default_config};
	}

</script>

<div>
	<ul>
		<li data-marker="🌐">
			<label>
				{$_('lang')}
				<select bind:value={$locale}>
					{#each $locales as lang}
						<option value={lang}>{lang}</option>
					{/each}
				</select>
			</label>
		</li>

		<hr>

		<li data-marker="🔎">
			<label>
				<input type="checkbox" bind:checked={$config.img_diff}>
				{$_('image.diff')}
			</label>
		</li>

		<hr>

		<li data-marker="📌">
			<label>
				<input type="checkbox" bind:checked={$config.show_name}>
				{$_('show.name')}
			</label>
		</li>

		<li data-marker="📌">
			<label>
				<input type="checkbox" bind:checked={$config.show_suffix}>
				{$_('show.suffix')}
			</label>
		</li>

		<hr>

		<li data-marker="⚠️">

			<details>
				<summary>
					🚧 {$_('custom.source_url')} 🚧
				</summary>

				<div>
					pms:
					<label class="display:flex gap:.25em margin-bottom:.5em">
						<!-- https://api.npoint.io/6acfd46ce5bfdbca61af -->
						<input type="text"
							class="width:4em flex-grow:1"
							bind:value={$config.source_url.url}
						>
						<select bind:value={$config.source_url.type}>
							<option value="csv">csv</option>
							<option value="json">json</option>
						</select>
						<button type="button" onclick={use_pm_data_source}>
							{$_('custom.default')}
						</button>
						<input type="reset" onclick={reset_data_source}>
					</label>
				</div>
			</details>
		</li>

		<hr>

		<div class="display:flex">
			<button class="margin:auto" onclick={reset_all_config}>
				{$_('custom.reset_all_config')}
			</button>
		</div>
	</ul>
</div>


<style>
	li {
		margin-bottom: 1em;

		&::marker {
			content: attr(data-marker) ' ';
		}
	}

</style>
