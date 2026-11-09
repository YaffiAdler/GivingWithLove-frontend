import { paths } from './api.generated';

type VolunteerListQuery = NonNullable<paths['/api/Volunteer']['get']['parameters']['query']>;

/**
 * Sort direction of the server-paged lists, taken from the contract. Every paged list accepts the
 * same values; without it each sort keeps its default.
 */
export type SortDirection = NonNullable<VolunteerListQuery['Direction']>;

/** Paging parameters shared by the server-paged list endpoints (page is 1-based, pageSize 1..100). */
export interface PageRequest {
  page: number;
  pageSize: number;
  direction?: SortDirection;
}

/** Shape of every server-paged list response (`PagedResult<T>` on the server). */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
