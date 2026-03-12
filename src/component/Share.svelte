<script>
	import { _, } from 'svelte-i18n';

	import { name, status } from '@/stores.js';
	import { gen_href, } from '@lib/u.js';

	let url = $derived.by(() => gen_href($status, $name));

	const shortener_app_href = 'https://tinyurl.com/app';
	let short_href = $state(null);
	let short_message = $state('');

	let is_fetching = $state(false);
	async function gen_short_href() {
		if (is_fetching) {
			return;
		}

		is_fetching = true;
		short_message = '';

		try {
			const encoded_url = encodeURIComponent(`http://tinyurl.com/api-create.php?url=${url}`);
			const response = await fetch(`https://corsproxy.io/?${encoded_url}`);

			if (!response.ok) {
				throw new Error(`shortener request failed: ${response.status}`);
			}

			const text = (await response.text()).trim();
			if (!/^https:\/\/tinyurl\.com\/\S+$/i.test(text)) {
				throw new Error('shortener returned an invalid response');
			}

			short_href = text;
			short_message = 'Short URL generated.';
		} catch (error) {
			console.error(error);
			short_href = null;
			short_message = await fallback_to_manual_shortener(url);
		}

		is_fetching = false;
	}

	async function fallback_to_manual_shortener(url) {
		const shortener_tab = window.open(shortener_app_href, '_blank', 'noopener');
		let message = 'Open TinyURL and paste the full URL manually.';

		try {
			await navigator.clipboard.writeText(url);
			message = 'Automatic shortening unavailable. Full URL copied for TinyURL.';
		} catch (error) {
			console.error(error);
		}

		if (!shortener_tab) {
			message = 'Automatic shortening unavailable. Popup blocked, so open TinyURL and paste the full URL manually.';
		}

		return message;
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

		<li>
			<a class="short-link text-decoration:"
				href={short_href || shortener_app_href}
				class:fetching={is_fetching}
				rel="noopener"
				target="_blank"
			>
				{$_('share.short.link')}
			</a>
		</li>
	</ul>
	<div class="text-align:right">
		<hr>
		<button onclick={gen_short_href}>📦 {$_('share.get.short.url')}</button>
	</div>

	{#if short_message}
		<p class="font-size:smaller opacity:.7">{short_message}</p>
	{/if}
</div>



<style>
	li:has(a[href])::marker {
		content: '🔗 ';
	}

	li:has(a.fetching)::marker {
		content: '⌛ ';
	}

	.short-link[href]::after {
		content: attr(href);
		display: block;
		line-height: 1;
		/* font-size: smaller; */
		font-family: monospace;
	}

</style>
