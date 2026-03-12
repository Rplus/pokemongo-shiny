<script>
	import { _, locale } from 'svelte-i18n';

	import { name, status } from '@/stores.js';
	import { derived } from 'svelte/store';
	import { fetch_data, gen_href, } from '@lib/u.js';

	let url = $derived.by(() => gen_href($status, $name));

	let short_href = $state(null);

	let is_fetching = $state(false);
	async function gen_short_href() {
		if (is_fetching) {
			alert('');
			return;
		}

		is_fetching = true;

		// const encoded_url = encodeURIComponent(`http://tinyurl.com/api-create.php?url=${url}`);

		// short_href = await fetch_data(`https://corsproxy.io/?${encoded_url}`, 'text');
		// short_href = await fetch_data(`https://api.allorigins.win/raw?url=${encoded_url}`, 'text');
		short_href = await fetch_data(`https://cors-anywhere.herokuapp.com/http://tinyurl.com/api-create.php?url=${url}`, 'text');
		console.log(2221, short_href);
		// TODO: preview shorturl https://tinyurl.com/preview/ooxxoxox
		is_fetching = null;
	}

	function get_qrcode_img(url) {
    return `https://quickchart.io/qr?text=${url}&format=svg`;
	}
</script>



<div>
	{$_('share.intro')}

	<ul>
		<li>
			<a href={ url }>
				{$_('share.full.url')}
			</a>
		</li>
	</ul>

	<details>
		<summary>If you need to get a short link</summary>
		<div>
			<div>
				1. Go to cors-anywhere site,
				<br>
				and click its button to request temporary access.
				<br>
				<a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">https://cors-anywhere.herokuapp.com/corsdemo</a>
			</div>

			<div>
				2. Click
				<br>
				<button onclick={gen_short_href}>📦 {$_('share.get.short.url')}</button>
			</div>

			<div>
				3.
				Here is
				<a class="short-link text-decoration:"
					href={short_href}
					class:fetching={is_fetching}
					rel="noopener"
					target="_blank"
				>
					{$_('share.short.link')}
				</a>
			</div>

			<div>
				{#if short_href}
					<img class="display:block margin-top:2px" src={ get_qrcode_img(short_href) } alt="qrcode for short url">
				{/if}
			</div>
		</div>

	</details>
</div>



<style>
	li:has(a[href])::marker {
		content: '🔗 ';
	}

	li:has(a.fetching)::marker {
		content: '⌛ ';
	}

	.short-link[href]::after {
		content: attr(href) ' ✅';
		display: block;
		line-height: 1;
		/* font-size: smaller; */
		font-family: monospace;
	}

</style>