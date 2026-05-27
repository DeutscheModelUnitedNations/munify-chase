let wsConnected = $state(false);
let browserOnline = $state(typeof navigator !== 'undefined' ? navigator.onLine : true);

export function setWsConnected(value: boolean) {
	wsConnected = value;
}

export function isOnline(): boolean {
	return browserOnline && wsConnected;
}

if (typeof window !== 'undefined') {
	window.addEventListener('online', () => {
		browserOnline = true;
	});
	window.addEventListener('offline', () => {
		browserOnline = false;
	});
}

export const connectionState = {
	get online() {
		return isOnline();
	},
	get wsConnected() {
		return wsConnected;
	},
	get browserOnline() {
		return browserOnline;
	}
};
