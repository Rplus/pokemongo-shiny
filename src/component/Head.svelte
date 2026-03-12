<script>
	import { status, name, config, } from '@/stores.js';
	import { _, } from 'svelte-i18n';
	import date from '@data/latest-fetch-time.txt?raw';

	let { status_counter, status_visibility, } = $props();

	let counts = $derived.by(() => {
		let op = {
			total: {
				summary: summary_arr(status_counter),
				percent: 1,
			},
			met: {
				summary: summary_arr(status_counter.slice(1)),
				percent: 0,
			},
			own: {
				summary: summary_arr(status_counter.slice(2)),
				percent: 0,
			},
		};
		op.met.percent = 100 * op.met.summary / op.total.summary;
		op.own.percent = 100 * op.own.summary / op.total.summary;
		return op;
	});

	function summary_arr(arr) {
		return arr.reduce((all, i) => all + i, 0);
	}

	const status_labels = ['none', 'met', 'own', 'extra', ];

</script>


<header class="position:relative padding:1em|1em|3.5em color:#fff background-color:#990 background-image:linear-gradient(-230deg,{$config.gradient_colors[0]},{$config.gradient_colors[1]})"
	style="--met-percent:{counts.met.percent}%; --own-percent:{counts.own.percent}%;"
	data-update={date}
>
	<h1 class="font-size:1.3rem font-size:1.75rem@sm text-align:center margin:.5em|0|1em">
		✨
		<span class="mix-blend-mode:difference">
			Shiny Checklist
		</span>
	</h1>

	<!--
		{$status}
		<pre>{JSON.stringify(status_counter, '', 2)}</pre>
		<input type="text" value={status_string} />
	-->

	<div
		class="name-input position:absolute right:0 bottom:0 z-index:2 padding:.25em|.75em max-width:80% word-wrap:break-word word-break:break-all cursor:text background-color:#fff3:hover display:none_br mix-blend-mode:difference"
		title={$_('nickname')}
	>
		@
		<span contenteditable bind:textContent={$name}></span>
	</div>

	<div class="dashboard flex flex-wrap:wrap gap:min(2vw,1em) justify-content:center align-items:center user-select:none font-size:smaller">
		{#each status_visibility as st, index}
			{#if index}
				/
			{/if}

			<label class="pm status-{index} position:relative width:88 aspect-ratio:1 height:88 place-content:center place-items:center text-align:center cursor:pointer"
				title={$_(`status.${status_labels[index]}`)}
			>
				<!-- <label class="label-has-checkbox cursor:pointer"> -->
					<input
						type="checkbox"
						name="status_visibility"
						value={index}
						bind:checked={status_visibility[index]}
						class="sr-only-u"
					>

					<div class="number font-size:1.2rem">
						{status_counter[index]}
					</div>
					<div class="white-space:nowrap overflow:hidden text-overflow:ellipsis width:100% padding:0|2 margin-top:.25em font-size:smaller text-transform:capitalize opacity:0.5">
						{$_(`status.${status_labels[index]}`)}
					</div>
				<!-- </label> -->
			</label>
		{/each}

		/

		<div
			class="pm position:relative width:88 aspect-ratio:1 height:88 place-content:center place-items:center text-align:center"
			title={$_('status.released')}
		>
			<input type="checkbox" class="sr-only-u" checked disabled>
			<div class="number font-size:1.2rem">
				{counts.total.summary}
			</div>
			<div class="white-space:nowrap overflow:hidden text-overflow:ellipsis width:100% padding:0|2 margin-top:.25em font-size:smaller opacity:0.5">
				{$_('status.released')}
			</div>
		</div>
	</div>
</header>


<style>
	header::after {
		content: '';
		position: absolute;
		z-index: 1;
		left: 0;
		right: 0;
		bottom: 0;
		height: .5rem;
		color: #fff3;
		background-image:
			linear-gradient(currentcolor, currentcolor),
			linear-gradient(currentcolor, currentcolor);
		background-size: var(--met-percent) 100%, var(--own-percent) 100%;
		background-repeat: no-repeat;
	}

	header::before {
		content: attr(data-update);
		position: absolute;
		top: 100%;
		right: .5em;
		font-size: small;
		font-family: monospace;
		padding: 0.25em;
		opacity: 0.5;
		mix-blend-mode:difference;
		transition: opacity 1.5s;
	}

	header:not(:hover)::before {
		opacity: 0.2;
	}

	.pm {
		background-color: #fff3;
		--pm-border-width: 1.5px;
		--pm-marker-size: 25%;

		&::before,
		&::after {
		}
	}
	@media (max-width: 650px) {
		.dashboard {
			gap: min(1.25vw, .75em);
		}
		.pm {
			width: 70px;
			height: 70px;
		}
	}
	.pm:not(:has(input:checked)) {
		background-color: #fff0;

		& .number {
			filter: blur(3px);
		}
	}
</style>
