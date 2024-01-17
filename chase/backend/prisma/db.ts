import { appConfiguration } from "../src/config/config";
import { PrismaClient } from "./generated/client";
import { createClient } from "redis";

export const db = new PrismaClient({
  datasourceUrl: appConfiguration.db.postgresUrl,
});

export const redis = createClient({
  url: appConfiguration.db.redisUrl,
});
redis.on("error", (err) => console.error("Redis Client Error", err));
await redis.connect();
