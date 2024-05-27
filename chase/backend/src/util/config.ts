// TODO: We should probably use a library for this

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

/**
 * @param envName The env variable to load
 * @param devDefault The default value to use in development
 * @returns The variable value or the default value
 */
function requireEnvInProd(envName: string, devDefault: string): string {
  const v = process.env[envName];
  if (!v) {
    if (development || test) {
      return devDefault;
    }
    throw new Error(`${envName} env var must be set`);
  }
  return v;
}

const development = requireEnv("NODE_ENV") === "development";
const test = requireEnv("NODE_ENV") === "test";

export const appConfiguration = {
  production: !development,
  development,
  CORSOrigins: requireEnvInProd("CORS_ORIGINS", "localhost:3000,localhost:3001")
    .split(",")
    .map((origin) => origin.trim()),
  port: process.env.PORT ?? "3001",
  appName: process.env.APP_NAME ?? "CHASE",
  db: {
    postgresUrl: requireEnvInProd(
      "DATABASE_URL",
      "postgresql://postgres:postgres@localhost:5432/postgres",
    ),
  },
  oidc: {
    issuer: requireEnvInProd("OIDC_ISSUER", "http://localhost:8080"),
    clientId: requireEnvInProd("OIDC_CLIENT_ID", "chase"),
  },
};
