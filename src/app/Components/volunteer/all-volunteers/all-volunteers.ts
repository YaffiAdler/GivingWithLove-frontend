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
import { FixedDirectionSort } from '../../../shared/paging/fixed-direction-sort';
import { VolunteerDetails } from '../volunteer-details/volunteer-details';
import { VolunteerDetailsData } from '../volunteer-details/volunteer-details-data';

@Component({
  selector: 'app-volunteer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    FixedDirectionSort,
  ],
  templateUrl: './all-volunteers.html',
  styleUrl: './all-volunteers.scss'
})
export class AllVolunteers {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly volunteerApi = inject(VolunteerApiService);

  readonly volunteers = createServerPagedList<Volunteer, VolunteerSort>({
    defaultSort: 'name',
    load: (query) => this.volunteerApi.getAll(query),
  });

  isD = false;

  changeSort(sort: Sort) {
    if (sort.active === 'name' || sort.active === 'code') {
      this.volunteers.changeSort(sort.active);
    }
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
