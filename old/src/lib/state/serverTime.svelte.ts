import { graphql } from '$houdini';
import dayjs from 'dayjs';
import { derived } from 'svelte/store';

export const timeQuery = graphql(`
	query ServerTime @load {
		serverTime
	}
`);

export const serverTime = derived(
	timeQuery,
	(time, set) => {
		if (time.data?.serverTime) {
			const servertime = dayjs(new Date(time.data.serverTime));
			set(servertime);

			const delta = dayjs().diff(servertime);

			const interval = setInterval(() => {
				set(dayjs().add(delta, 'millisecond'));
			}, 1000);

			return () => clearInterval(interval);
		}
	},
	dayjs()
);
