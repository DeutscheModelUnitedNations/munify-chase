import { customAlphabet } from 'nanoid';

// Same no-lookalike alphabet as nanoid.ts but at length 6 — short enough to be
// dictated/typed when the QR scanner can't be used, while still leaving ~2.2B
// possible codes (collision-retry on regenerate is built into the handler).
export const attendanceCode = customAlphabet('6789BCDFGHJKLMNPQRTWbcdfghjkmnpqrtwz', 6);
