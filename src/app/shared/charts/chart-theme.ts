import { Provider } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

/** The one palette for every chart; datasets with more values than colors repeat it. */
export const CHART_PALETTE: readonly string[] = [
  '#00e5ff',
  '#00bcd4',
  '#26c6da',
  '#4dd0e1',
  '#80deea',
  '#0097a7',
  '#4fc3f7',
];

/** Same font stack as the global styles, so Hebrew labels look like the rest of the app. */
export const CHART_FONT_FAMILY = 'Arial, sans-serif';

/** Charts are drawn on the dark dialog and card backgrounds, so text and grid lines are light. */
const CHART_TEXT_COLOR = '#e0f7fa';
const CHART_GRID_COLOR = 'rgba(0, 229, 255, 0.15)';
/** Separates pie slices against the dark background. */
const CHART_BORDER_COLOR = '#071a22';

/**
 * Registers Chart.js for `BaseChartDirective`. Provide it in the component that shows charts,
 * not in app.config, so Chart.js stays in the lazy chunks instead of the initial bundle.
 */
export function provideAppCharts(): Provider {
  return provideCharts(withDefaultRegisterables(), {
    defaults: { font: { family: CHART_FONT_FAMILY }, color: CHART_TEXT_COLOR },
  });
}

/** One color per value, taken from the palette in order. */
export function paletteColors(count: number): string[] {
  return Array.from({ length: count }, (_, index) => CHART_PALETTE[index % CHART_PALETTE.length]);
}

export const PIE_SLICE_BORDER = { borderColor: CHART_BORDER_COLOR, borderWidth: 2, hoverOffset: 12 };

const RTL_PLUGINS = {
  legend: {
    position: 'top',
    rtl: true,
    textDirection: 'rtl',
    labels: { color: CHART_TEXT_COLOR },
  },
  tooltip: { rtl: true, textDirection: 'rtl' },
} as const;

/** Responsive pie chart with a right-to-left legend. The container sets the height. */
export function pieChartOptions(): ChartOptions<'pie'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: RTL_PLUGINS,
  };
}

/** Responsive bar chart with a right-to-left legend and whole-number counts on the value axis. */
export function barChartOptions(): ChartOptions<'bar'> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: RTL_PLUGINS,
    scales: {
      x: { ticks: { color: CHART_TEXT_COLOR }, grid: { color: CHART_GRID_COLOR } },
      y: {
        beginAtZero: true,
        ticks: { color: CHART_TEXT_COLOR, precision: 0 },
        grid: { color: CHART_GRID_COLOR },
      },
    },
  };
}
