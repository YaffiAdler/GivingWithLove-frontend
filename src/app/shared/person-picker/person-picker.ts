import { Component, effect, input } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap, tap } from 'rxjs';
import { SEARCH_DEBOUNCE_MS } from '../paging/search-debounce';
import { PersonOption } from './person-option';

/**
 * Text box that searches people on the server while the user types and writes the
 * chosen person's code into `control`. Typing again clears the chosen code.
 */
@Component({
  selector: 'app-person-picker',
  imports: [ReactiveFormsModule, MatAutocompleteModule],
  templateUrl: './person-picker.html',
})
export class PersonPicker {
  readonly control = input.required<FormControl<number | null>>();
  readonly search = input.required<(text: string) => Observable<PersonOption[]>>();
  /** The person to show when the code is filled from outside (route, session, edit mode). */
  readonly selected = input<PersonOption | null>(null);
  readonly placeholder = input('חפש...');

  readonly textControl = new FormControl<string | PersonOption>('', { nonNullable: true });

  readonly options = toSignal(
    this.textControl.valueChanges.pipe(
      tap((value) => {
        if (typeof value === 'string') {
          this.control().setValue(null);
        }
      }),
      debounceTime(SEARCH_DEBOUNCE_MS),
      distinctUntilChanged(),
      switchMap((value) => {
        const text = typeof value === 'string' ? value.trim() : '';
        // The error interceptor already showed the failure; keep the list empty.
        return text ? this.search()(text).pipe(catchError(() => of([]))) : of([]);
      }),
      takeUntilDestroyed(),
    ),
    { initialValue: [] as PersonOption[] },
  );

  constructor() {
    effect(() => {
      const person = this.selected();
      if (person) {
        this.textControl.setValue(person, { emitEvent: false });
      }
    });

    // When the owning form is reset, clear the chosen person's text too.
    effect((onCleanup) => {
      const subscription = this.control().valueChanges.subscribe((code) => {
        if (code === null && typeof this.textControl.value !== 'string') {
          this.textControl.setValue('', { emitEvent: false });
        }
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }

  readonly displayLabel = (value: string | PersonOption | null): string =>
    typeof value === 'string' || value === null ? (value ?? '') : value.label;

  choose(event: MatAutocompleteSelectedEvent) {
    const person = event.option.value as PersonOption;
    this.control().setValue(person.code);
  }
}
