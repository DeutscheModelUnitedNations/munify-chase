import dayjs from "dayjs";
import { client } from "$lib/api/rumbleClient/client";

// export const serverTime = derived(
// 	timeQuery,
// 	(time, set) => {
// 		if (time.data?.serverTime) {
// 			const servertime = dayjs(new Date(time.data.serverTime));
// 			set(servertime);

// 			const delta = dayjs().diff(servertime);

// 			const interval = setInterval(() => {
// 				set(dayjs().add(delta, 'millisecond'));
// 			}, 1000);

// 			return () => clearInterval(interval);
// 		}
// 	},
// 	dayjs()
// );

export const serverTime = $state({ value: dayjs() });

(async () => {
  const time = await client.query.serverTime();
  serverTime.value = dayjs(time);
})();
