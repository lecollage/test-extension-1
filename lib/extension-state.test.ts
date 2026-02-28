import { describe, expect, it } from 'vitest';

import { badgeTextForCount, incrementCount, readStoredCount } from './extension-state';

describe('extension state helpers', () => {
  it('reads a stored numeric counter', () => {
    expect(readStoredCount(7)).toBe(7);
  });

  it('falls back to zero for invalid values', () => {
    expect(readStoredCount(undefined)).toBe(0);
    expect(readStoredCount('7')).toBe(0);
  });

  it('increments the counter by one', () => {
    expect(incrementCount(2)).toBe(3);
    expect(incrementCount(0)).toBe(1);
  });

  it('renders badge text only for positive counts', () => {
    expect(badgeTextForCount(0)).toBe('');
    expect(badgeTextForCount(9)).toBe('9');
    expect(badgeTextForCount(-1)).toBe('');
  });
});
