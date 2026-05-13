import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaInternal from './schema';
import { relations as relationsInternal } from './relations';
import { configPrivate } from '$config/private';
import { building } from '$app/environment';

const conf = {
	relations: relationsInternal,
	casing: 'snake_case',
	schema: schemaInternal
} as const;

export const db = building ? drizzle.mock(conf) : drizzle(configPrivate.DATABASE_URL, conf);

export const schema = schemaInternal;
export const relations = relationsInternal;
