import { writable } from 'svelte/store';

export const modelDownloadProgress = writable<number | null>(null);
