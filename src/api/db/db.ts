import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaInternal from './schema';
import { relations as relationsInternal } from './relations';
import { DATABASE_URL } from '$app/env/private';
import { building } from '$app/env';

const conf = {
	relations: relationsInternal,
	jit: true
} as const;

export const db = building ? drizzle.mock(conf) : drizzle(DATABASE_URL, conf);

export const schema = schemaInternal;
export const relations = relationsInternal;
