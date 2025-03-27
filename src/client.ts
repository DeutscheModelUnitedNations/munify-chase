import { HoudiniClient } from '$houdini';
import { toast } from '@zerodevx/svelte-toast';
import { error } from '@sveltejs/kit';
import { subscription } from '$houdini/plugins';

const url = '/api/graphql';
export default new HoudiniClient({
	url,
	throwOnError: {
		operations: ['mutation', 'subscription'],
		error: (errors, ctx) => {
			const err = errors.at(0);
			if (err) {
				toast.push(err.message);
				error(500, `${errors.map((err) => err.message).join('. ')} (${ctx.artifact.name})`);
			} else {
				toast.push('Something went wrong');
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
