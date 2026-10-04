<script>
	import { recorder, } from '@lib/recorder.svelte.js';
	import { i18n } from '@lib/i18n.svelte.js';
</script>

<div class="float-btns hide-for-print">
	<label class="btn-icon ctrl-btn" for="ctrl-checkbox">
		⚙️
		<span class="sr-only-u">
			toggle control panel
		</span>
	</label>


	<button class="btn-icon record-btn"
		onclick={recorder.add_current}
		title={i18n.t('record.save')}
	>
		💾
		<span class="sr-only-u">
			Save current record
		</span>
	</button>

	<label class="btn-icon locker-btn" for="list-locker">
		<span class="sr-only-u">
			Lock
		</span>
	</label>
</div>



<style>

	.float-btns {
		--btn-size: 44px;
		position: fixed;
		z-index: 30;
		bottom: 1rem;
		left: calc(min(3vw, 1em) + 4px);
		display: flex;
		flex-direction: column-reverse;
		gap: .5rem;
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
		border: 1px outset #0006;
		display: flex;
		width: var(--btn-size);
		height: var(--btn-size);
		padding: 0;
		place-items: center;
		place-content: center;
		font-size: 1.3rem;
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
