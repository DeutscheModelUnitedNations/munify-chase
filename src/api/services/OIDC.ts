import { configPrivate } from '$lib/config/private';
import { configPublic } from '$lib/config/public';
import {
	allowInsecureRequests,
	authorizationCodeGrant,
	buildAuthorizationUrl,
	buildEndSessionUrl,
	calculatePKCECodeChallenge,
	discovery,
	fetchUserInfo,
	randomPKCECodeVerifier,
	randomState,
	refreshTokenGrant,
	tokenIntrospection,
	type TokenEndpointResponse
} from 'openid-client';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { z } from 'zod';
import { lazy } from '$lib/helpers/lazy';
import Cryptr from 'cryptr';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { db, schema } from '$api/db/db';

/**
 * Roles the issuer can pass along which we should respect
 */
export const oidcRoles = ['admin', 'member', 'service_user'] as const;
/**
 * Route where the user will be redirected after login.
 * Must match the actual path in fs based routing
 */
export const loginRoute = '/auth/login-callback';
/**
 * Route where the user will be redirected after logout.
 * Must match the actual path in fs based routing
 */
export const logoutRoute = '/auth/logout-callback';

// cookie names
const cookiePrefix = 'auth_oidc_';
const codeVerifierCookieName = `${cookiePrefix}code_verifier`;
const oidcStateCookieName = `${cookiePrefix}state`;
const accessTokenCookieName = `${cookiePrefix}access_token`;
const refreshTokenCookieName = `${cookiePrefix}refresh_token`;
const idTokenCookieName = `${cookiePrefix}id_token`;
const expiresInCookieName = `${cookiePrefix}expires_in`;
const scopeCookieName = `${cookiePrefix}scope`;
const tokenTypeCookieName = `${cookiePrefix}token_type`;

const OIDCUserSchema = z.object({
	sub: z.string(),
	email: z.string(),
	preferred_username: z.string(),
	family_name: z.string(),
	given_name: z.string(),

	locale: z.string().optional(),
	phone: z.string().optional()
});
export type OIDCUser = z.infer<typeof OIDCUserSchema>;
export function isValidOIDCUser(user: unknown): user is OIDCUser {
	return OIDCUserSchema.safeParse(user).success;
}

const OIDCFlowStateSchema = z.object({
	visitedUrl: z.string(),
	random: z.string()
});
type OIDCFlowState = z.infer<typeof OIDCFlowStateSchema>;
export function isValidOIDCFlowState(state: unknown): state is OIDCFlowState {
	return OIDCFlowStateSchema.safeParse(state).success;
}

const config = lazy(() => {
	const execute = [];
	if (configPrivate.NODE_ENV === 'development') {
		execute.push(allowInsecureRequests);
	}
	return discovery(
		new URL(configPublic.PUBLIC_OIDC_AUTHORITY),
		configPublic.PUBLIC_OIDC_CLIENT_ID,
		{
			client_secret: configPrivate.OIDC_CLIENT_SECRET,
			token_endpoint_auth_method: configPrivate.OIDC_CLIENT_SECRET ? undefined : 'none'
		},
		undefined,
		{
			execute
		}
	);
});

const jwks = lazy(async () => {
	const jwks_uri = (await config()).serverMetadata().jwks_uri;
	return jwks_uri ? await createRemoteJWKSet(new URL(jwks_uri)) : undefined;
});

const cryptr = new Cryptr(configPrivate.SECRET);

export async function startSignin(visitedUrl: URL) {
	const code_verifier = randomPKCECodeVerifier();
	const encrypted_verifier = cryptr.encrypt(code_verifier);
	const code_challenge = await calculatePKCECodeChallenge(code_verifier);
	const state: OIDCFlowState = {
		visitedUrl: visitedUrl.toString(),
		random: randomState()
	};
	const serialized_state = JSON.stringify(state);
	const encrypted_state = cryptr.encrypt(serialized_state);

	const parameters: Record<string, string> = {
		redirect_uri: `${visitedUrl.origin}/auth/login-callback`,
		scope: configPrivate.OIDC_SCOPES,
		code_challenge,
		code_challenge_method: 'S256',
		state: serialized_state
	};

	const redirect_uri = buildAuthorizationUrl(await config(), parameters);

	return {
		encrypted_verifier,
		redirect_uri,
		encrypted_state
	};
}

export async function resolveSignin(
	visitedUrl: URL,
	encrypted_verifier: string,
	encrypted_state: string
) {
	const verifier = cryptr.decrypt(encrypted_verifier);
	const state = JSON.parse(cryptr.decrypt(encrypted_state)) as OIDCFlowState;
	const tokens = await authorizationCodeGrant(await config(), visitedUrl, {
		pkceCodeVerifier: verifier,
		expectedState: JSON.stringify(state)
	});
	(state as any).random = undefined;
	const strippedState: Omit<OIDCFlowState, 'random'> = { ...state };

	return { tokens, state: strippedState };
}

