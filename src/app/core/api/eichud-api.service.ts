import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateEichud,
  Eichud,
  EichudPage,
  EichudQuery,
  UpdateEichud,
} from '../../models/eichud.model';
import { apiUrl } from '../api-url';
import { silentErrorStatuses } from '../http/silent-error-statuses';
import { toHttpParams } from './http-params';
import { notFoundAsNull } from './not-found-as-null';

const RESOURCE = 'Eichud';

@Injectable({ providedIn: 'root' })
export class EichudApiService {
  private readonly http = inject(HttpClient);

  getAll(query: EichudQuery): Observable<EichudPage> {
    return this.http.get<EichudPage>(apiUrl(RESOURCE), { params: toHttpParams(query) });
  }

  getById(id: number): Observable<Eichud> {
    return this.http.get<Eichud>(apiUrl(RESOURCE, id));
  }

  /** Looks up one person; emits `null` on 404, without an error notification. */
  findById(id: number): Observable<Eichud | null> {
    return notFoundAsNull(
      this.http.get<Eichud>(apiUrl(RESOURCE, id), {
        context: silentErrorStatuses(HttpStatusCode.NotFound),
      }),
    );
  }

  create(person: CreateEichud): Observable<Eichud> {
    return this.http.post<Eichud>(apiUrl(RESOURCE), person);
  }

  update(person: UpdateEichud): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, person.eichudCode), person);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
