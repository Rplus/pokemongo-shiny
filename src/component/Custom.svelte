<script>
	import { i18n } from '@lib/i18n.svelte.js';
	// import { config, DEFAULT_CONFIG } from '@/stores.js';
	import { config, DEFAULT_CONFIG, DEFAULT_PM_DATA_SOURCE, LOCAL_PM_DATA_SOURCE, reset_all_config } from '@lib/config.svelte.js';

	function reset_data_source() {
		config.data_source = {...DEFAULT_CONFIG.data_source};
		confirm_to_reload();
	}

	function confirm_to_reload() {
		if (window.confirm(i18n.t('custom.confirm_for_reloading_to_apply'))) {
			location.reload();
		}
	}

	// function use_pm_data_source() {
	// 	config.data_source = {...DEFAULT_PM_DATA_SOURCE};
	// }

	// function use_local_source() {
	// 	config.data_source = {...LOCAL_PM_DATA_SOURCE};
	// }

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
					🚧 {i18n.t('custom.data_source')} 🚧
				</summary>

				<div>
					pms:
					<label class="flex gap1" style="margin-bottom:.5em">
						<!-- https://api.npoint.io/6acfd46ce5bfdbca61af -->
						<input type="text"
							tyle="width:4em; flex-grow:1;"
							bind:value={config.data_source.url}
						>
						<select bind:value={config.data_source.type}>
							<option value="csv">csv</option>
							<option value="json">json</option>
						</select>
					</label>

					<div class="flex jc-fe gap2">
						<button onclick={confirm_to_reload}>
							Apply
						</button>
						<!--
						<button type="button" onclick={use_pm_data_source}>
							{i18n.t('custom.default')}
						</button>
						-->
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
