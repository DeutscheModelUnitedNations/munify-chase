import { createClient } from 'graphql-sse';
const token = process.env.TOKEN!;
const sse = createClient({ url: 'http://localhost:5173/api/graphql/stream', headers: { 'x-munify-link-token': token }, singleConnection: true, lazy: false, retryAttempts: 3, on: { connected: (r) => console.log('connected', r) } });
sse.subscribe({ query: `subscription { committees(where: { conferenceId: { eq: "seed-conference-preparation" } }) { id name } }` }, {
	next: (v: any) => console.log(new Date().toISOString().slice(11, 19), 'next', JSON.stringify(v).slice(0, 140)),
	error: (e: any) => console.log('error', JSON.stringify(e).slice(0, 300)),
	complete: () => console.log('complete')
});
setTimeout(() => process.exit(0), Number(process.env.WAIT ?? 60000));
