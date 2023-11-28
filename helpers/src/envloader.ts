/**
 * @param envName The env variable to load
 * @returns The variable value or undefined
 */
export function requireEnv(envName: string): string {
  const v = process.env[envName];
  if (!v) {
    throw new Error(`${v} env var must be set`);
  }
  return v;
} /**
 * Loads an env var. If the auth is mocked,
 * it will not load the var (return undefined), and dont throw an error.
 * If the auth is not mocked, it will throw an error if the var is not set.
 * This is useful for stuff like OIDC config, which is not needed when developing.
 * @param envName The env variable to load
 * @returns The variable value or undefined
 */
export function requireEnvWhenAuthNotMocked(envName: string): string {
  if (isAuthMocked()) {
    return undefined as unknown as string;
  }

  return requireEnv(envName);
}

/**
 * @returns Whether the auth is mocked
 */
export function isAuthMocked(): boolean {
  return (
    process.env.NODE_ENV === "development" && process.env.MOCK_AUTH === "true"
  );
}

if (isAuthMocked()) {
  console.warn(`
  =================== WARNING ===================

  You are running the backend in development mode
  Authentication is disabled and mocked data
  is used

  ===============================================
  `);
}

/**
 * @returns Whether the backend is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}
