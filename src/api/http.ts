import { yoga } from './rumble';
import type { WebSocketHandler } from 'svelte-adapter-bun';

import './handlers/register';

export const yogaInstance = yoga();

export const webSocketHandler: WebSocketHandler = {
	open(ws) {
		console.log('WebSocket opened');
		ws.send('Slava Ukraїni');
	},
	upgrade(request, upgrade) {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/api/graphql')) {
			return upgrade(request);
		}
		return false;
	},
	message(ws, message) {
		console.log(message);
	}
};
