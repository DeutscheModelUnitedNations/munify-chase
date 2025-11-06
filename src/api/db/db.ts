import { drizzle } from 'drizzle-orm/postgres-js';
import * as schemaInternal from './schema';
import { configPrivate } from '$lib/config/private';
import { relations as relationsInternal } from './relations';

export const db = drizzle(configPrivate.DATABASE_URL, {
	relations: relationsInternal,
	casing: 'snake_case'
});

export const schema = schemaInternal;
export const relations = relationsInternal;
