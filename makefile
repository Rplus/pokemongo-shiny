init:
	bun install;

dev:
	bun run dev;

host-image:
	bunx http-server ./tasks/tmp -p 1111

build:
	bun run build;

deploy: build
	bun run deploy;

fetch: fetch-name fetch-pm
	echo 'All fetched!';

fetch-pm:
	bun ./tasks/fetch-pm.js;

fetch-name:
	bun ./tasks/fetch-name.js;

download-imgs:
	cat ./tasks/tmp/imgs.txt | parallel -j4 wget -q -nc -P ./tasks/tmp/img ' ' {};

print-date:
	date +%FT%T%:::z > './src/assets/data/latest-fetch-time.txt';
