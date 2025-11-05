import { z } from 'zod/v4';
import type { RequestHandler } from './$types';
import { importDataSchema } from '$lib/utils/import';

export const GET: RequestHandler = () => {
	return new Response(JSON.stringify(z.toJSONSchema(importDataSchema), null, 2));
};
