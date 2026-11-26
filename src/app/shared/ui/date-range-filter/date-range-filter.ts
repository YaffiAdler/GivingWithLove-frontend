import { Component, computed, input, linkedSignal, output } from '@angular/core';
import {
  DATE_RANGE_ERROR_MESSAGES,
  DATE_RANGE_PRESETS,
  DateRange,
  DateRangePreset,
  normalizeDateRange,
  presetRange,
  sameDateRange,
  toIsoDate,
  validateDateRange,
} from './date-range';

/**
 * From / to date inputs with quick presets. It keeps no state outside itself (no URL), so it can
 * be used in dialogs: `range` is the initial range, `rangeChange` emits each new valid range.
 * An invalid range is shown as an error next to the inputs and never emitted.
 */
@Component({
  selector: 'app-date-range-filter',
  templateUrl: './date-range-filter.html',
  styleUrl: './date-range-filter.scss',
})
export class DateRangeFilter {
  readonly range = input<DateRange>({});
  readonly rangeChange = output<DateRange>();

  readonly presets = DATE_RANGE_PRESETS;
  private readonly todayDate = new Date();
  readonly today = toIsoDate(this.todayDate);

  readonly from = linkedSignal(() => this.range().from ?? '');
  readonly to = linkedSignal(() => this.range().to ?? '');

  private readonly current = computed<DateRange>(() => ({ from: this.from(), to: this.to() }));
  private readonly error = computed(() => validateDateRange(this.current(), this.today));
  readonly errorMessage = computed(() => {
    const error = this.error();
    return error ? DATE_RANGE_ERROR_MESSAGES[error] : null;
  });
  readonly activePreset = computed<DateRangePreset | null>(() => {
    const current = this.current();
    const match = this.presets.find(({ preset }) =>
      sameDateRange(presetRange(preset, this.todayDate), current),
    );
    return match?.preset ?? null;
  });

  selectPreset(preset: DateRangePreset) {
    const range = presetRange(preset, this.todayDate);
    this.from.set(range.from ?? '');
    this.to.set(range.to ?? '');
    this.emitIfValid();
  }

  setFrom(value: string) {
    this.from.set(value);
    this.emitIfValid();
  }

  setTo(value: string) {
    this.to.set(value);
    this.emitIfValid();
  }

  private emitIfValid() {
    if (!this.error()) {
      this.rangeChange.emit(normalizeDateRange(this.current()));
    }
  }
}
