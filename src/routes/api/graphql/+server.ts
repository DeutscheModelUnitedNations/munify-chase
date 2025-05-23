import { createYoga } from '$api/rumble';

import '$api/handlers/register';

const yogaInstance = createYoga({
	graphqlEndpoint: '/api/graphql',
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
