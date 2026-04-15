<script>
	import { onMount } from 'svelte';

	import List from '@comp/List.svelte';
	import Ctrl from '@comp/Ctrl.svelte';
	import Float_Btns from '@comp/Float_Btns.svelte';

	import { pokemonStore, } from '@lib/pm.svelte.js';
	import { recorder, } from '@lib/recorder.svelte.js';
	import { session } from '@lib/config.svelte.js';

	function reset_ls() {
		localStorage.clear();
	}

	onMount(() => {
		pokemonStore.init();
	});

	function handle_before_unload(event) {
		if (recorder.records?.[0]?.status !== pokemonStore.status_string) {
			console.log(pokemonStore.status_string === recorder.records?.[0].status);
			// console.log({
			// 	a: recorder.records?.[0].status,
			// 	b: pokemonStore.status_string,
			// });
			event.preventDefault();
			event.returnValue = '';
		}
	}

</script>


<svelte:window onbeforeunload={handle_before_unload}/>


<List />
<Ctrl />
<Float_Btns />

{#if pokemonStore.isLoading}
	Loading...
	<br>
	<sub>
		from {pokemonStore.configUrl}
	</sub>
{:else if pokemonStore.error}
	<p style="color: red;">{pokemonStore.error}</p>
	<button onclick={() => reset_ls()}>try to reset localStorage</button>
{:else}

{/if}

<!--
{#await init()}
	Loading...

{:then}
	<Ctrl />
	<List />

	<Float_Btns />

{:catch error}
	GG!
	<button onclick={() => reset_ls()}>try to reset localStorage</button>

{/await}
-->
