import dayjs from 'dayjs';
import { browser } from '$app/environment';

export const serverTime = $state({ value: dayjs() });

let lastCalculatedDelta = 0;

const fetchRemoteTime = async () => {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ serverTime }' })
  });
  const data = await res.json();
  serverTime.value = dayjs(data.data.serverTime);
  lastCalculatedDelta = dayjs().diff(serverTime.value);
};

const updateLocalTime = () => {
  serverTime.value = dayjs().add(lastCalculatedDelta, 'millisecond');
};

if (browser) {
  fetchRemoteTime();
  setInterval(fetchRemoteTime, 60000); // sync every minute
  setInterval(updateLocalTime, 500); // update 2 times a second
}
