import { HoudiniClient, type ClientPlugin } from '$houdini';
import toast from 'svelte-french-toast';
import { error } from '@sveltejs/kit';
import { subscription } from '$houdini/plugins';
import { createClient } from 'graphql-sse';
import { browser } from '$app/environment';

let redirecting = false;

const authRedirect: ClientPlugin = () => ({
	end(ctx, { resolve, value }) {
		if (!redirecting && value.errors?.some((e) => e.message === 'Must be logged in')) {
			console.warn('[auth] Session expired, redirecting to login...');
			redirecting = true;
			if (browser) {
				window.location.reload();
			}
		}
		resolve(ctx);
	}
});

const url = '/api/graphql';
export default new HoudiniClient({
	url,
	plugins: [authRedirect, subscription(() => createClient({ url }))],
	throwOnError: {
		operations: ['mutation', 'subscription'],
		error: (errors, ctx) => {
			const err = errors.at(0);
			if (err) {
				toast.error(err.message, {
					position: 'bottom-right'
				});
				error(500, `${errors.map((err) => err.message).join('. ')} (${ctx.artifact.name})`);
			} else {
				toast.error('Something went wrong', {
					position: 'bottom-right'
				});
				error(500, 'Something went wrong');
			}
		}
	},
	fetchParams() {
		return {
			credentials: 'include'
		};
	}
});
