import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EichudApiService } from '../../core/api/eichud-api.service';
import { VolunteerApiService } from '../../core/api/volunteer-api.service';
import { PersonOption, toPersonOption } from './person-option';

/** How many matches a picker shows; the user narrows the search to find someone else. */
const PICKER_PAGE_SIZE = 20;

/** Server searches that feed the person pickers. Volunteers and Eichud people stay separate. */
@Injectable({ providedIn: 'root' })
export class PersonSearchService {
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly eichudApi = inject(EichudApiService);

  readonly searchVolunteers = (text: string): Observable<PersonOption[]> =>
    this.volunteerApi
      .getAll({ page: 1, pageSize: PICKER_PAGE_SIZE, search: text })
      .pipe(
        map((page) =>
          page.items.map((v) => toPersonOption(v.volunteerCode, v.familyName, v.firstName)),
        ),
      );

  /** Eichud people (e.g. the poor man of a volunteering, or a person who becomes a volunteer). */
  readonly searchEichud = (text: string, withDetails = false): Observable<PersonOption[]> =>
    this.eichudApi.getAll({ page: 1, pageSize: PICKER_PAGE_SIZE, search: text }).pipe(
      map((page) =>
        page.items.map((p) =>
          toPersonOption(
            p.eichudCode,
            p.familyName,
            p.firstName,
            withDetails ? `שטיבל: ${p.shtibel ?? ''} | שם חותן: ${p.shver ?? ''}` : undefined,
          ),
        ),
      ),
    );
}
