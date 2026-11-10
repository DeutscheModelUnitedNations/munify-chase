import type { Duration } from 'dayjs/plugin/duration';

/** `m:ss`-style countdown, with the hours in front once there are any */
export function formatCountdown(delta: Duration): string {
	return `${delta.hours() !== 0 ? delta.format('H:') : ''}${delta.format('mm:ss')}`;
}
