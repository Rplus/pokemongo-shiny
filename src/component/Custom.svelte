<script>
	import { i18n } from '@lib/i18n.svelte.js';
	// import { config, DEFAULT_CONFIG } from '@/stores.js';
	import { config, DEFAULT_CONFIG, reset_all_config } from '@lib/config.svelte.js';

	const pm_source_url = {
		type: 'json',
		url: 'https://opensheet.elk.sh/1l1CXHdge8_2F2ifjMY71f23DJ_98Ei2QNZ9rPdBd8jQ/pm2026',
	};

	function reset_data_source() {
		config.source_url = {...DEFAULT_CONFIG.source_url};
	}

	function use_pm_data_source() {
		config.source_url = {...pm_source_url};
	}

</script>

<div>
	<ul>
		<li data-marker="🌐">
			<label>
				{i18n.t('lang')}
				<select bind:value={i18n.lang}>
					{#each i18n.langs as lang}
						<option value={lang}>{lang}</option>
					{/each}
				</select>
			</label>
		</li>

		<hr>

		<li data-marker="🔎">
			<label>
				<input type="checkbox" bind:checked={config.img_diff}>
				{i18n.t('image.diff')}
			</label>
		</li>

		<hr>

		<li data-marker="📌">
			<label>
				<input type="checkbox" bind:checked={config.show_name}>
				{i18n.t('show.name')}
			</label>
		</li>

		<li data-marker="📌">
			<label>
				<input type="checkbox" bind:checked={config.show_suffix}>
				{i18n.t('show.suffix')}
			</label>
		</li>

		<hr>

		<li data-marker="⚠️">

			<details>
				<summary>
					🚧 {i18n.t('custom.source_url')} 🚧
				</summary>

				<div>
					pms:
					<label class="flex gap1" style="margin-bottom:.5em">
						<!-- https://api.npoint.io/6acfd46ce5bfdbca61af -->
						<input type="text"
							tyle="width:4em; flex-grow:1;"
							bind:value={config.source_url.url}
						>
						<select bind:value={config.source_url.type}>
							<option value="csv">csv</option>
							<option value="json">json</option>
						</select>
					</label>

					<div class="flex jc-fe gap2">
						<button type="button" onclick={use_pm_data_source}>
							{i18n.t('custom.default')}
						</button>
						<input type="reset" onclick={reset_data_source}>
					</div>
				</div>
			</details>
		</li>

		<hr>

		<div class="flex">
			<button style="margin:auto" onclick={reset_all_config}>
				{i18n.t('custom.reset_all_config')}
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
