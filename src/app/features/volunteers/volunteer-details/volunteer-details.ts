import { DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal, viewChildren } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { forkJoin } from 'rxjs';
import { StatsApiService } from '../../../core/api/stats-api.service';
import { VolunteerApiService } from '../../../core/api/volunteer-api.service';
import { VolunteeringApiService } from '../../../core/api/volunteering-api.service';
import { VolunteerStats } from '../../../models/stats.model';
import { VolunteerDetails as VolunteerDetailsModel } from '../../../models/volunteer.model';
import { Volunteering } from '../../../models/volunteering.model';
import {
  barChartOptions,
  doughnutChartOptions,
  horizontalBarChartOptions,
  monthlyLineChartOptions,
  provideAppCharts,
} from '../../../shared/charts/chart-theme';
import {
  toMonthlyLineData,
  toNamedBarData,
  toNamedDoughnutData,
  toWeekdayBarData,
} from '../../../shared/charts/stats-chart-data';
import { OrDashPipe } from '../../../shared/pipes/or-dash.pipe';
import { PersonNamePipe } from '../../../shared/pipes/person-name.pipe';
import { DateRange, sameDateRange } from '../../../shared/ui/date-range-filter/date-range';
import { DateRangeFilter } from '../../../shared/ui/date-range-filter/date-range-filter';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { KpiCard } from '../../../shared/ui/kpi-card';
import { LoadState } from '../../../shared/ui/load-state';
import { Loading } from '../../../shared/ui/loading';
import { VolunteerDetailsData } from './volunteer-details-data';

/** The dialog lists the volunteer's most recent volunteerings only (one server page, newest first). */
const RECENT_VOLUNTEERINGS_PAGE_SIZE = 100;

/** The activity section opens on "all dates". */
const ALL_DATES: DateRange = {};

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
    KpiCard,
    DateRangeFilter,
    PersonNamePipe,
    OrDashPipe,
  ],
  providers: [provideAppCharts()],
  styleUrls: ['./volunteer-details.scss'],
})
export class VolunteerDetails implements OnInit {
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly volunteeringApi = inject(VolunteeringApiService);
  private readonly statsApi = inject(StatsApiService);
  private readonly dialogRef = inject(MatDialogRef<VolunteerDetails>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<VolunteerDetailsData>(MAT_DIALOG_DATA);

  readonly loadState = signal<LoadState>('loading');
  readonly volunteer = signal<VolunteerDetailsModel | null>(null);
  readonly volunteerings = signal<Volunteering[]>([]);

  readonly initialRange = ALL_DATES;
  readonly statsRange = signal<DateRange>(ALL_DATES, { equal: sameDateRange });

  /** Set once the open animation has finished (immediately when animations are off). */
  private readonly opened = signal(false);

  /**
   * One request per range; a new range cancels the request still in flight. Nothing is
   * requested before the dialog is open: undefined params keep the resource idle.
   */
  readonly stats = rxResource({
    params: () =>
      this.opened()
        ? { volunteerCode: this.data.volunteerCode, range: this.statsRange() }
        : undefined,
    stream: ({ params }) => this.statsApi.volunteer(params.volunteerCode, params.range),
  });

  /** The idle wait for the dialog to open shows as loading, not as "no activity". */
  readonly statsPending = computed(() => !this.opened() || this.stats.isLoading());

  /** The loaded stats, or null while loading or after an error (reading value() then throws). */
  readonly loadedStats = computed<VolunteerStats | null>(() =>
    this.stats.hasValue() ? this.stats.value() : null,
  );
  readonly hasActivity = computed(() => {
    const stats = this.loadedStats();
    return stats !== null && (stats.totalVolunteerings > 0 || stats.totalAsMatcher > 0);
  });

  readonly monthsChart = computed(() => toMonthlyLineData(this.loadedStats()?.byMonth ?? []));
  readonly projectsChart = computed(() => toNamedDoughnutData(this.loadedStats()?.byProject ?? []));
  readonly subProjectsChart = computed(() => toNamedBarData(this.loadedStats()?.bySubProject ?? []));
  readonly weekdaysChart = computed(() => toWeekdayBarData(this.loadedStats()?.byWeekday ?? []));

  readonly lineOptions = monthlyLineChartOptions();
  readonly doughnutOptions = doughnutChartOptions();
  readonly horizontalBarOptions = horizontalBarChartOptions();
  readonly barOptions = barChartOptions();

  private readonly charts = viewChildren(BaseChartDirective);

  constructor() {
    // The stats start loading only now. Chart.js measures its container when it draws, and a
    // chart drawn during the open animation measured a scaled-down dialog, so any chart that
    // already exists is measured again.
    // Subscribed in the constructor: without animations the dialog finishes opening in a
    // microtask right after it is created, before ngOnInit runs.
    this.dialogRef
      .afterOpened()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.opened.set(true);
        this.charts().forEach((chart) => chart.chart?.resize());
      });
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
          this.volunteer.set(volunteer);
          this.volunteerings.set(volunteerings.items);
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
