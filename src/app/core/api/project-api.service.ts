import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateProject, Project, UpdateProject } from '../../models/project.model';
import { DepartmentNode } from '../../models/project-tree.model';
import { apiUrl } from '../api-url';

const RESOURCE = 'Project';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(apiUrl(RESOURCE));
  }

  /** Departments → projects → sub-projects, built by the server in one query. */
  getTree(): Observable<DepartmentNode[]> {
    return this.http.get<DepartmentNode[]>(apiUrl(RESOURCE, 'tree'));
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(apiUrl(RESOURCE, id));
  }

  create(project: CreateProject): Observable<Project> {
    return this.http.post<Project>(apiUrl(RESOURCE), project);
  }

  update(project: UpdateProject): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, project.projectCode), project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