export async function validateTokens({
	access_token,
	id_token
}: Pick<TokenEndpointResponse, 'access_token' | 'id_token'>): Promise<OIDCUser> {
	try {
		const keyset = await jwks();
		if (!keyset) throw new Error('No jwks available');
		if (!id_token) throw new Error('No id_token available');

		const [accessTokenValue, idTokenValue] = await Promise.all([
			jwtVerify(access_token, keyset, {
				issuer: (await config()).serverMetadata().issuer,
				audience: configPublic.PUBLIC_OIDC_CLIENT_ID
			}),
			jwtVerify(id_token, keyset, {
				issuer: (await config()).serverMetadata().issuer,
				audience: configPublic.PUBLIC_OIDC_CLIENT_ID
			})
		]);

		if (accessTokenValue?.payload?.sub !== idTokenValue?.payload?.sub) {
			throw new Error('Subject in access token and id token do not match');
		}

		// some basic fields which we want to be present
		// if the id token is configured in a way that it does not contain these fields
		// we instead want to use the userinfo endpoint
		if (!isValidOIDCUser(idTokenValue.payload)) {
			throw new Error('Not all fields in id token are present');
		}

		return idTokenValue.payload;
	} catch (error: any) {
		console.warn(
			'Failed to verify tokens locally, falling back to less performant info fetch:',
			error.message
		);

		const remoteUserInfo = await tokenIntrospection(await config(), access_token);

		if (!isValidOIDCUser(remoteUserInfo)) {
			throw new Error('Not all fields in remoteUserInfo token are present');
		}

		return remoteUserInfo;
	}
}

export async function refresh(refresh_token: string) {
	return refreshTokenGrant(await config(), refresh_token);
}

export async function getLogoutUrl(visitedUrl: URL) {
	if (configPrivate.NODE_ENV === 'production') {
		visitedUrl.protocol = 'https:';
	}
	return buildEndSessionUrl(await config(), {
		post_logout_redirect_uri: `${visitedUrl.origin}${logoutRoute}`
	});
}

export async function fetchUserInfoFromIssuer(access_token: string, expectedSubject: string) {
	return fetchUserInfo(await config(), access_token, expectedSubject);
}

export async function handleLoginRedirect(req: RequestEvent) {
	const verifier = req.cookies.get(codeVerifierCookieName);
	if (!verifier) error(400, 'No code verifier cookie found.');
	const oidcState = req.cookies.get(oidcStateCookieName);
	if (!oidcState) error(400, 'No oidc state cookie found.');

	const { state, tokens } = await resolveSignin(req.url, verifier, oidcState);

	const cookieOptions: Parameters<typeof req.cookies.set>[2] = {
		path: '/',
		httpOnly: true,
		// sameSite: 'lax',
		sameSite: 'strict',
		secure: true,
		maxAge: tokens.expires_in ? tokens.expires_in * 1000 : undefined
	};

	req.cookies.set(accessTokenCookieName, tokens.access_token, cookieOptions);
	if (tokens.refresh_token) {
		req.cookies.set(refreshTokenCookieName, tokens.refresh_token, cookieOptions);
	}
	if (tokens.id_token) {
		req.cookies.set(idTokenCookieName, tokens.id_token, cookieOptions);
	}
	const expiresIn = tokens.expiresIn();
	if (expiresIn) {
		req.cookies.set(expiresInCookieName, expiresIn.toString(), cookieOptions);
	}
	if (tokens.scope) {
		req.cookies.set(scopeCookieName, tokens.scope, cookieOptions);
	}
	if (tokens.token_type) {
		req.cookies.set(tokenTypeCookieName, tokens.token_type, cookieOptions);
	}

	req.cookies.delete(codeVerifierCookieName, { path: '/' });
	req.cookies.delete(oidcStateCookieName, { path: '/' });

	const user = await validateTokens(tokens);

	await db
		.insert(schema.user)
		.values({
			id: user.sub,
			locale: user.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
			preferredUsername: user.preferred_username,
			email: user.email,
			familyName: user.family_name,
			givenName: user.given_name
		})
		.onConflictDoUpdate({
			target: schema.user.id,
			set: {
				locale: user.locale ?? configPublic.PUBLIC_DEFAULT_LOCALE,
				preferredUsername: user.preferred_username,
				email: user.email,
				familyName: user.family_name,
				givenName: user.given_name
			}
		});

	return redirect(302, state.visitedUrl);
}

export async function handleLogoutRedirect(req: RequestEvent) {
	req.cookies.delete(codeVerifierCookieName, { path: '/' });
	req.cookies.delete(oidcStateCookieName, { path: '/' });
	req.cookies.delete(accessTokenCookieName, { path: '/' });
	req.cookies.delete(refreshTokenCookieName, { path: '/' });
	req.cookies.delete(idTokenCookieName, { path: '/' });
	req.cookies.delete(expiresInCookieName, { path: '/' });
	req.cookies.delete(scopeCookieName, { path: '/' });
	req.cookies.delete(tokenTypeCookieName, { path: '/' });

	return redirect(303, '/');
}

export async function handleProtectedRoute(req: RequestEvent) {
	try {
		const accessToken = req.cookies.get(accessTokenCookieName);
		const idToken = req.cookies.get(idTokenCookieName);
		if (!accessToken) {
			throw new Error('No access token found');
		}
		const user = await validateTokens({
			access_token: accessToken,
			id_token: idToken
		});

		return user;
	} catch (error) {
		console.warn('Error validating tokens', error);
		const { encrypted_state, encrypted_verifier, redirect_uri } = await startSignin(req.url);

		req.cookies.set(codeVerifierCookieName, encrypted_verifier, {
			sameSite: 'lax',
			maxAge: 60 * 5,
			path: '/',
			secure: true,
			httpOnly: true
		});

		req.cookies.set(oidcStateCookieName, encrypted_state, {
			sameSite: 'lax',
			maxAge: 60 * 5,
			path: '/',
			secure: true,
			httpOnly: true
		});

		throw redirect(302, redirect_uri);
	}
}
