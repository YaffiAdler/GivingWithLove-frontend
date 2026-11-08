import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateSubProject, SubProject, UpdateSubProject } from '../../models/sub-project.model';
import { apiUrl } from '../api-url';

const RESOURCE = 'SubProject';

@Injectable({ providedIn: 'root' })
export class SubProjectApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<SubProject[]> {
    return this.http.get<SubProject[]>(apiUrl(RESOURCE));
  }

  getById(id: number): Observable<SubProject> {
    return this.http.get<SubProject>(apiUrl(RESOURCE, id));
  }

  create(subProject: CreateSubProject): Observable<SubProject> {
    return this.http.post<SubProject>(apiUrl(RESOURCE), subProject);
  }

  update(subProject: UpdateSubProject): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, subProject.subProjectCode), subProject);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
