import { MonthlyCount, NamedCount, WeekdayCount } from '../../models/stats.model';
import { HOURS_AXIS_ID } from './chart-theme';
import {
  monthLabel,
  toMonthlyLineData,
  toNamedBarData,
  toNamedDoughnutData,
  toWeekdayBarData,
  weekdayLabel,
} from './stats-chart-data';

const HEBREW_WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

describe('stats chart data', () => {
  describe('labels', () => {
    it('names months in Hebrew (month is 1-based)', () => {
      expect(monthLabel(2026, 1)).toBe(
        new Intl.DateTimeFormat('he-IL', { month: 'short', year: 'numeric' }).format(
          new Date(2026, 0, 1),
        ),
      );
      expect(monthLabel(2026, 1)).toContain('2026');
    });

    it('names weekdays in Hebrew, 0 = Sunday', () => {
      HEBREW_WEEKDAYS.forEach((name, dayOfWeek) => {
        expect(weekdayLabel(dayOfWeek)).toContain(name);
      });
    });
  });

  describe('toMonthlyLineData', () => {
    const byMonth: MonthlyCount[] = [
      { year: 2025, month: 12, count: 2, hours: 1.5 },
      { year: 2026, month: 1, count: 0, hours: 0 },
      { year: 2026, month: 2, count: 3, hours: 0.25 },
    ];

    it('keeps the server order and one label per month', () => {
      const data = toMonthlyLineData(byMonth);
      expect(data.labels).toEqual([monthLabel(2025, 12), monthLabel(2026, 1), monthLabel(2026, 2)]);
    });

    it('has counts on the default axis and hours on the hours axis', () => {
      const [counts, hours] = toMonthlyLineData(byMonth).datasets;
      expect(counts.data).toEqual([2, 0, 3]);
      expect(counts.yAxisID).toBeUndefined();
      expect(hours.data).toEqual([1.5, 0, 0.25]);
      expect(hours.yAxisID).toBe(HOURS_AXIS_ID);
    });

    it('is empty for no months', () => {
      const data = toMonthlyLineData([]);
      expect(data.labels).toEqual([]);
      expect(data.datasets.every((dataset) => dataset.data.length === 0)).toBeTrue();
    });
  });

  const items: NamedCount[] = [
    { code: 11, name: 'שידוכים', count: 5, hours: 2, value: 100 },
    { code: 12, name: 'נותנים כתף', count: 1, hours: 0.5, value: 0 },
  ];

  describe('toNamedDoughnutData', () => {
    it('has one slice per item, sized by count, with one color each', () => {
      const data = toNamedDoughnutData(items);
      expect(data.labels).toEqual(['שידוכים', 'נותנים כתף']);
      expect(data.datasets[0].data).toEqual([5, 1]);
      expect((data.datasets[0].backgroundColor as string[]).length).toBe(2);
    });
  });

  describe('toNamedBarData', () => {
    it('has one bar per item, sized by count', () => {
      const data = toNamedBarData(items);
      expect(data.labels).toEqual(['שידוכים', 'נותנים כתף']);
      expect(data.datasets[0].data).toEqual([5, 1]);
    });
  });

  describe('toWeekdayBarData', () => {
    it('orders the days from Sunday whatever order they arrive in', () => {
      const byWeekday: WeekdayCount[] = [
        { dayOfWeek: 6, count: 0 },
        { dayOfWeek: 0, count: 4 },
        { dayOfWeek: 3, count: 2 },
      ];
      const data = toWeekdayBarData(byWeekday);
      expect(data.labels).toEqual([weekdayLabel(0), weekdayLabel(3), weekdayLabel(6)]);
      expect(data.datasets[0].data).toEqual([4, 2, 0]);
    });

    it('does not change the input array', () => {
      const byWeekday: WeekdayCount[] = [
        { dayOfWeek: 1, count: 1 },
        { dayOfWeek: 0, count: 2 },
      ];
      toWeekdayBarData(byWeekday);
      expect(byWeekday[0].dayOfWeek).toBe(1);
    });
  });
});
