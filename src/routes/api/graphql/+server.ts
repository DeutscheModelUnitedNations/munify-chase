import { createYoga } from '$api/rumble';

import '$api/handlers/register';

const yogaInstance = createYoga({
	graphqlEndpoint: '/api/graphql',
	// The deepest query in this app reaches depth 7
	// (committee → activeAgendaItem → speakersList → speakers → committeeMember → representation → name).
	// Raise armor's default of 6 to 10 so legitimate queries pass while still rejecting absurd ones.
	armorConfig: {
		maxDepth: { n: 10 }
	},
	fetchAPI: {
		fetch,
		Request,
		Response,
		Headers,
		FormData,
		ReadableStream,
		WritableStream,
		TransformStream,
		Blob,
		// File doesn't seem to exist
		// File,
		crypto,
		btoa,
		TextEncoder,
		TextDecoder,
		URLPattern,
		URL,
		URLSearchParams
	}
});

export { yogaInstance as GET, yogaInstance as POST };
