/** The locale a path starts with (`/en/…`, `/en`), and the path without it. */
export function localePrefix({
	pathname,
	locales
}: {
	pathname: string;
	locales: readonly string[];
}): { locale: string; bare: string } | undefined {
	const locale = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
	if (!locale) return undefined;
	return { locale, bare: pathname.slice(`/${locale}`.length) || '/' };
}
