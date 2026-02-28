import { describe, expect, it } from 'vitest';

import { getChangedCounterValue, getStoredCounterValue } from './background';

describe('background helpers', () => {
  it('reads a stored numeric counter value', () => {
    expect(getStoredCounterValue(5)).toBe(5);
    expect(getStoredCounterValue(null)).toBe(0);
  });

  it('returns null when the storage area is not local', () => {
    expect(
      getChangedCounterValue(
        { popupOpenCount: { newValue: 4 } },
        'sync',
        'popupOpenCount'
      )
    ).toBeNull();
  });

  it('returns null when the watched key is missing', () => {
    expect(
      getChangedCounterValue(
        { otherKey: { newValue: 4 } },
        'local',
        'popupOpenCount'
      )
    ).toBeNull();
  });

  it('returns null when the changed value is not numeric', () => {
    expect(
      getChangedCounterValue(
        { popupOpenCount: { newValue: '4' } },
        'local',
        'popupOpenCount'
      )
    ).toBeNull();
  });

  it('returns the changed numeric counter value', () => {
    expect(
      getChangedCounterValue(
        { popupOpenCount: { newValue: 4 } },
        'local',
        'popupOpenCount'
      )
    ).toBe(4);
  });
});
