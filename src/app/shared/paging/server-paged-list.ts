import { computed, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, tap } from 'rxjs';
import { PagedResult, SortDirection } from '../../models/paged-result.model';
import { SEARCH_DEBOUNCE_MS } from './search-debounce';

export const DEFAULT_PAGE_SIZE = 25;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/** A sort chosen in the table header: a column and a direction. */
export interface ListSort<TSort extends string> {
  active: TSort;
  direction: SortDirection;
}

/** Without `sort` and `direction` the server applies its own default order. */
export interface ServerPageQuery<TSort extends string> {
  page: number;
  pageSize: number;
  sort?: TSort;
  direction?: SortDirection;
  search: string;
}

/**
 * State of a list that is paged, sorted and searched on the server.
 * A new query cancels the request still in flight (switchMap), and the search box is debounced.
 * Must be created in an injection context (a field initializer or constructor).
 */
export function createServerPagedList<TItem, TSort extends string>(config: {
  initialSort: ListSort<TSort>;
  load: (query: ServerPageQuery<TSort>) => Observable<PagedResult<TItem>>;
}) {
  const searchControl = new FormControl('', { nonNullable: true });
  const pageIndex = signal(0);
  const pageSize = signal(DEFAULT_PAGE_SIZE);
  const sort = signal<ListSort<TSort> | null>(config.initialSort);
  const search = signal('');
  const reloadCount = signal(0);
  const loading = signal(false);
  const failed = signal(false);

  searchControl.valueChanges
    .pipe(
      debounceTime(SEARCH_DEBOUNCE_MS),
      map((text) => text.trim()),
      distinctUntilChanged(),
      takeUntilDestroyed(),
    )
    .subscribe((text) => {
      pageIndex.set(0);
      search.set(text);
    });

  const query = computed<ServerPageQuery<TSort>>(() => {
    // Read only to re-run the query when reload() is called.
    reloadCount();
    const currentSort = sort();
    return {
      page: pageIndex() + 1,
      pageSize: pageSize(),
      sort: currentSort?.active,
      direction: currentSort?.direction,
      search: search(),
    };
  });

  const result = toSignal(
    toObservable(query).pipe(
      tap(() => {
        loading.set(true);
        failed.set(false);
      }),
      switchMap((pageQuery) =>
        config.load(pageQuery).pipe(
          // The error interceptor already told the user; here the list only switches to its error state.
          catchError(() => {
            failed.set(true);
            return of(null);
          }),
        ),
      ),
      tap(() => loading.set(false)),
    ),
    { initialValue: null },
  );

  return {
    searchControl,
    pageIndex: pageIndex.asReadonly(),
    pageSize: pageSize.asReadonly(),
    loading: loading.asReadonly(),
    failed: failed.asReadonly(),
    items: computed(() => result()?.items ?? []),
    totalCount: computed(() => result()?.totalCount ?? 0),
    pageSizeOptions: PAGE_SIZE_OPTIONS,

    changePage(event: PageEvent): void {
      pageIndex.set(event.pageIndex);
      pageSize.set(event.pageSize);
    },

    /** `null` clears the sort, so the server's default order applies. */
    changeSort(newSort: ListSort<TSort> | null): void {
      pageIndex.set(0);
      sort.set(newSort);
    },

    reload(): void {
      reloadCount.update((count) => count + 1);
    },
  };
}
