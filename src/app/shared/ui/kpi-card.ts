import { Component, computed, input } from '@angular/core';

/** `integer` for counts; `decimal` for hours and money, which the server rounds to 2 places. */
export type KpiFormat = 'integer' | 'decimal';

const FORMATTERS: Readonly<Record<KpiFormat, Intl.NumberFormat>> = {
  integer: new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 }),
  decimal: new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }),
};

/** One headline number with its label. The value is shown as given; only its format changes. */
@Component({
  selector: 'app-kpi-card',
  template: `
    <div class="kpi-card">
      <span class="kpi-value">
        {{ formattedValue() }}
        @if (unit()) {
          <span class="kpi-unit">{{ unit() }}</span>
        }
      </span>
      <span class="kpi-label">{{ label() }}</span>
    </div>
  `,
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly unit = input('');
  readonly format = input<KpiFormat>('integer');

  readonly formattedValue = computed(() => FORMATTERS[this.format()].format(this.value()));
}
