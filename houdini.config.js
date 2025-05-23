import { JSON_, Date_, DateTime } from '@m1212e/graphql-scalars-houdini';

/// <references types="houdini-svelte">

/** @type {import('houdini').ConfigFile} */
const config = {
	watchSchema: {
		url: 'http://localhost:5173/api/graphql'
	},
	runtimeDir: '.houdini',
	plugins: {
		'houdini-svelte': {
			forceRunesMode: true
		}
	},
	exclude: ['src/lib/paraglide/**/*'],
	scalars: {
		JSON: JSON_,
		Date: Date_,
		DateTime: DateTime
	}
};

export default config;
