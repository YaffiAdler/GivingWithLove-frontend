/**
 * A date range as yyyy-MM-dd strings, both ends inclusive. A missing end is an open side;
 * an empty object means "all dates".
 */
export interface DateRange {
  from?: string;
  to?: string;
}

/**
 * Longest closed range the statistics API accepts (server: StatsMapper.MaxRangeYears).
 * The server counts the calendar months from `from` to `to` inclusive, so the client does too.
 */
export const MAX_RANGE_YEARS = 10;
const MAX_RANGE_MONTHS = MAX_RANGE_YEARS * 12;

export type DateRangeError =
  | 'invalidDate'
  | 'toAfterToday'
  | 'fromAfterToday'
  | 'fromAfterTo'
  | 'tooLong';

export const DATE_RANGE_ERROR_MESSAGES: Readonly<Record<DateRangeError, string>> = {
  invalidDate: 'התאריך אינו תקין',
  toAfterToday: 'תאריך הסיום לא יכול להיות אחרי היום',
  fromAfterToday: 'תאריך ההתחלה לא יכול להיות אחרי היום',
  fromAfterTo: 'תאריך ההתחלה לא יכול להיות אחרי תאריך הסיום',
  tooLong: `הטווח ארוך מדי — אפשר לבחור עד ${MAX_RANGE_YEARS} שנים`,
};

export type DateRangePreset = 'month' | 'threeMonths' | 'year' | 'all';

export const DATE_RANGE_PRESETS: readonly { preset: DateRangePreset; label: string }[] = [
  { preset: 'month', label: 'החודש' },
  { preset: 'threeMonths', label: '3 חודשים אחרונים' },
  { preset: 'year', label: 'השנה' },
  { preset: 'all', label: 'הכל' },
];

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Returns the first rule the range breaks, or null when it may be sent to the server.
 * `today` is yyyy-MM-dd. A `from` later than today is reported as such even when `to` is set,
 * so an open range never shows a message about an end date the user did not pick.
 */
export function validateDateRange(range: DateRange, today: string): DateRangeError | null {
  const { from, to } = range;
  if ((from && !isValidIsoDate(from)) || (to && !isValidIsoDate(to))) {
    return 'invalidDate';
  }
  if (to && to > today) {
    return 'toAfterToday';
  }
  if (from && from > today) {
    return 'fromAfterToday';
  }
  if (from && to && from > to) {
    return 'fromAfterTo';
  }
  if (from && to && countMonths(from, to) > MAX_RANGE_MONTHS) {
    return 'tooLong';
  }
  return null;
}

/** The range of a quick preset, ending today. "all" has no dates at all. */
export function presetRange(preset: DateRangePreset, today: Date): DateRange {
  const year = today.getFullYear();
  const month = today.getMonth();
  const to = toIsoDate(today);
  switch (preset) {
    case 'month':
      return { from: toIsoDate(new Date(year, month, 1)), to };
    case 'threeMonths':
      // The current month and the two before it, so the month chart shows three whole months.
      return { from: toIsoDate(new Date(year, month - 2, 1)), to };
    case 'year':
      return { from: toIsoDate(new Date(year, 0, 1)), to };
    case 'all':
      return {};
  }
}

/** Drops empty ends, so "" and undefined both mean an open side. */
export function normalizeDateRange(range: DateRange): DateRange {
  return {
    ...(range.from ? { from: range.from } : {}),
    ...(range.to ? { to: range.to } : {}),
  };
}

export function sameDateRange(a: DateRange, b: DateRange): boolean {
  return (a.from || '') === (b.from || '') && (a.to || '') === (b.to || '');
}

/** The local calendar date as yyyy-MM-dd (not toISOString, which shifts to UTC). */
export function toIsoDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function isValidIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) {
    return false;
  }
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function countMonths(from: string, to: string): number {
  return monthIndex(to) - monthIndex(from) + 1;
}

function monthIndex(isoDate: string): number {
  const [year, month] = isoDate.split('-').map(Number);
  return year * 12 + month - 1;
}
