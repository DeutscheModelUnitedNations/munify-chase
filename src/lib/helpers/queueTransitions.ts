import { cubicInOut, cubicOut } from 'svelte/easing';

/** Shared by the presentation's queues, so entries move, appear and leave the same way */
export const queueFlip = { duration: 500, easing: cubicInOut };
export const queueIn = { duration: 500, y: 20, easing: cubicOut };
export const queueOut = { duration: 500, y: -20, easing: cubicOut };
