import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaInternal from './schema';
import { relations as relationsInternal } from './relations';
import { configPrivate } from '$config/private';

export const db = drizzle(configPrivate.DATABASE_URL, {
	relations: relationsInternal,
	casing: 'snake_case',
	schema: schemaInternal
});

export const schema = schemaInternal;
export const relations = relationsInternal;
