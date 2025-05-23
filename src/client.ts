import { HoudiniClient } from '$houdini';
import toast from 'svelte-french-toast';
import { error } from '@sveltejs/kit';
import { subscription } from '$houdini/plugins';
import { createClient } from 'graphql-sse';

const url = '/api/graphql';
export default new HoudiniClient({
	url,
	plugins: [subscription(() => createClient({ url }))],
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
