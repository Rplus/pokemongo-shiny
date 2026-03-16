<script>
	import { _, } from 'svelte-i18n';

</script>


<footer class="font-family:serif font-size:smaller flex flex-direction:row-reverse padding:1em hide-for-print">

	<ul class="margin-bottom:.5em>li list-style:disc">
		<li>
			Print to save that. <button onclick={() => window.print()}>🖨️</button>
		</li>
		<li>
			most images from: <a href="https://github.com/ZeChrales/PogoAssets" target="_blank" rel="noopener">PogoAssets</a> repo.
		</li>
		<li>
			design style from: <a href="https://leekduck.com/" target="_blank" rel="noopener">Leek Duck</a>
		</li>
		<li>
			Give a ⭐ on this <a href="https://github.com/rplus/pokemongo-shiny/" target="_blank" rel="noopener">GitHub repo</a>
			<br />
			or report an issue :P
		</li>
	</ul>
</footer>
