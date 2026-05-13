import { customAlphabet } from 'nanoid';

// Uppercase-only no-lookalike alphabet (excludes 0, 1, I, O). Codes are
// dictated/typed by chairs when the QR scanner can't be used; case-insensitive
// matching is enforced server-side.
export const attendanceCode = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 6);
