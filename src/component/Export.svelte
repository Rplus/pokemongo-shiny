<script>
	import { i18n } from '@lib/i18n.svelte.js';
	import { pick, get_time_string, } from '@lib/u.svelte.js';

	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { session, } from '@lib/config.svelte.js';

	const titles = ['family_dex', 'debut', 'pid', 'name', 'suffix', 'group', 'src', 'status', 'tag', 'order', ]

	function export_as_csv() {
		const _lang = i18n.lang;
		const csv = '';
		const groups = $state.snapshot(pokemonStore.groups);

		let op = [titles];
		groups.forEach(group => {
			group[1].forEach(pm => {
				op[op.length] = titles.map(prop => {
					if (prop === 'name') {
						return pm[prop][_lang] || '';
					} else if (prop === 'suffix') {
						// workaround: dirty hack for csv newline
						return pm[prop] ? `"${pm[prop]}"` : '';
					}
					return pm[prop] ?? '';
				}).join(',')
			})
		});

		downloadURI(
			getAllText(op.join('\n')),
			`pm-go-shiny-【${session.name}】-${get_time_string(new Date())}.csv`
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
	<div style="text-align: right">
		<button onclick={export_as_csv}>📥 {i18n.t('export.as.csv')}</button>
	</div>
</div>
