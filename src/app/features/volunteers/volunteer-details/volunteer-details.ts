import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal, viewChildren } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { VolunteerApiService } from '../../../core/api/volunteer-api.service';
import { VolunteeringApiService } from '../../../core/api/volunteering-api.service';
import { VolunteerDetails as VolunteerDetailsModel } from '../../../models/volunteer.model';
import { Volunteering } from '../../../models/volunteering.model';
import {
  barChartOptions,
  CHART_PALETTE,
  paletteColors,
  PIE_SLICE_BORDER,
  pieChartOptions,
  provideAppCharts,
} from '../../../shared/charts/chart-theme';
import { ErrorState } from '../../../shared/ui/error-state';
import { LoadState } from '../../../shared/ui/load-state';
import { OrDashPipe } from '../../../shared/pipes/or-dash.pipe';
import { PersonNamePipe } from '../../../shared/pipes/person-name.pipe';
import { EmptyState } from '../../../shared/ui/empty-state';
import { Loading } from '../../../shared/ui/loading';
import { VolunteerDetailsData } from './volunteer-details-data';

/** The dialog shows the volunteer's most recent volunteerings only (one server page, newest first). */
const RECENT_VOLUNTEERINGS_PAGE_SIZE = 100;

const UNNAMED_PROJECT = 'ללא פרויקט';

@Component({
  selector: 'app-volunteer-details',
  templateUrl: './volunteer-details.html',
  standalone: true,
  imports: [
    DatePipe,
    BaseChartDirective,
    MatIconModule,
    Loading,
    ErrorState,
    EmptyState,
    PersonNamePipe,
    OrDashPipe,
  ],
  providers: [provideAppCharts()],
  styleUrls: ['./volunteer-details.scss']
})
export class VolunteerDetails implements OnInit {
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly volunteeringApi = inject(VolunteeringApiService);
  private readonly dialogRef = inject(MatDialogRef<VolunteerDetails>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<VolunteerDetailsData>(MAT_DIALOG_DATA);

  readonly recentCount = RECENT_VOLUNTEERINGS_PAGE_SIZE;
  readonly loadState = signal<LoadState>('loading');
  readonly volunteer = signal<VolunteerDetailsModel | null>(null);
  readonly volunteerings = signal<Volunteering[]>([]);
  readonly projectsChart = signal<ChartData<'pie'>>({ labels: [], datasets: [] });
  readonly monthsChart = signal<ChartData<'bar'>>({ labels: [], datasets: [] });

  readonly pieOptions = pieChartOptions();
  readonly barOptions = barChartOptions();

  private readonly charts = viewChildren(BaseChartDirective);

  constructor() {
    // Chart.js measures its container when it draws. A chart drawn during the open animation
    // measured a scaled-down dialog, so it is measured again once the dialog is open.
    // Subscribed in the constructor: without animations the dialog finishes opening in a
    // microtask right after it is created, before ngOnInit runs.
    this.dialogRef
      .afterOpened()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.charts().forEach((chart) => chart.chart?.resize()));
  }

  ngOnInit() {
    this.load();
  }

  load() {
    const volunteerCode = this.data.volunteerCode;
    this.loadState.set('loading');

    forkJoin({
      volunteer: this.volunteerApi.getById(volunteerCode),
      volunteerings: this.volunteeringApi.getAll({
        page: 1,
        pageSize: RECENT_VOLUNTEERINGS_PAGE_SIZE,
        sort: 'date',
        volunteerCode,
      }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ volunteer, volunteerings }) => {
          const oldestFirst = [...volunteerings.items].sort(
            (a, b) => toTime(a.dateOfVolunteering) - toTime(b.dateOfVolunteering),
          );
          this.volunteer.set(volunteer);
          this.volunteerings.set(oldestFirst);
          this.projectsChart.set(countByProject(oldestFirst));
          this.monthsChart.set(countByMonth(oldestFirst));
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the dialog shows its error state.
        error: () => this.loadState.set('error'),
      });
  }

  close() {
    this.dialogRef.close();
  }
}

/** Slices of the recent volunteerings per project name. */
function countByProject(volunteerings: Volunteering[]): ChartData<'pie'> {
  const counts = countBy(volunteerings, (v) => v.projectName?.trim() || UNNAMED_PROJECT);
  return {
    labels: [...counts.keys()],
    datasets: [
      {
        data: [...counts.values()],
        backgroundColor: paletteColors(counts.size),
        ...PIE_SLICE_BORDER,
      },
    ],
  };
}

/** Bars of the recent volunteerings per month, oldest month first (the input is sorted). */
function countByMonth(volunteerings: Volunteering[]): ChartData<'bar'> {
  const counts = countBy(volunteerings, (v) =>
    new Date(v.dateOfVolunteering).toLocaleString('default', { month: 'short', year: 'numeric' }),
  );
  return {
    labels: [...counts.keys()],
    datasets: [
      {
        label: 'התנדבויות לפי חודשים',
        data: [...counts.values()],
        backgroundColor: CHART_PALETTE[1],
      },
    ],
  };
}

function countBy<T>(items: T[], keyOf: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function toTime(date: string): number {
  return new Date(date).getTime();
}
