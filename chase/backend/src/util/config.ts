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
const development = NODE_ENV === "development";

export const appConfiguration = {
  production: !development,
  development,
  CORSOrigins: development
    ? ["localhost:3000", "localhost:3001"]
    : requireEnv("CORS_ORIGINS")
        ?.split(",")
        .map((origin) => origin.trim()),
  port: process.env.PORT ?? "3000",
  documentationPath: process.env.DOCUMENTATION_PATH ?? "documentation",
  appName: process.env.APP_NAME ?? "CHASE",
  cookie: {
    secrets: development
      ? ["not", "very", "secure"]
      : requireEnv("COOKIE_SECRETS")
          ?.split(",")
          .map((origin) => origin.trim()),
  },
  db: {
    postgresUrl: development
      ? process.env.DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/postgres"
      : requireEnv("DATABASE_URL"),
    redisUrl: development
      ? process.env.REDIS_URL ?? "redis://default:redispw@localhost:6379"
      : requireEnv("REDIS_URL"),
  },
  email: {
    EMAIL_HOST: development ? "localhost" : requireEnv("EMAIL_HOST"),
    EMAIL_PORT: development ? 5968 : Number.parseInt(requireEnv("EMAIL_PORT")),
    EMAIL_SECURE: development ? false : requireEnv("EMAIL_SECURE") !== "false",
    EMAIL_AUTH_USER: development ? "dev" : requireEnv("EMAIL_AUTH_USER"),
    EMAIL_AUTH_PASS: development ? "dev" : requireEnv("EMAIL_AUTH_PASS"),
    EMAIL_FROM: development ? "noreply@localhost" : requireEnv("EMAIL_FROM"),
    EMAIL_VERIFY_REDIRECT_URL: development
      ? "http://localhost:3000/pages/login/validateEmail"
      : requireEnv("EMAIL_VERIFY_REDIRECT_URL"),
  },
  passkeys: {
    RELAY_NAME: process.env.RELAY_NAME ?? "CHASE - DMUN e.V.",
    RELAY_ID: process.env.RELAY_ID ?? "localhost",
    RELAY_ORIGIN: development
      ? "https://localhost:3000"
      : requireEnv("RELAY_ORIGIN"),
  },
};
