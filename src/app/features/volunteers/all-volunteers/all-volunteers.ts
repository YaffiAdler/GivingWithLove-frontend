import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { Router, RouterModule } from '@angular/router';
import { VolunteerApiService } from '../../../core/api/volunteer-api.service';
import { Volunteer, VolunteerSort } from '../../../models/volunteer.model';
import { createServerPagedList } from '../../../shared/paging/server-paged-list';
import { toListSort } from '../../../shared/paging/list-sort';
import { OrDashPipe } from '../../../shared/pipes/or-dash.pipe';
import { PersonNamePipe } from '../../../shared/pipes/person-name.pipe';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { Loading } from '../../../shared/ui/loading';
import { VolunteerDetails } from '../volunteer-details/volunteer-details';
import { VolunteerDetailsData } from '../volunteer-details/volunteer-details-data';

/** The columns the server can sort the volunteer list by. */
const VOLUNTEER_SORT_COLUMNS: readonly VolunteerSort[] = ['name', 'code'];

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    Loading,
    ErrorState,
    EmptyState,
    PersonNamePipe,
    OrDashPipe,
  ],
  templateUrl: './all-volunteers.html',
  styleUrl: './all-volunteers.scss'
})
export class AllVolunteers {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly volunteerApi = inject(VolunteerApiService);

  readonly volunteers = createServerPagedList<Volunteer, VolunteerSort>({
    initialSort: { active: 'name', direction: 'asc' },
    load: (query) => this.volunteerApi.getAll(query),
  });

  isD = false;

  changeSort(sort: Sort) {
    this.volunteers.changeSort(toListSort(sort, VOLUNTEER_SORT_COLUMNS));
  }

  goToVolunteering(volunteer: Volunteer) {
    this.router.navigate(['/v'], { queryParams: { volunteerCode: volunteer.volunteerCode } });
  }

  goToEditVolunteer(volunteer: Volunteer) {
    this.router.navigate(['/volunteer/addvolunteer/edit', volunteer.volunteerCode]);
  }

  goToVolunteerDetails(volunteer: Volunteer) {
    this.isD = true;
    const data: VolunteerDetailsData = { volunteerCode: volunteer.volunteerCode };
    this.dialog.open(VolunteerDetails, { width: '800px', height: '600px', data });
  }
}
