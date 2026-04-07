import { client } from '$lib/api/rumbleClient/client';
import dayjs from 'dayjs';
import { SvelteDate } from 'svelte/reactivity';
import { readable } from 'svelte/store';

const timeResult = client.liveQuery.serverTime();

export const serverTime = readable(dayjs(), (set) => {
	let interval: ReturnType<typeof setInterval> | undefined;

	const subscription = (timeResult as any).subscribe({
		next: (time: unknown) => {
			if (time) {
				const servertime = dayjs(new SvelteDate(time as Date));
				set(servertime);

				const delta = dayjs().diff(servertime);

				clearInterval(interval);
				interval = setInterval(() => {
					set(dayjs().add(delta, 'millisecond'));
				}, 1000);
			}
		}
	});

	return () => {
		subscription?.unsubscribe?.();
		clearInterval(interval);
	};
});
