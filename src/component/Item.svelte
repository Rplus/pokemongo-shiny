<script>
	import { get_name, } from '@lib/pm.svelte.js';
	import { _, locale, } from 'svelte-i18n';
	import { config, } from '@/stores.js';
	import { isDev, } from '@lib/u.js';

	let { pm, status, handle_click_pm, } = $props();

	let folder_path = `https://cdn.jsdelivr.net/gh/PokeMiners/pogo_assets/Images/Pokemon%20-%20256x256/Addressable%20Assets`;
	if (isDev()) {
		folder_path = `http://localhost:1111/new-imgs`;
	}

	let tags_class = pm.tag.map(tag => ` tag-${tag}`).join('');

	let src = get_pm_img_src(pm.pid, true, pm.src);
	let src0 = get_pm_img_src(pm.pid, false, pm.src /* TODO */ );

	function get_pm_img_src(pid = '', shiny = true, direct_src = '') {
		if (direct_src) {
			return direct_src;
		}
		return `${folder_path}/${pid}${shiny ? '.s' : ''}.icon.png`;
	}

</script>

<button class="pm status-{status} width:96@sm width:72 aspect-ratio:1 {tags_class}"
	class:img_diff={$config.img_diff}
	data-index={pm.index}
	onclick={() => handle_click_pm(pm.index)}
	style="--group-order:{pm.order || 0};--dex-order:{pm.dex};"
>
	<div class="img-box position:absolute inset:0 border-radius:inherit overflow:hidden"
		style="--w: 140%; --t:-30%; --l: -5%;"
	>
		<!--
		-->
		{#if $config.img_diff}
			<img
				class="display:block"
				width="96"
				height="96"
				src={src0}
				alt={pm.pid}
				loading="lazy"
			/>
		{/if}
		<img
			class="display:block transition:opacity|0.3s"
			width="96"
			height="96"
			src={src}
			alt={pm.pid}
			loading="lazy"
		/>
	</div>


	<!--
	<div
		class="position:absolute bottom:5% right:5% pointer-events:none"
	>{status}</div>
	-->

	<div class="caption position:absolute z-index:15 left:2.5% top:1% padding:.3em|.25em pointer-events:none transition:opacity|0.3s" hidden={!$config.show_name}>
		<div class="name font-size:10 font-size:12@sm opacity:0.4 transition:opacity|0.3s">
			{get_name(pm.name, $locale)}

			{#if $config.show_suffix}
				<span class="white-space:pre-wrap">{pm.suffix}</span>
			{/if}
		</div>

		<div class="dex text-align:start font-size:10 opacity:0 transition:opacity|.3s">
			#{pm.dex}
		</div>
	</div>
</button>

<style>
	img {
		font-family: inherit;
		position: relative;
		position: absolute;

		top: var(--t, -30%);
		left: var(--l, -5%);
		width: var(--w, 140%);

		height: auto;
		aspect-ratio: 1;
		max-width: unset;
		object-fit: fill;

		&::before {
			content: '';
			position: absolute;
			background-color: #ccc;
			inset: 0;
			box-shadow: inset 0 0 2px;
		}

		&::after {
			content: '\2639' '\A' attr(alt);
			position: absolute;
			inset: 0;
			z-index: 2;
			white-space: pre-wrap;
			place-content: center;
			text-align: center;
		}
	}

	.img-box {
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			pointer-events: none;
			box-shadow: inset 0 0 0 1px #ddd;
			border-radius: inherit;
			background-size: 100% 75%;
			background-repeat: no-repeat;
			opacity: 0;
			color: var(--main-bgc);
			transition: opacity 1s;
			background-image: linear-gradient(currentcolor, #0000);
		}
		.pm:not(.img_diff):hover &::after {
			opacity: .8;
		}
	}

	.pm {
		break-inside: avoid;
		background-color: var(--main-bgc);
		width: var(--pm-grid-size, 96px);
		height: var(--pm-grid-size, 96px);
		order: var(--group-order);

		@media (max-width: 768px) {
			width: calc(var(--pm-grid-size) * .75);
			height: calc(var(--pm-grid-size) * .75);
		}
	}

	.pm:hover .name {
		opacity: 1;
	}
	.pm:hover .dex {
		opacity: 0.5;
	}

	.img_diff:hover {
		& .caption {
			opacity: 0;
		}

		& img + img {
			opacity: 0;
		}
	}
</style>