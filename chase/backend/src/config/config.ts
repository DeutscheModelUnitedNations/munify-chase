/**
 * @param envName The env variable to load
 * @returns The variable value or undefined
 */
export function requireEnv(envName: string): string {
  const v = process.env[envName];
  if (!v) {
    throw new Error(`${envName} env var must be set`);
  }
  return v;
}

const NODE_ENV = process.env.NODE_ENV ?? "production";

export const appConfiguration = {
  production: NODE_ENV !== "development",
  development: NODE_ENV === "development",
  CORSOrigins:
    NODE_ENV === "development"
      ? ["*"]
      : requireEnv("CORS_ORIGINS")
          ?.split(",")
          .map((origin) => origin.trim()),
  port: process.env.PORT ?? "3000",
  documentationPath: process.env.DOCUMENTATION_PATH ?? "documentation",
  appName: process.env.APP_NAME ?? "CHASE API",
  cookieSecrets:
    NODE_ENV === "development"
      ? ["not", "very", "secure"]
      : requireEnv("COOKIE_SECRETS")
          ?.split(",")
          .map((origin) => origin.trim()),
  db: {
    postgresUrl:
      NODE_ENV === "development"
        ? process.env.DATABASE_URL ??
          "postgresql://postgres:postgres@localhost:5432/postgres"
        : requireEnv("DATABASE_URL"),
    redisUrl: requireEnv("REDIS_URL"),
  },
};
