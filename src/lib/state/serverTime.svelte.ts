import { graphql } from '$houdini';
import dayjs from 'dayjs';
import { derived } from 'svelte/store';

const timeQuery = graphql(`
	query ServerTime @load {
		serverTime
	}
`);

export const serverTime = derived(
	timeQuery,
	(time, set) => {
		if (time.data?.serverTime) {
			set(dayjs(new Date(time.data.serverTime)));
		}
	},
	dayjs(new Date())
);
