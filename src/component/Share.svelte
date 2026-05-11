<script>
	import { i18n } from '@lib/i18n.svelte.js';
	import { config, session } from '@lib/config.svelte.js';
	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { fetch_data, gen_href, } from '@lib/u.svelte.js';

	let url = $derived(gen_href(pokemonStore.status_string, session.name, config.status_visibility));

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
		console.log({short_href});
		// TODO: preview shorturl https://tinyurl.com/preview/ooxxoxox
		is_fetching = null;
	}

	function get_qrcode_img(url) {
    return `https://quickchart.io/qr?text=${url}&format=svg`;
	}
</script>



<div>
	{i18n.t('share.intro')}

	<ul>
		<li>
			<a href={ url }>
				{i18n.t('share.full.url')}
			</a>
		</li>
	</ul>

	<details>
		<summary>If you need to get a short link</summary>
		<div style="line-height: 1.3">
			<p>
				1. Go to cors-anywhere site,
				<br>
				and click its button to request temporary access.
				<br>
				<a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">https://cors-anywhere.herokuapp.com/corsdemo</a>
			</p>

			<p>
				2. Click ↴
				<br>
				<button onclick={gen_short_href}>📦 {i18n.t('share.get.short.url')}</button>
			</p>

			{#if short_href}
				<div>
					3. Here is {i18n.t('share.short.link')}
					<br>
					<a class="short-link text-decoration:"
						href={short_href}
						class:fetching={is_fetching}
						rel="noopener"
						target="_blank"
					>
						{short_href}
					</a>
				</div>

				<div>
					<img class="display:block margin-top:2px" src={ get_qrcode_img(short_href) } alt="qrcode for short url">
				</div>
			{/if}

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

	.short-link[href] {
		display: block;
		width: fit-content;
		line-height: 1;
		font-family: monospace;
	}

</style>
