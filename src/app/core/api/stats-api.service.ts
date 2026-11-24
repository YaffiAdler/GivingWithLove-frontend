import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  OverviewStats,
  ProjectStats,
  StatsFilter,
  VolunteerRankingPage,
  VolunteerRankingQuery,
  VolunteerStats,
} from '../../models/stats.model';
import { apiUrl } from '../api-url';
import { toHttpParams } from './http-params';

const RESOURCE = 'stats';

@Injectable({ providedIn: 'root' })
export class StatsApiService {
  private readonly http = inject(HttpClient);

  overview(filter: StatsFilter = {}): Observable<OverviewStats> {
    return this.http.get<OverviewStats>(apiUrl(RESOURCE, 'overview'), {
      params: toFilterParams(filter),
    });
  }

  volunteers(query: VolunteerRankingQuery): Observable<VolunteerRankingPage> {
    return this.http.get<VolunteerRankingPage>(apiUrl(RESOURCE, 'volunteers'), {
      params: toHttpParams(query),
    });
  }

  volunteer(id: number, filter: StatsFilter = {}): Observable<VolunteerStats> {
    return this.http.get<VolunteerStats>(apiUrl(RESOURCE, `volunteers/${id}`), {
      params: toFilterParams(filter),
    });
  }

  project(id: number, filter: StatsFilter = {}): Observable<ProjectStats> {
    return this.http.get<ProjectStats>(apiUrl(RESOURCE, `projects/${id}`), {
      params: toFilterParams(filter),
    });
  }
}

/** Sends only the range fields, so a caller's wider object never leaks extra query parameters. */
function toFilterParams(filter: StatsFilter) {
  return toHttpParams({ from: filter.from, to: filter.to });
}
