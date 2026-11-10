/** The message of a thrown error, else `fallback`, else the thrown value as text. */
export function errorMessage(err: unknown, fallback?: string): string {
	if (err instanceof Error) return err.message;
	return fallback ?? String(err);
}
