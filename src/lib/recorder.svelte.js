import { rev_sort_by, set_all_records, get_all_records } from '@lib/u.js';
import { pokemonStore, } from '@lib/pm.svelte.js';
import { session } from '@lib/config.svelte.js';

class RecorderManager {
	// 1. Reactive state
	records = $state([]);

	constructor() {
		this.init();
	}

	async init() {
		const _cached = await get_all_records();
		this.records = _cached || [];
		return this.records;
	}

	add_current = () => {
		this.add({
			name: session.name,
			status: pokemonStore.status_string,
		})
	}

	add = ({ name, status }) => {
		let _index = this.records.findIndex(i => i.name === name);

		const _new_record = {
			name,
			status,
			time: Date.now(),
		};

		if (_index === -1) {
			this.records.push(_new_record);
		} else {
			this.records[_index] = _new_record;
		}

		this.sort_and_save();
	};

	remove = (index = 0, alert_txt = '') => {
		const _target = this.records[index];
		if (!_target) return;

		const _msg = alert_txt || `【${_target.name}】 will be deleted. \nAre you sure?`;
		if (!confirm(_msg)) return;

		this.records.splice(index, 1);
		this.save();
	};

	// 3. Encapsulate sort and save logic
	sort_and_save = () => {
		// Svelte 5 sort can be done in-place on $state arrays
		this.records.sort(rev_sort_by('time'));
		this.save();
	};

	save = () => {
		set_all_records($state.snapshot(this.records));
	};

	renew = (index = 0) => {
		if (this.records[index]) {
			this.records[index].time = Date.now();
			this.sort_and_save();
		}
	};

	reset = (alert_txt = '', alert_txt2 = '') => {
		if (confirm(alert_txt) || confirm(alert_txt2)) {
			this.records = [];
			this.save();
		}
	};
}

// Export a single instance
export const recorder = new RecorderManager();
