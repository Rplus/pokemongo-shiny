<script>
	import { _, locale } from 'svelte-i18n';
	import { pick, get_time_string, } from '@lib/u.js';

	import { pm_data, } from '@lib/pm.svelte.js';
	import { name, status, } from '@/stores.js';

	const titles = ['index', 'debut', 'pid', 'name', 'suffix', 'group', 'src', 'status', ];

	function export_as_csv() {
		let _status = $status;
		let _locale = $locale;
		let csv = pm_data.pms.map((pm, index) => {
			return titles.map(prop => {
				if (prop === 'name') {
					return pm[prop][_locale] || '';
				} else if (prop === 'status') {
					return _status[index] || 0;
				}
				return pm[prop] ?? '';
			}).join(',');
		});
		csv.unshift(titles);

		downloadURI(
			getAllText(csv.join('\n')),
			`pm-go-shiny-【${$name}】-${get_time_string(new Date())}.csv`
		);
	}

	function getAllText(cxt) {
		return `data:text/csv;charset=utf-8,${encodeURIComponent(cxt)}`;
	}

	function downloadURI(uri, name) {
		let doc = document.createDocumentFragment();
		let link = document.createElement('a');
		link.download = name;
		link.href = uri;
		doc.appendChild(link);
		link.click();
		doc = null;
	}

</script>


<div>
	<hr>
	<div class="text-align:right">
		<button onclick={export_as_csv}>📥 {$_('export.as.csv')}</button>
	</div>
</div>
