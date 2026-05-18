/**
 * Convert a raw SVG string into a `data:image/svg+xml` URL suitable for
 * `ResolutionHeaderData.conferenceEmblem`.
 *
 * Percent-encoding is used (rather than base64) because it is unicode-safe and
 * works identically in the browser and on the server. The resolution editor's
 * emblem decoder accepts both percent-encoded and base64 data URLs.
 *
 * Returns `undefined` for empty/nullish input so the editor falls back to its
 * built-in UN emblem.
 */
export function svgToDataUrl(svg: string | null | undefined): string | undefined {
	if (!svg) return undefined;
	const trimmed = svg.trim();
	if (trimmed === '') return undefined;
	return `data:image/svg+xml,${encodeURIComponent(trimmed)}`;
}
