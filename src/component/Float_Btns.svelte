<script>
	import { recorder, } from '@lib/recorder.svelte.js';
	import { i18n } from '@lib/i18n.svelte.js';
</script>

<label class="btn-icon ctrl-btn hide-for-print" for="ctrl-checkbox" style="bottom:1rem">
	⚙️
	<span class="sr-only-u">
		toggle control panel
	</span>
</label>


<button class="btn-icon record-btn hide-for-print" style="bottom:3rem"
	onclick={recorder.add_current}
	title={i18n.t('record.save')}
>
	💾
	<span class="sr-only-u">
		Save current record
	</span>
</button>

<label class="btn-icon locker-btn hide-for-print" for="list-locker" style="bottom: 5rem">
	<span class="sr-only-u">
		Lock
	</span>
</label>



<style>

	.record-btn {
		left: 3em;
	}

	.locker-btn {
		&::before {
			content: var(--locker-icon, '🔓');
		}

		:global(body:has(#list-locker:checked)) & {
			background-color: #ffd;
			--locker-icon:  '🔒';
		}
	}

	.btn-icon {
		position: fixed;
		z-index: 30;
		/* bottom: .5rem; */
		left: calc(min(3vw, 1em) + 4px);
		border: 1px outset #0006;
		display: flex;
		width: 2em;
		height: 2em;
		padding: 0;
		place-items: center;
		place-content: center;
		font-size: .8rem;
		background-color: #f4f4f4;
		cursor: pointer;
		user-select: none;
		border-radius: 2px;
		transition: opacity 0.3s, scale .1s;

		&:hover,
		&:focus,
		&:active {
			opacity: 1;
			scale: 1.1;
		}

		&:active {
			border-style: inset;
			background-color: #ffd;
		}
	}
</style>