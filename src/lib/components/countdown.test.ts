import { describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { formatCountdown } from './countdown';

dayjs.extend(duration);

describe('formatCountdown', () => {
	it('shows hours only once there are some', () => {
		expect(formatCountdown(dayjs.duration(65_000))).toBe('01:05');
		expect(formatCountdown(dayjs.duration(3_725_000))).toBe('1:02:05');
	});
});
