const [inputUrl] = process.argv.slice(2);

if (!inputUrl) {
	console.error('Usage: node tasks/unregistered-url.js <share-or-short-url>');
	process.exit(1);
}

async function resolveUrl(url) {
	const response = await fetch(url, {
		method: 'HEAD',
		redirect: 'follow',
	});

	return response.url || url;
}

async function main() {
	const input = new URL(inputUrl);
	const resolvedUrl = input.searchParams.has('status')
		? inputUrl
		: await resolveUrl(inputUrl);
	const url = new URL(resolvedUrl);
	const status = url.searchParams.get('status');

	if (!status) {
		throw new Error(`No status query parameter found in ${resolvedUrl}`);
	}

	url.searchParams.set('visible', '0');
	console.log(url.toString());
}

main().catch(error => {
	console.error(error.message);
	process.exit(1);
});
