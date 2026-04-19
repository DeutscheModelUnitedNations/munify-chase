import { browser } from '$app/environment';
import { client } from '$lib/api/rumbleClient/client';
import dayjs, { type Dayjs } from 'dayjs';

let current = $state(dayjs());
const intervalDuration = 500;

if (browser) {
  const servertime = await client.query.serverTime();
  if (servertime) {
    current = dayjs(servertime);
    setInterval(() => {
      current = current.add(intervalDuration, 'ms');
    }, intervalDuration);
  }
}

export function getServerTime(): Dayjs {
  return current;
}
