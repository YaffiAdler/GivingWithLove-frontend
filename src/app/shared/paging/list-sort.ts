import { Sort } from '@angular/material/sort';
import { ListSort } from './server-paged-list';

/**
 * Maps a mat-sort change to the list's sort. A cleared sort (no direction) or a column the server
 * cannot sort by gives `null`, so the server's default order applies.
 */
export function toListSort<TSort extends string>(
  event: Sort,
  sortableColumns: readonly TSort[],
): ListSort<TSort> | null {
  const column = sortableColumns.find((sortable) => sortable === event.active);
  if (column === undefined || event.direction === '') {
    return null;
  }
  return { active: column, direction: event.direction };
}
