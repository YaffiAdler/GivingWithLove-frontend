import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateVolunteerDomain,
  UpdateVolunteerDomain,
  VolunteerDomain,
} from '../../models/volunteer-domain.model';
import { apiUrl } from '../api-url';

const RESOURCE = 'VolunteerDomain';

@Injectable({ providedIn: 'root' })
export class VolunteerDomainApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<VolunteerDomain[]> {
    return this.http.get<VolunteerDomain[]>(apiUrl(RESOURCE));
  }

  getById(id: number): Observable<VolunteerDomain> {
    return this.http.get<VolunteerDomain>(apiUrl(RESOURCE, id));
  }

  create(volunteerDomain: CreateVolunteerDomain): Observable<VolunteerDomain> {
    return this.http.post<VolunteerDomain>(apiUrl(RESOURCE), volunteerDomain);
  }

  update(volunteerDomain: UpdateVolunteerDomain): Observable<void> {
    return this.http.put<void>(
      apiUrl(RESOURCE, volunteerDomain.volunteerDomainsCode),
      volunteerDomain,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
