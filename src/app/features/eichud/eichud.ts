import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { EichudApiService } from '../../core/api/eichud-api.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { CreateEichud, Eichud as EichudPerson, EichudSort } from '../../models/eichud.model';
import { createServerPagedList } from '../../shared/paging/server-paged-list';
import { toListSort } from '../../shared/paging/list-sort';
import { EmptyState } from '../../shared/ui/empty-state';
import { ErrorState } from '../../shared/ui/error-state';
import { Loading } from '../../shared/ui/loading';

/** The columns the server can sort the registry by. */
const EICHUD_SORT_COLUMNS: readonly EichudSort[] = ['name', 'code'];

@Component({
  selector: 'app-eichud',
  imports: [
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    Loading,
    ErrorState,
    EmptyState,
  ],
  templateUrl: './eichud.html',
  styleUrl: './eichud.scss'
})
export class Eichud {
  private readonly eichudApi = inject(EichudApiService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly people = createServerPagedList<EichudPerson, EichudSort>({
    initialSort: { active: 'name', direction: 'asc' },
    load: (query) => this.eichudApi.getAll(query),
  });

  frmPerson = new FormGroup({
    eichudCode: new FormControl<number | null>(null, Validators.required),
    tohar: new FormControl<string | null>("הרה'ח"),
    familyName: new FormControl<string | null>("גולדמן"),
    firstName: new FormControl<string | null>("עקיבא"),
    ending: new FormControl<string | null>(" "),
    shtibel: new FormControl<string | null>("בית המדרש"),
    street: new FormControl<string | null>("ישא ברכה"),
    house: new FormControl<string | null>("15"),
    city: new FormControl<string | null>("ירושלים"),
    zipCode: new FormControl<string | null>("123"),
    housePhone: new FormControl<string | null>("02-5328910"),
    cellPhone: new FormControl<string | null>("0233179441"),
    shver: new FormControl<string | null>("משה מנחם פרנקל"),
  });

  changeSort(sort: Sort) {
    this.people.changeSort(toListSort(sort, EICHUD_SORT_COLUMNS));
  }

  save() {
    const form = this.frmPerson.getRawValue();
    if (form.eichudCode === null) {
      return;
    }
    const person: CreateEichud = {
      ...form,
      eichudCode: form.eichudCode,
      zipCode: toOptionalNumber(form.zipCode),
    };
    this.eichudApi
      .create(person)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notifications.success('איש האיחוד נשמר');
        this.people.reload();
      });
  }
}

function toOptionalNumber(text: string | null): number | null {
  if (text === null || text.trim() === '') {
    return null;
  }
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}
