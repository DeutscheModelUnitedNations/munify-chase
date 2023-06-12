import {PrismaClient} from "@prisma/client";

/**
 * The application wide db connection
 */
export let db: PrismaClient;

export function setDb(newDb: PrismaClient) {
  db = newDb;
}
