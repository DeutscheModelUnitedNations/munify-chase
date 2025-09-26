import { graphql } from '$houdini';
import dayjs from 'dayjs';
import { SvelteDate } from 'svelte/reactivity';
import { derived } from 'svelte/store';

export const timeQuery = graphql(`
	query ServerTime {
		serverTime
	}
`);

export const serverTime = derived(
	timeQuery,
	(time, set) => {
		if (time.data?.serverTime) {
			const servertime = dayjs(new SvelteDate(time.data.serverTime));
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
