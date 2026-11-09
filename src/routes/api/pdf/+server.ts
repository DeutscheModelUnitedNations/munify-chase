import { execFile } from 'node:child_process';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type { RequestHandler } from './$types';
import {
	compileResolutionPdf,
	ensureTypstBinary,
	parsePdfBody,
	pdfResponse,
	readJsonBody
} from './pdf';

const execFileAsync = promisify(execFile);

const TYPST_BIN = join(process.cwd(), 'node_modules/.bin/typst');

export const POST: RequestHandler = async ({ request }) => {
	const { resolution, header } = parsePdfBody(await readJsonBody(request));
	await ensureTypstBinary(TYPST_BIN);
	const pdf = await compileResolutionPdf({
		resolution,
		header,
		typstBin: TYPST_BIN,
		runTypst: execFileAsync
	});
	return pdfResponse(pdf);
};
