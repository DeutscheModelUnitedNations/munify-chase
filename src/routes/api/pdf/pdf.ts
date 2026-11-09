import { resolutionToTypst } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import {
	ResolutionSchema,
	type Resolution,
	type ResolutionHeaderData
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import { unEmblemSvg } from '@deutschemodelunitednations/munify-resolution-editor';
import { error } from '@sveltejs/kit';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SVG_DATA_URL = /^data:image\/svg\+xml(;base64)?,(.*)$/s;

function decodeDataUrlPayload(isBase64: boolean, payload: string) {
	return isBase64 ? Buffer.from(payload, 'base64').toString('utf-8') : decodeURIComponent(payload);
}

/**
 * Decode a `data:image/svg+xml` URL back into raw SVG. Supports both the
 * percent-encoded form produced by `svgToDataUrl` and base64 data URLs.
 * Returns `null` if the input is not a recognisable SVG data URL.
 */
export function decodeEmblemDataUrl(dataUrl: string): string | null {
	const match = SVG_DATA_URL.exec(dataUrl.trim());
	if (!match) return null;
	try {
		const decoded = decodeDataUrlPayload(Boolean(match[1]), match[2]);
		return decoded.includes('<svg') ? decoded : null;
	} catch {
		return null;
	}
}

/** The conference emblem from the header, or the UN emblem when there is none or it is unreadable. */
export function emblemSvgFor(header: ResolutionHeaderData): string {
	if (!header.conferenceEmblem) return unEmblemSvg;
	return decodeEmblemDataUrl(header.conferenceEmblem) ?? unEmblemSvg;
}

/** Reads the request body as JSON, a 400 when it is not. */
export async function readJsonBody(request: Request): Promise<unknown> {
	try {
		return await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}
}

/** Validates the resolution and picks the header out of a PDF request body, a 400 when invalid. */
export function parsePdfBody(body: unknown): {
	resolution: Resolution;
	header: ResolutionHeaderData;
} {
	const fields = (body ?? {}) as { resolution?: unknown; header?: ResolutionHeaderData };
	const parsed = ResolutionSchema.safeParse(fields.resolution);
	if (!parsed.success) throw error(400, 'Invalid resolution data');
	return { resolution: parsed.data, header: fields.header ?? {} };
}

/** A 500 when the Typst binary is missing. */
export async function ensureTypstBinary(typstBin: string): Promise<void> {
	try {
		await access(typstBin);
	} catch {
		throw error(500, 'Typst binary not available on the server');
	}
}

/** The message for a failed compile: Typst's stderr when there is one, else the error itself. */
export function compileErrorDetail(e: unknown): string {
	const stderr = (e as { stderr?: string | Buffer } | null)?.stderr;
	if (stderr) return String(stderr);
	return e instanceof Error ? e.message : String(e);
}

export type RunTypst = (
	bin: string,
	args: string[],
	options: { cwd: string; timeout: number }
) => Promise<unknown>;

/**
 * Writes the resolution and its emblem into a temporary directory, compiles it with Typst and
 * returns the PDF. The directory is removed afterwards, a failure is a 500 with Typst's output.
 */
export async function compileResolutionPdf({
	resolution,
	header,
	typstBin,
	runTypst
}: {
	resolution: Resolution;
	header: ResolutionHeaderData;
	typstBin: string;
	runTypst: RunTypst;
}): Promise<Uint8Array<ArrayBuffer>> {
	const dir = await mkdtemp(join(tmpdir(), 'mun-'));
	try {
		const emblemPath = 'emblem.svg';
		await writeFile(join(dir, emblemPath), emblemSvgFor(header));
		await writeFile(
			join(dir, 'resolution.typ'),
			resolutionToTypst(resolution, header, { emblemPath })
		);
		await runTypst(typstBin, ['compile', 'resolution.typ', 'resolution.pdf'], {
			cwd: dir,
			timeout: 30_000
		});
		return new Uint8Array(await readFile(join(dir, 'resolution.pdf')));
	} catch (e) {
		throw error(500, `Typst compilation failed: ${compileErrorDetail(e)}`);
	} finally {
		await rm(dir, { recursive: true, force: true });
	}
}

export function pdfResponse(pdf: Uint8Array<ArrayBuffer>): Response {
	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="resolution.pdf"'
		}
	});
}
