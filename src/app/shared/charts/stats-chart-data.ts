import { ChartData } from 'chart.js';
import { MonthlyCount, NamedCount, WeekdayCount } from '../../models/stats.model';
import {
  CHART_PALETTE,
  COUNT_SERIES_LABEL,
  HOURS_AXIS_ID,
  HOURS_SERIES_LABEL,
  paletteColors,
  PIE_SLICE_BORDER,
} from './chart-theme';

const MONTH_FORMAT = new Intl.DateTimeFormat('he-IL', { month: 'short', year: 'numeric' });
const WEEKDAY_FORMAT = new Intl.DateTimeFormat('he-IL', { weekday: 'long' });

/** 1 January 2023 was a Sunday, so day N of that week has the server's dayOfWeek N (0 = Sunday). */
const REFERENCE_SUNDAY = new Date(2023, 0, 1);

/** Hebrew "month year" label of a server month (month is 1-based). */
export function monthLabel(year: number, month: number): string {
  return MONTH_FORMAT.format(new Date(year, month - 1, 1));
}

/** Hebrew weekday name; 0 is Sunday, as the server sends it. */
export function weekdayLabel(dayOfWeek: number): string {
  const date = new Date(REFERENCE_SUNDAY);
  date.setDate(REFERENCE_SUNDAY.getDate() + dayOfWeek);
  return WEEKDAY_FORMAT.format(date);
}

/**
 * Counts and hours per month, in the server's order: oldest first, months without data included.
 */
export function toMonthlyLineData(byMonth: readonly MonthlyCount[]): ChartData<'line'> {
  return {
    labels: byMonth.map((row) => monthLabel(row.year, row.month)),
    datasets: [
      {
        label: COUNT_SERIES_LABEL,
        data: byMonth.map((row) => row.count),
        borderColor: CHART_PALETTE[0],
        backgroundColor: CHART_PALETTE[0],
        cubicInterpolationMode: 'monotone',
      },
      {
        label: HOURS_SERIES_LABEL,
        data: byMonth.map((row) => row.hours),
        yAxisID: HOURS_AXIS_ID,
        borderColor: CHART_PALETTE[6],
        backgroundColor: CHART_PALETTE[6],
        borderDash: [6, 4],
        cubicInterpolationMode: 'monotone',
      },
    ],
  };
}

/** One slice per named item (project), sized by its count. */
export function toNamedDoughnutData(items: readonly NamedCount[]): ChartData<'doughnut'> {
  return {
    labels: items.map((item) => item.name),
    datasets: [
      {
        data: items.map((item) => item.count),
        backgroundColor: paletteColors(items.length),
        ...PIE_SLICE_BORDER,
      },
    ],
  };
}

/** One bar per named item (sub-project), sized by its count. */
export function toNamedBarData(items: readonly NamedCount[]): ChartData<'bar'> {
  return {
    labels: items.map((item) => item.name),
    datasets: [
      {
        label: COUNT_SERIES_LABEL,
        data: items.map((item) => item.count),
        backgroundColor: CHART_PALETTE[1],
      },
    ],
  };
}

/** One bar per weekday, Sunday first, whatever order the rows arrive in. */
export function toWeekdayBarData(byWeekday: readonly WeekdayCount[]): ChartData<'bar'> {
  const sorted = [...byWeekday].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
  return {
    labels: sorted.map((row) => weekdayLabel(row.dayOfWeek)),
    datasets: [
      {
        label: COUNT_SERIES_LABEL,
        data: sorted.map((row) => row.count),
        backgroundColor: CHART_PALETTE[1],
      },
    ],
  };
}
