import { Directive } from '@angular/core';
import { MatSort, MatSortable, SortDirection } from '@angular/material/sort';

/**
 * `matSort` for server lists whose API accepts a sort column but no direction yet (BE-06 adds it).
 * Clicking the active header again keeps the column's start direction, so the arrow never shows
 * an order the server does not apply. Use instead of `matSort`; `mat-sort-header` works unchanged.
 */
@Directive({
  selector: '[appFixedDirectionSort]',
  exportAs: 'matSort',
  host: { class: 'mat-sort' },
  providers: [{ provide: MatSort, useExisting: FixedDirectionSort }],
})
export class FixedDirectionSort extends MatSort {
  override getNextSortDirection(sortable: MatSortable): SortDirection {
    return sortable.start || this.start;
  }
}
