import { appConfiguration } from "../src/util/config";
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

// maintanance
setInterval(
  async () => {
    await db.pendingCredentialCreateTask.deleteMany({
      where: {
        token: {
          expiresAt: {
            lte: new Date(),
          },
        },
      },
    });

    await db.token.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(),
        },
      },
    });
  },
  1000 * 60 * 11,
);
