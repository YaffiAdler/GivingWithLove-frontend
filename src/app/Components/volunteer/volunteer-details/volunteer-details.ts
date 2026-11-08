import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChartData, ChartOptions } from 'chart.js';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { VolunteerApiService } from '../../../core/api/volunteer-api.service';
import { VolunteeringApiService } from '../../../core/api/volunteering-api.service';
import { VolunteerDetails as VolunteerDetailsModel } from '../../../models/volunteer.model';
import { Volunteering } from '../../../models/volunteering.model';
import { VolunteerDetailsData } from './volunteer-details-data';

/** The dialog shows the volunteer's most recent volunteerings only (one server page, newest first). */
const RECENT_VOLUNTEERINGS_PAGE_SIZE = 100;

@Component({
  selector: 'app-volunteer-details',
  templateUrl: './volunteer-details.html',
  standalone: true,
  imports: [CommonModule, ChartModule, MatIconModule],
  styleUrls: ['./volunteer-details.scss']
})
export class VolunteerDetails implements OnInit {
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly volunteeringApi = inject(VolunteeringApiService);
  private readonly dialogRef = inject(MatDialogRef<VolunteerDetails>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly data = inject<VolunteerDetailsData>(MAT_DIALOG_DATA);

  readonly volunteer = signal<VolunteerDetailsModel | null>(null);
  readonly volunteerings = signal<Volunteering[]>([]);
  readonly loadFailed = signal(false);

  pieChartDataForPrime: ChartData<'pie'> = { labels: [], datasets: [] };
  pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  barChartDataForPrime: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptionsForPrime: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  ngOnInit() {
    const volunteerCode = this.data.volunteerCode;

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
          this.processPieChart(volunteer);
          this.processBarChart(oldestFirst);
        },
        // The error interceptor already showed the message; stop showing "loading".
        error: () => this.loadFailed.set(true),
      });
  }

  close() {
    this.dialogRef.close();
  }

  /** A contact field as shown in the dialog; missing values show a dash. */
  display(value: string | number | null | undefined): string {
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }

  private processPieChart(volunteer: VolunteerDetailsModel) {
    const domainMap: { [key: string]: number } = {};

    volunteer.projectCodes.forEach(projectCode => {
      const name = projectCode || 'לא מוגדר';
      domainMap[name] = (domainMap[name] || 0) + 1;
    });

    this.pieChartDataForPrime = {
      labels: Object.keys(domainMap),
      datasets: [
        {
          data: Object.values(domainMap),
          backgroundColor: [
            '#00e5ff',
            '#00bcd4',
            '#26c6da',
            '#4dd0e1',
            '#80deea',
            '#0097a7',
            '#4fc3f7'
          ],
          borderColor: '#071a22',
          borderWidth: 2,
          hoverOffset: 12
        }
      ]
    };
  }

  private processBarChart(volunteerings: Volunteering[]) {
    const monthMap: { [key: string]: number } = {};

    volunteerings.forEach(v => {
      const month = new Date(v.dateOfVolunteering)
        .toLocaleString('default', { month: 'short', year: 'numeric' });

      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    this.barChartDataForPrime = {
      labels: Object.keys(monthMap),
      datasets: [
        {
          label: 'התנדבויות לפי חודשים',
          data: Object.values(monthMap),
          backgroundColor: '#42A5F5'
        }
      ]
    };
  }
}

function toTime(date: string): number {
  return new Date(date).getTime();
}
