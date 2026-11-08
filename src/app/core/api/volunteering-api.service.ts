import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateVolunteering,
  UpdateVolunteering,
  Volunteering,
  VolunteeringPage,
  VolunteeringQuery,
} from '../../models/volunteering.model';
import { apiUrl } from '../api-url';
import { toHttpParams } from './http-params';

const RESOURCE = 'Volunteering';

@Injectable({ providedIn: 'root' })
export class VolunteeringApiService {
  private readonly http = inject(HttpClient);

  /** One page of volunteerings, optionally filtered by volunteer, project and dates. */
  getAll(query: VolunteeringQuery): Observable<VolunteeringPage> {
    return this.http.get<VolunteeringPage>(apiUrl(RESOURCE), { params: toHttpParams(query) });
  }

  getById(id: number): Observable<Volunteering> {
    return this.http.get<Volunteering>(apiUrl(RESOURCE, id));
  }

  create(volunteering: CreateVolunteering): Observable<Volunteering> {
    return this.http.post<Volunteering>(apiUrl(RESOURCE), volunteering);
  }

  update(volunteering: UpdateVolunteering): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, volunteering.volunteeringCode), volunteering);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
