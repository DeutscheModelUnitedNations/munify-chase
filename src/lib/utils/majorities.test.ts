import { describe, it, expect } from 'vitest';
import { calculateMajority } from './majorities';

describe('calculateMajority', () => {
  describe('simple majority', () => {
    it('returns 1 for total of 1', () => {
      expect(calculateMajority(1, 'simple')).toBe(1);
    });

    it('returns 2 for total of 2 (even: total/2 + 1)', () => {
      expect(calculateMajority(2, 'simple')).toBe(2);
    });

    it('returns 2 for total of 3 (odd: ceil(3/2) = 2)', () => {
      expect(calculateMajority(3, 'simple')).toBe(2);
    });

    it('returns 3 for total of 4', () => {
      expect(calculateMajority(4, 'simple')).toBe(3);
    });

    it('returns 3 for total of 5', () => {
      expect(calculateMajority(5, 'simple')).toBe(3);
    });

    it('returns 51 for total of 100', () => {
      expect(calculateMajority(100, 'simple')).toBe(51);
    });

    it('returns 50 for total of 99', () => {
      expect(calculateMajority(99, 'simple')).toBe(50);
    });

    it('returns 0 for total of 0', () => {
      expect(calculateMajority(0, 'simple')).toBe(0);
    });
  });

  describe('two-thirds majority', () => {
    it('returns 1 for total of 1', () => {
      expect(calculateMajority(1, 'twoThirds')).toBe(1);
    });

    it('returns 2 for total of 3', () => {
      expect(calculateMajority(3, 'twoThirds')).toBe(2);
    });

    it('returns 4 for total of 6', () => {
      expect(calculateMajority(6, 'twoThirds')).toBe(4);
    });

    it('returns 7 for total of 10', () => {
      expect(calculateMajority(10, 'twoThirds')).toBe(7);
    });

    it('returns 67 for total of 100', () => {
      expect(calculateMajority(100, 'twoThirds')).toBe(67);
    });

    it('returns 0 for total of 0', () => {
      expect(calculateMajority(0, 'twoThirds')).toBe(0);
    });
  });
});
