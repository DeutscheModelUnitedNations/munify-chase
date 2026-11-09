import { describe, expect, test, vi } from 'vitest';
import { access, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { unEmblemSvg } from '@deutschemodelunitednations/munify-resolution-editor';
import {
	compileErrorDetail,
	compileResolutionPdf,
	decodeEmblemDataUrl,
	emblemSvgFor,
	ensureTypstBinary,
	parsePdfBody,
	pdfResponse,
	readJsonBody,
	type RunTypst
} from './pdf';

const svg = '<svg xmlns="http://www.w3.org/2000/svg"></svg>';
const resolution = { committeeName: 'General Assembly', preamble: [], operative: [] };

describe('decodeEmblemDataUrl', () => {
	test('decodes a percent-encoded SVG data URL', () => {
		expect(decodeEmblemDataUrl(`data:image/svg+xml,${encodeURIComponent(svg)}`)).toBe(svg);
	});

	test('decodes a base64 SVG data URL, ignoring surrounding whitespace', () => {
		const base64 = Buffer.from(svg).toString('base64');
		expect(decodeEmblemDataUrl(`  data:image/svg+xml;base64,${base64}\n`)).toBe(svg);
	});

	test('rejects other data URLs, non-SVG content and broken encoding', () => {
		expect(decodeEmblemDataUrl('data:image/png;base64,AAAA')).toBeNull();
		expect(decodeEmblemDataUrl('data:image/svg+xml,hello')).toBeNull();
		expect(decodeEmblemDataUrl('data:image/svg+xml,%E0%A4%A')).toBeNull();
	});
});

describe('emblemSvgFor', () => {
	test('falls back to the UN emblem without or with an unreadable emblem', () => {
		expect(emblemSvgFor({})).toBe(unEmblemSvg);
		expect(emblemSvgFor({ conferenceEmblem: 'nonsense' })).toBe(unEmblemSvg);
	});

	test('uses the conference emblem when it decodes', () => {
		expect(
			emblemSvgFor({ conferenceEmblem: `data:image/svg+xml,${encodeURIComponent(svg)}` })
		).toBe(svg);
	});
});

describe('readJsonBody', () => {
	test('parses JSON and answers 400 otherwise', async () => {
		const ok = new Request('http://x', { method: 'POST', body: '{"a":1}' });
		expect(await readJsonBody(ok)).toEqual({ a: 1 });
		const bad = new Request('http://x', { method: 'POST', body: '{' });
		await expect(readJsonBody(bad)).rejects.toMatchObject({ status: 400 });
	});
});

describe('parsePdfBody', () => {
	test('returns the resolution and the header, an empty header by default', () => {
		expect(parsePdfBody({ resolution })).toEqual({ resolution, header: {} });
		const header = { conferenceName: 'MUN' };
		expect(parsePdfBody({ resolution, header }).header).toBe(header);
	});

	test('answers 400 for a missing or invalid resolution', () => {
		expect(() => parsePdfBody(null)).toThrow(expect.objectContaining({ status: 400 }));
		expect(() => parsePdfBody({ resolution: { committeeName: 1 } })).toThrow(
			expect.objectContaining({ status: 400 })
		);
	});
});

describe('ensureTypstBinary', () => {
	test('passes for an existing file and answers 500 for a missing one', async () => {
		await expect(ensureTypstBinary(process.cwd())).resolves.toBeUndefined();
		await expect(ensureTypstBinary('/nonexistent/typst')).rejects.toMatchObject({ status: 500 });
	});
});

describe('compileErrorDetail', () => {
	test('prefers stderr, then the error message, then the value itself', () => {
		expect(compileErrorDetail({ stderr: Buffer.from('boom') })).toBe('boom');
		expect(compileErrorDetail(new Error('failed'))).toBe('failed');
		expect(compileErrorDetail('plain')).toBe('plain');
		expect(compileErrorDetail(null)).toBe('null');
	});
});

describe('compileResolutionPdf', () => {
	test('writes the sources, runs Typst in a temporary directory and returns the PDF', async () => {
		let workDir = '';
		const runTypst: RunTypst = vi.fn(async (_bin, _args, { cwd }) => {
			workDir = cwd;
			expect(await readFile(join(cwd, 'emblem.svg'), 'utf-8')).toBe(unEmblemSvg);
			expect(await readFile(join(cwd, 'resolution.typ'), 'utf-8')).toContain('emblem.svg');
			await writeFile(join(cwd, 'resolution.pdf'), 'PDF');
		});

		const pdf = await compileResolutionPdf({
			resolution,
			header: {},
			typstBin: '/bin/typst',
			runTypst
		});

		expect(new TextDecoder().decode(pdf)).toBe('PDF');
		expect(runTypst).toHaveBeenCalledWith(
			'/bin/typst',
			['compile', 'resolution.typ', 'resolution.pdf'],
			{ cwd: workDir, timeout: 30_000 }
		);
		await expect(access(workDir)).rejects.toThrow();
	});

	test('answers 500 with Typst output when compiling fails', async () => {
		const runTypst: RunTypst = () =>
			Promise.reject(Object.assign(new Error('exit 1'), { stderr: 'syntax error' }));
		await expect(
			compileResolutionPdf({ resolution, header: {}, typstBin: '/bin/typst', runTypst })
		).rejects.toMatchObject({
			status: 500,
			body: { message: 'Typst compilation failed: syntax error' }
		});
	});
});

describe('pdfResponse', () => {
	test('sends the PDF as an attachment', async () => {
		const response = pdfResponse(new TextEncoder().encode('PDF'));
		expect(response.headers.get('Content-Type')).toBe('application/pdf');
		expect(response.headers.get('Content-Disposition')).toBe(
			'attachment; filename="resolution.pdf"'
		);
		expect(await response.text()).toBe('PDF');
	});
});
