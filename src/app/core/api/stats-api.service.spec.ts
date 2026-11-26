import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { StatsApiService } from './stats-api.service';

const STATS_URL = `${environment.apiUrl}/api/stats`;

describe('StatsApiService', () => {
  let service: StatsApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StatsApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets the overview with the date range', () => {
    service.overview({ from: '2026-01-01', to: '2026-03-31' }).subscribe();

    const request = http.expectOne((req) => req.url === `${STATS_URL}/overview`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('from')).toBe('2026-01-01');
    expect(request.request.params.get('to')).toBe('2026-03-31');
    request.flush({});
  });

  it('gets one volunteer by id and omits empty range values', () => {
    service.volunteer(33, { from: '', to: undefined }).subscribe();

    const request = http.expectOne((req) => req.url === `${STATS_URL}/volunteers/33`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush({});
  });

  it('sends only the end of the range that is set', () => {
    service.volunteer(5, { to: '2026-11-09' }).subscribe();

    const request = http.expectOne((req) => req.url === `${STATS_URL}/volunteers/5`);
    expect(request.request.params.keys()).toEqual(['to']);
    expect(request.request.params.get('to')).toBe('2026-11-09');
    request.flush({});
  });

  it('sends no range when none is given', () => {
    service.project(11).subscribe();

    const request = http.expectOne((req) => req.url === `${STATS_URL}/projects/11`);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.keys()).toEqual([]);
    request.flush({});
  });

  it('gets the volunteer ranking with paging, sort and range', () => {
    service
      .volunteers({ page: 2, pageSize: 25, sort: 'hours', direction: 'asc', from: '2026-01-01' })
      .subscribe();

    const request = http.expectOne((req) => req.url === `${STATS_URL}/volunteers`);
    const params = request.request.params;
    expect(params.get('page')).toBe('2');
    expect(params.get('pageSize')).toBe('25');
    expect(params.get('sort')).toBe('hours');
    expect(params.get('direction')).toBe('asc');
    expect(params.get('from')).toBe('2026-01-01');
    expect(params.has('to')).toBeFalse();
    request.flush({ items: [], totalCount: 0, page: 2, pageSize: 25 });
  });
});
