import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DateRange, presetRange, toIsoDate } from './date-range';
import { DateRangeFilter } from './date-range-filter';

describe('DateRangeFilter', () => {
  let fixture: ComponentFixture<DateRangeFilter>;
  let component: DateRangeFilter;
  let emitted: DateRange[];

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeFilter);
    component = fixture.componentInstance;
    emitted = [];
    component.rangeChange.subscribe((range) => emitted.push(range));
    fixture.detectChanges();
  });

  function errorText(): string | null {
    const error: HTMLElement | null = fixture.nativeElement.querySelector('[role="alert"]');
    return error?.textContent?.trim() ?? null;
  }

  it('starts on "all" with no error', () => {
    expect(component.activePreset()).toBe('all');
    expect(errorText()).toBeNull();
  });

  it('emits the preset range', () => {
    component.selectPreset('year');
    expect(emitted).toEqual([presetRange('year', new Date())]);
    expect(component.activePreset()).toBe('year');
  });

  it('emits "all" as a range with no dates', () => {
    component.selectPreset('month');
    component.selectPreset('all');
    expect(emitted[1]).toEqual({});
  });

  it('shows an error and emits nothing for an invalid range', () => {
    component.setFrom('2020-05-02');
    component.setTo('2020-05-01');
    fixture.detectChanges();

    expect(emitted).toEqual([{ from: '2020-05-02' }]);
    expect(errorText()).toBe('תאריך ההתחלה לא יכול להיות אחרי תאריך הסיום');
  });

  it('says "after today" for an open range that starts in the future', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    component.setFrom(toIsoDate(tomorrow));
    fixture.detectChanges();

    expect(emitted).toEqual([]);
    expect(errorText()).toBe('תאריך ההתחלה לא יכול להיות אחרי היום');
  });

  it('rejects a range longer than ten years', () => {
    component.setTo('2025-12-01');
    component.setFrom('2015-12-31');
    fixture.detectChanges();

    expect(emitted).toEqual([{ to: '2025-12-01' }]);
    expect(errorText()).toContain('10');
  });

  it('emits again once the range is fixed', () => {
    component.setFrom('2020-05-02');
    component.setTo('2020-05-01');
    component.setTo('2020-06-01');

    expect(emitted.at(-1)).toEqual({ from: '2020-05-02', to: '2020-06-01' });
  });
});
