/**
 * Lets a scanned code through at most once per `debounceMs()` milliseconds, so a code
 * held under the camera fires once rather than on every frame.
 */
export function createDetectionThrottle(debounceMs: () => number) {
	const recentDetections = new Map<string, number>();

	return (text: string, now: number): boolean => {
		const window = debounceMs();
		const last = recentDetections.get(text);
		if (last && now - last < window) return false;
		recentDetections.set(text, now);
		// Clean up old entries so the map doesn't grow unbounded.
		for (const [code, ts] of recentDetections) {
			if (now - ts > window * 4) recentDetections.delete(code);
		}
		return true;
	};
}

export function errorText(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
