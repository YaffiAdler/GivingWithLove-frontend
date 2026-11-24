import {
  MAX_RANGE_YEARS,
  normalizeDateRange,
  presetRange,
  sameDateRange,
  toIsoDate,
  validateDateRange,
} from './date-range';

const TODAY = '2026-11-09';

describe('validateDateRange', () => {
  it('accepts "all" (no dates at all)', () => {
    expect(validateDateRange({}, TODAY)).toBeNull();
    expect(validateDateRange({ from: '', to: '' }, TODAY)).toBeNull();
  });

  it('accepts a closed range that ends today', () => {
    expect(validateDateRange({ from: '2026-01-01', to: TODAY }, TODAY)).toBeNull();
  });

  it('accepts open ranges', () => {
    expect(validateDateRange({ from: '2020-05-01' }, TODAY)).toBeNull();
    expect(validateDateRange({ to: '2020-05-01' }, TODAY)).toBeNull();
  });

  it('rejects a "to" later than today', () => {
    expect(validateDateRange({ to: '2026-11-10' }, TODAY)).toBe('toAfterToday');
    expect(validateDateRange({ from: '2026-01-01', to: '2099-12-31' }, TODAY)).toBe(
      'toAfterToday',
    );
  });

  it('rejects a "from" later than "to"', () => {
    expect(validateDateRange({ from: '2026-05-02', to: '2026-05-01' }, TODAY)).toBe('fromAfterTo');
  });

  it('accepts a one-day range', () => {
    expect(validateDateRange({ from: '2026-05-01', to: '2026-05-01' }, TODAY)).toBeNull();
  });

  it('rejects a "from" later than today, with or without "to"', () => {
    expect(validateDateRange({ from: '2026-11-10' }, TODAY)).toBe('fromAfterToday');
    expect(validateDateRange({ from: '2026-11-10', to: '2026-11-01' }, TODAY)).toBe(
      'fromAfterToday',
    );
  });

  it(`accepts a closed range of exactly ${MAX_RANGE_YEARS} years of months`, () => {
    // 120 calendar months, January 2016 to December 2025, as the server counts them.
    expect(validateDateRange({ from: '2016-01-01', to: '2025-12-31' }, TODAY)).toBeNull();
  });

  it(`rejects a closed range longer than ${MAX_RANGE_YEARS} years`, () => {
    // 121 calendar months.
    expect(validateDateRange({ from: '2015-12-31', to: '2025-12-01' }, TODAY)).toBe('tooLong');
    expect(validateDateRange({ from: '1900-01-01', to: TODAY }, TODAY)).toBe('tooLong');
  });

  it('does not limit the length of an open range', () => {
    expect(validateDateRange({ from: '1900-01-01' }, TODAY)).toBeNull();
  });

  it('rejects dates that are not real yyyy-MM-dd dates', () => {
    expect(validateDateRange({ from: '2026-02-30' }, TODAY)).toBe('invalidDate');
    expect(validateDateRange({ to: '09/11/2026' }, TODAY)).toBe('invalidDate');
  });
});

describe('presetRange', () => {
  const today = new Date(2026, 10, 9);

  it('"month" starts on the first of the current month and ends today', () => {
    expect(presetRange('month', today)).toEqual({ from: '2026-11-01', to: TODAY });
  });

  it('"threeMonths" covers the current month and the two before it', () => {
    expect(presetRange('threeMonths', today)).toEqual({ from: '2026-09-01', to: TODAY });
  });

  it('"threeMonths" crosses the year boundary', () => {
    expect(presetRange('threeMonths', new Date(2026, 0, 15))).toEqual({
      from: '2025-11-01',
      to: '2026-01-15',
    });
  });

  it('"year" starts on 1 January', () => {
    expect(presetRange('year', today)).toEqual({ from: '2026-01-01', to: TODAY });
  });

  it('"all" has no dates', () => {
    expect(presetRange('all', today)).toEqual({});
  });

  it('every preset passes validation', () => {
    for (const preset of ['month', 'threeMonths', 'year', 'all'] as const) {
      expect(validateDateRange(presetRange(preset, today), TODAY)).toBeNull();
    }
  });
});

describe('date range helpers', () => {
  it('toIsoDate uses the local calendar date', () => {
    expect(toIsoDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('normalizeDateRange drops empty ends', () => {
    expect(normalizeDateRange({ from: '', to: '2026-01-01' })).toEqual({ to: '2026-01-01' });
    expect(normalizeDateRange({ from: '', to: '' })).toEqual({});
  });

  it('sameDateRange treats empty and missing ends as equal', () => {
    expect(sameDateRange({}, { from: '', to: '' })).toBeTrue();
    expect(sameDateRange({ from: '2026-01-01' }, { from: '2026-01-02' })).toBeFalse();
  });
});
