import { drizzle } from 'drizzle-orm/node-postgres';
import * as schemaInternal from './schema';
import { relations as relationsInternal } from './relations';
import { DATABASE_URL } from '$env/static/private';

export const db = drizzle(DATABASE_URL, {
	relations: relationsInternal,
	casing: 'snake_case'
});

export const schema = schemaInternal;
export const relations = relationsInternal;
