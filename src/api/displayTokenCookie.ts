/** Cookie carrying the public-display bearer token. Shared so the /display
 * route, the SvelteKit hook and the websocket upgrade agree on one name. */
export const DISPLAY_TOKEN_COOKIE = 'display_token';
