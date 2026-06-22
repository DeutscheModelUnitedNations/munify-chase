import { resolutionToTypst } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import {
	ResolutionSchema,
	type ResolutionHeaderData
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import { unEmblemSvg } from '@deutschemodelunitednations/munify-resolution-editor';
import { error } from '@sveltejs/kit';
import { execFile } from 'node:child_process';
import { mkdtemp, rm, writeFile, readFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { RequestHandler } from './$types';

const execFileAsync = promisify(execFile);

const TYPST_BIN = join(process.cwd(), 'node_modules/.bin/typst');

/**
 * Decode a `data:image/svg+xml` URL back into raw SVG. Supports both the
 * percent-encoded form produced by `svgToDataUrl` and base64 data URLs.
 * Returns `null` if the input is not a recognisable SVG data URL.
 */
function decodeEmblemDataUrl(dataUrl: string): string | null {
	const match = /^data:image\/svg\+xml(;base64)?,(.*)$/s.exec(dataUrl.trim());
	if (!match) return null;
	try {
		const decoded = match[1]
			? Buffer.from(match[2], 'base64').toString('utf-8')
			: decodeURIComponent(match[2]);
		return decoded.includes('<svg') ? decoded : null;
	} catch {
		return null;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON');
	}

	const parsed = ResolutionSchema.safeParse((body as { resolution?: unknown })?.resolution);
	if (!parsed.success) throw error(400, 'Invalid resolution data');

	const header: ResolutionHeaderData = (body as { header?: ResolutionHeaderData })?.header ?? {};

	try {
		await access(TYPST_BIN);
	} catch {
		throw error(500, 'Typst binary not available on the server');
	}

	const dir = await mkdtemp(join(tmpdir(), 'mun-'));
	try {
		const emblemSvg = header.conferenceEmblem
			? (decodeEmblemDataUrl(header.conferenceEmblem) ?? unEmblemSvg)
			: unEmblemSvg;
		const emblemPath = 'emblem.svg';
		await writeFile(join(dir, emblemPath), emblemSvg);

		const source = resolutionToTypst(parsed.data, header, { emblemPath });
		await writeFile(join(dir, 'resolution.typ'), source);

		await execFileAsync(TYPST_BIN, ['compile', 'resolution.typ', 'resolution.pdf'], {
			cwd: dir,
			timeout: 30_000
		});

		const pdf = await readFile(join(dir, 'resolution.pdf'));
		return new Response(new Uint8Array(pdf), {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename="resolution.pdf"'
			}
		});
	} catch (e) {
		const stderr = (e as { stderr?: string | Buffer })?.stderr;
		const detail = stderr ? String(stderr) : e instanceof Error ? e.message : String(e);
		throw error(500, `Typst compilation failed: ${detail}`);
	} finally {
		await rm(dir, { recursive: true, force: true });
	}
};
