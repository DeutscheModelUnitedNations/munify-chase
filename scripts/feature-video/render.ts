/**
 * Renders the landing page feature video from composition.html and the captures made by
 * capture.ts, then writes the files the landing page embeds:
 *
 *   static/video/chase-feature.webm   VP9 + Opus
 *   static/video/chase-feature.mp4    H.264 + AAC, faststart
 *   static/video/chase-feature.jpg    poster (also baked in as the video's first frame)
 *
 *   bun run video:render                 full render
 *   bun run video:render --stills 3,9.5  only these seconds, to .out/stills/ for checking
 *
 * Needs ffmpeg with libx264, libvpx-vp9 and libopus on the PATH.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { synthesize } from './audio';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const HERE = join(ROOT, 'scripts/feature-video');
const OUT = join(HERE, '.out');
const STATIC = join(ROOT, 'static/video');
const FPS = 30;
/** Second whose settled frame becomes the poster */
const POSTER_T = 3.6;

const stillsArg = process.argv.indexOf('--stills');
const stills = stillsArg > 0 ? process.argv[stillsArg + 1].split(',').map(Number) : undefined;

if (!existsSync(join(OUT, 'anchors.json'))) {
	console.error('No captures found. Run `bun run video:capture` first.');
	process.exit(1);
}

function ffmpeg(args: string[], input?: 'pipe') {
	const proc = spawn('ffmpeg', ['-v', 'error', '-y', ...args], { stdio: [input ?? 'ignore', 'inherit', 'inherit'] });
	const done = new Promise<void>((resolve, reject) =>
		proc.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${args.join(' ')} failed`))))
	);
	return { proc, done };
}

// Serves the composition with its captures, anchors and the DMUN fonts from @fontsource
const fontDirs: Record<string, string> = {
	outfit: join(ROOT, 'node_modules/@fontsource/outfit/files'),
	'roboto-mono': join(ROOT, 'node_modules/@fontsource/roboto-mono/files')
};
const server = Bun.serve({
	port: 0,
	fetch(req) {
		const path = decodeURIComponent(new URL(req.url).pathname);
		if (path === '/' || path === '/index.html') return new Response(Bun.file(join(HERE, 'composition.html')));
		if (path === '/anchors.json') return new Response(Bun.file(join(OUT, 'anchors.json')));
		if (path.startsWith('/assets/')) return new Response(Bun.file(join(OUT, path)));
		if (path.startsWith('/fonts/')) {
			const file = path.slice('/fonts/'.length);
			const family = file.startsWith('roboto-mono') ? 'roboto-mono' : 'outfit';
			return new Response(Bun.file(join(fontDirs[family], file)));
		}
		return new Response('Not found', { status: 404 });
	}
});

const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
	page.on('pageerror', (error) => console.error(`composition: ${error.message}`));
	await page.goto(`http://localhost:${server.port}/`, { waitUntil: 'networkidle' });
	await page.waitForFunction(() => 'ready' in window);
	await page.evaluate(() => (window as unknown as { ready: Promise<unknown> }).ready);
	const renderAt = (t: number) => page.evaluate((t) => (window as unknown as { renderAt: (t: number) => void }).renderAt(t), t);

	if (stills) {
		await mkdir(join(OUT, 'stills'), { recursive: true });
		for (const t of stills) {
			await renderAt(t);
			await page.screenshot({ path: join(OUT, 'stills', `${t.toFixed(2)}.jpg`), type: 'jpeg', quality: 85 });
		}
		console.info(`wrote ${stills.length} stills to ${join(OUT, 'stills')}`);
	} else {
		// Soundtrack
		synthesize(join(OUT, 'music-raw.wav'));
		await ffmpeg(['-i', join(OUT, 'music-raw.wav'), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000', join(OUT, 'music.wav')]).done;

		// Frames, piped as JPEGs into a near-lossless master
		const duration = await page.evaluate(() => (window as unknown as { DURATION: number }).DURATION);
		const total = Math.round(duration * FPS);
		const master = ffmpeg(
			['-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '12', '-pix_fmt', 'yuv420p', join(OUT, 'master.mp4')],
			'pipe'
		);
		for (let frame = 0; frame < total; frame++) {
			await renderAt(frame / FPS);
			const jpeg = await page.screenshot({ type: 'jpeg', quality: 95 });
			if (!master.proc.stdin!.write(jpeg)) await new Promise((resolve) => master.proc.stdin!.once('drain', resolve));
			if (frame % 150 === 0) console.info(`frame ${frame}/${total}`);
		}
		master.proc.stdin!.end();
		await master.done;

		// Poster, baked in as frame 0 so every player shows it before playback
		const poster = join(OUT, 'poster.jpg');
		await ffmpeg(['-ss', String(POSTER_T), '-i', join(OUT, 'master.mp4'), '-frames:v', '1', '-q:v', '2', poster]).done;
		const final = join(OUT, 'chase-feature.mp4');
		await ffmpeg([
			'-i', join(OUT, 'master.mp4'), '-i', poster, '-i', join(OUT, 'music.wav'),
			'-filter_complex', "[0:v][1:v]overlay=enable='eq(n\\,0)'[v]", '-map', '[v]', '-map', '2:a',
			'-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
			'-shortest', '-movflags', '+faststart', final
		]).done;

		// Web encodes
		await mkdir(STATIC, { recursive: true });
		await ffmpeg(['-i', final, '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '128k', '-movflags', '+faststart', join(STATIC, 'chase-feature.mp4')]).done;
		await ffmpeg(['-i', final, '-c:v', 'libvpx-vp9', '-crf', '45', '-b:v', '0', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-c:a', 'libopus', '-b:a', '96k', join(STATIC, 'chase-feature.webm')]).done;
		await ffmpeg(['-i', poster, '-q:v', '4', join(STATIC, 'chase-feature.jpg')]).done;
		console.info(`wrote static/video/chase-feature.{webm,mp4,jpg}`);
	}
} finally {
	await browser.close();
	server.stop(true);
}
process.exit(0);
