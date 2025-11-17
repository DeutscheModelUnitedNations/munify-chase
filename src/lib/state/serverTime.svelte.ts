import dayjs from "dayjs";
import { browser } from "$app/environment";
import { client } from "$lib/api/rumbleClient/client";

export const serverTime = $state({ value: dayjs() });

let lastCalculatedDelta = 0;

const fetchRemoteTime = async () => {
  const time = await client.query.serverTime();
  serverTime.value = dayjs(time);
  lastCalculatedDelta = dayjs().diff(serverTime.value);
};

const updateLocalTime = () => {
  serverTime.value = dayjs().add(lastCalculatedDelta, "millisecond");
};

if (browser) {
  fetchRemoteTime();
  setInterval(fetchRemoteTime, 60000); // sync every minute
  setInterval(updateLocalTime, 500); // update 2 times a second
}
