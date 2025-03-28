import type { TokenCookieSchemaType } from '$api/context/oidc';
import {
	codeVerifierCookieName,
	oidcStateCookieName,
	resolveSignin,
	tokensCookieName
} from '$api/services/OIDC';
import { graphql } from '$houdini';
import type { PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

const upsertMutation = graphql(`
	mutation UpserSelf {
		upsertSelf {
			userNeedsAdditionalInfo
		}
	}
`);

//TODO best would be to put all this logic in an elysia handler
export const load: PageServerLoad = async (event) => {
	const verifier = event.cookies.get(codeVerifierCookieName);
	if (!verifier) error(400, 'No code verifier cookie found.');
	const oidcState = event.cookies.get(oidcStateCookieName);
	if (!oidcState) error(400, 'No oidc state cookie found.');

	const { state, tokens } = await resolveSignin(event.url, verifier, oidcState);

	// we want to ensure throughout the app we match the TokenCookieSchemaType
	const cookieValue: TokenCookieSchemaType = {
		access_token: tokens.access_token,
		expires_in: tokens.expires_in,
		id_token: tokens.id_token,
		refresh_token: tokens.refresh_token,
		scope: tokens.scope,
		session_state: tokens.session_state,
		token_type: tokens.token_type
	};

	event.cookies.set(tokensCookieName, JSON.stringify(cookieValue), {
		//TODO investigate if we can use 'strict' here somehow
		// we need lax to allow the token to be sent with redirect from the auth provider
		sameSite: 'lax',
		path: '/',
		maxAge: tokens.expires_in ? tokens.expires_in * 1000 : undefined,
		secure: true,
		httpOnly: true
	});

	event.cookies.delete(codeVerifierCookieName, { path: '/' });
	event.cookies.delete(oidcStateCookieName, { path: '/' });

	const { data } = await upsertMutation.mutate(null, { event });

	if (data?.upsertSelf?.userNeedsAdditionalInfo) {
		redirect(302, `/my-account?redirect=${encodeURIComponent(state.visitedUrl)}`);
	} else {
		redirect(302, state.visitedUrl);
	}
};
