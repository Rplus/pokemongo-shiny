import pm_local_csv_url from '@data/pm.csv?url';
import raw_names from '@data/name.csv';
import { csv2json, fetch_data, get_item, confirm_to_reset, } from '@lib/u.js';

export const pm_data = await get_pms();

export async function get_pms() {
	let data_source = {
		url: pm_local_csv_url,
		type: 'csv',
	};

	let config = get_item('config');
	if (config?.source_url?.url) {
		data_source = {
			...data_source,
			...config.source_url,
		};
	}

	let pm_raw_data = await fetch_data(data_source.url, data_source.type);

	if (data_source.type === 'csv') {
		pm_raw_data = csv2json(pm_raw_data);
	}

	return handle_pms(pm_raw_data);
}

export function handle_pms(pms_json) {
	// handle name
	// console.log({raw_names});
	const names = raw_names.reduce((all, item) => {
		let { dex, ...name } = item;
		all[+dex] = name;
		return all;
	}, []);

	// handle pm debut
	const today = new Date();

	let max_index = 0;

	if (pms_json[0]?.pid === undefined) {
		confirm_to_reset();
	}

	let gen_range = [
		0,
		151,
		251,
		386,
		493,
		649,
		721,
		809,
		905,
		1025,
	];

	// handle groups
	let groups_map = {};
	let groups = [];

	let tags = {};
	let pms = pms_json.map(pm => {
		let dex = +(pm.pid.match(/pm(\d+)/)?.[1]);

		if (!(new Date(pm.debut) < today)) {
			return;
		}

		let index = +pm.index;

		if (index > max_index) {
			max_index = index;
		}


		let gen = 0;
		gen_range.forEach((g, index) => {
			if (dex > g) {
				gen = index + 1;
			}
		});

		{ // collect tags
			let _tags = (pm.tag || '').split(/\=/);
			_tags.push(`🧬gen${gen}`);
			_tags = get_default_tags(_tags, pm.pid, dex);
			pm.tag = [...new Set(_tags)].filter(Boolean);
			pm.tag.forEach(tag => {
				if (!tags[tag]) {
					tags[tag] = [];
				}
				tags[tag].push(pm.pid);
			});
		}

		// replace | to a newline
		if (pm.suffix) {
			pm.suffix = pm.suffix.replace(/\|/g, '\n');
		}

		let op_pm = {
			...pm,
			index,
			dex,
			name: names[dex],
			time_order: +new Date(pm.debut) / 1000 + dex,
			// costume: pm.pid.includes('.'),
			// shiny: new Date(pm.debut) < today,
			status: '0',
		};

		{ // grouping~
			let _group = pm.group || pm.pid;
			let g_index = groups_map[_group];
			if (!g_index && g_index !== 0) {
				g_index = groups.length;
				groups_map[_group] = g_index;
				groups[g_index] = {
					label: _group,
					pids: [],
					pms: [],
				};
			}
			groups[g_index].pids.push(pm.pid);
			groups[g_index].pms.push(op_pm);
		}

		return op_pm;
	})
	.filter(Boolean);

	groups_map = null;

	return {
		pms,
		groups,
		max_index,
		tags,
	};
}

export function get_name(names, lang = 'en') {
	return names?.[lang] || names?.en || '';
}

function get_default_tags(tags = [], pid = '', dex = 1) {
	if (!tags.includes('costume')) {
		tags.push('-costume');
	}
	switch (pid.split('.f')[1]) {
		case 'HISUIAN':
			tags.push('📍hisuian');
			break;
		case 'GALARIAN':
			tags.push('📍galarian');
			break;
		case 'ALOLA':
			tags.push('📍alola');
			break;
		case 'MEGA':
			tags.push('🚀mega');
			break;
		case 'ORIGIN':
			tags.push('🔀ORIGIN');
			break;
		default:
			break;
	}

	switch (dex) {
		case 25:
		case 26:
		case 172:
			tags.push('🐣pika');
			break;
		case 201:
			tags.push('🐣unown');
			break;
		case 327:
			tags.push('🐣spinda');
			break;
		case 133:
		case 134:
		case 135:
		case 136:
		case 196:
		case 197:
		case 470:
		case 471:
		case 700:
			tags.push('🐣eevee');
			break;
		default:
			break;
	}

	return tags;
}