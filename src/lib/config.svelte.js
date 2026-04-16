import pm_local_csv_url from '@data/pm.csv?url';
import { set_item, get_item, } from '@lib/u.js';

// export let status = $state('');
// export let name = $state('?');

export const DEFAULT_PM_DATA_SOURCE = {
	url: `https://opensheet.elk.sh/1l1CXHdge8_2F2ifjMY71f23DJ_98Ei2QNZ9rPdBd8jQ/'pm2026'`,
	type: 'json',
};

export const LOCAL_PM_DATA_SOURCE = {
	url: pm_local_csv_url,
	type: 'csv',
};

export const session = $state({
	status: '',
	name: '_username_',
});

export const DEFAULT_CONFIG = Object.freeze({
	// ui
	locked: false,
	open_tags: false,

	// grid
	img_diff: false,
	show_name: true,
	show_suffix: true,

	// style
	maxwidth: 1200,
	grid_size: 96,
	main_bgc: '#ffffff',
	main_color: '#213547',
	grid_colors: ['#dddddd', '#dada0b', '#a1a112'],
	gradient_colors: ['#000000', '#63452c'],
	data_source: {...DEFAULT_PM_DATA_SOURCE},
	status_visibility: [true, true, true, true, ],
});

// 1. Initial State: Merge default with storage
export const config = $state({
	...DEFAULT_CONFIG,
	...get_item('config'),
});

let _save_timer;

// 2. Auto-persist on any change
$effect.root(() => {

	// Separate Effects for CSS Variables
	$effect(() => {
		document.documentElement.style.setProperty('--pm-grid-size', `${config.grid_size}px`);
	});

	$effect(() => {
		document.documentElement.style.setProperty('--max-width', `${config.maxwidth}px`);
	});

	// re-paint color
	$effect(() => {
		const _root = document.documentElement.style;
		_root.setProperty('--main-bgc', config.main_bgc);
		_root.setProperty('--main-color', config.main_color);
		_root.setProperty('--main-color', config.main_color);
		_root.setProperty('--header-gc1', config.gradient_colors[0]);
		_root.setProperty('--header-gc2', config.gradient_colors[1]);

		config.grid_colors.forEach((_c, _i) => {
			_root.setProperty(`--pm-grid-color${_i}`, _c);
		});
	});

	$effect(() => {
		const _data = $state.snapshot(config);
		// set_item('config', _data);

		clearTimeout(_save_timer);
		_save_timer = setTimeout(() => {
			set_item('config', _data);
			// console.log('Config saved after debounce');
		}, 500); // Wait for 500ms of inactivity
	});
});

{
	const _qs = new URL(location).searchParams;
	if (_qs.get('status')) {
		session.status = _qs.get('status') || '';
		session.name = _qs.get('name') || '?';
		history.pushState({}, null, location.pathname); // reset qs
	}
}

export function reset_all_config() {
	const fresh_default = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
	Object.assign(config, fresh_default);
}
