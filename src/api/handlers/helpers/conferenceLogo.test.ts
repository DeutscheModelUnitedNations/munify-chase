import { describe, expect, it } from 'vitest';
import { logoSvgUpdate } from './conferenceLogo';

describe('logoSvgUpdate', () => {
	it('leaves the logo when none is given', () => {
		expect(logoSvgUpdate(undefined)).toEqual({});
		expect(logoSvgUpdate(null)).toEqual({});
	});
	it('removes the logo for a blank string', () => {
		expect(logoSvgUpdate('  ')).toEqual({ logoSvg: null });
	});
	it('stores an SVG verbatim', () => {
		expect(logoSvgUpdate(' <svg/> ')).toEqual({ logoSvg: ' <svg/> ' });
	});
	it('refuses anything else and oversized logos', () => {
		expect(() => logoSvgUpdate('<png>')).toThrow('Invalid SVG logo');
		expect(() => logoSvgUpdate(`<svg>${'x'.repeat(512 * 1024)}</svg>`)).toThrow('Invalid SVG logo');
	});
});
