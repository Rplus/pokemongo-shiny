<script>
	import { recorder, } from '@lib/recorder.svelte.js';
	import { session } from '@lib/config.svelte.js';
	import { get_time_string, gen_href, } from '@lib/u.js';
	import { i18n } from '@lib/i18n.svelte.js';
	import { pokemonStore, } from '@lib/pm.svelte.js';

	// click to apply
	function click_record(e, index, data) {
		e.preventDefault();
		recorder.renew(index);
		recorder.save();
		pokemonStore.fn_overwrite_status(data.status);
		session.name = data.name;
	}
</script>


<ul>
	{#each recorder.records as record, index}
		<li class="item">
			<div class="flex gap1">
				<button
					class="delete-btn"
					title={i18n.t('record.remove')}
					onclick={() => recorder.remove(index,
						i18n.t('record.remove.confirm', { values: { name: record.name } })
					)}
				>
					🗑️
				</button>

				‧

				<div class="label">
					<a class="link {record.name === session.name && 'bolder'}"
						href={gen_href(record.status, record.name)}
						onclick={(e) => click_record(e, index, record)}
					>
						<div>
							{record.name}
						</div>
						<time datetime={new Date(record.time)}>
							{get_time_string(new Date(record.time))}
						</time>
						<!-- {record.status} -->
					</a>
				</div>
			</div>
		</li>

	{/each}
</ul>

<hr>
<div class="flex jc-sb">
	<button style="color:#c00"
		onclick={() => recorder.reset(i18n.t('record.reset.accidentally.confirm'), i18n.t('record.reset.confirm'))}
		>
		⚠️ {i18n.t('record.reset')}
	</button>
	<button onclick={recorder.add_current}>
		💾 {i18n.t('record.save')}
	</button>
</div>


<style>
ul {
	max-height: 400px;
	overflow: auto;
}

.label {
	max-width: 20em;
	word-wrap: break-word;
	word-break: break-all;
	line-height: 1.2;
	padding-left: 1.5em;
	text-indent: -1.5em;
	width: 100%;
}
.item:hover {
	background-color: #ff03;
}

.item .flex {
	margin-bottom: 0.5em;
	align-items: start;
}

.link {
	display: block;
}

.delete-btn {
	aspect-ratio: 1;
	background: unset;
	background-color: #9003;
	border-radius: 50%;
	padding: .25em;
	border-color: #0000;
	line-height: 0;
	cursor: pointer;
	opacity: var(--op, .3);
	transition: opacity .2s;

	&:hover {
		--op: 1;
	}
}

time {
	display: inline-flex;
	opacity: .5;
	font-size: smaller;
	font-family: monospace;
	text-decoration: none;
	text-indent: 0;
}

</style>