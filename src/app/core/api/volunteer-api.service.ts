import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateVolunteer,
  UpdateVolunteer,
  UpdateVolunteerDomains,
  Volunteer,
  VolunteerDetails,
  VolunteerPage,
  VolunteerQuery,
} from '../../models/volunteer.model';
import { apiUrl } from '../api-url';
import { silentErrorStatuses } from '../http/silent-error-statuses';
import { toHttpParams } from './http-params';
import { notFoundAsNull } from './not-found-as-null';

const RESOURCE = 'Volunteer';

@Injectable({ providedIn: 'root' })
export class VolunteerApiService {
  private readonly http = inject(HttpClient);

  getAll(query: VolunteerQuery): Observable<VolunteerPage> {
    return this.http.get<VolunteerPage>(apiUrl(RESOURCE), { params: toHttpParams(query) });
  }

  getById(id: number): Observable<VolunteerDetails> {
    return this.http.get<VolunteerDetails>(apiUrl(RESOURCE, id));
  }

  /** Looks up one volunteer; emits `null` on 404, without an error notification. */
  findById(id: number): Observable<VolunteerDetails | null> {
    return notFoundAsNull(
      this.http.get<VolunteerDetails>(apiUrl(RESOURCE, id), {
        context: silentErrorStatuses(HttpStatusCode.NotFound),
      }),
    );
  }

  create(volunteer: CreateVolunteer): Observable<Volunteer> {
    return this.http.post<Volunteer>(apiUrl(RESOURCE), volunteer);
  }

  update(volunteer: UpdateVolunteer): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, volunteer.volunteerCode), volunteer);
  }

  /** Replaces the volunteer's project domains with the given list. */
  updateDomains(domains: UpdateVolunteerDomains): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, 'domains'), domains);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
