/** Paging parameters shared by the server-paged list endpoints (page is 1-based, pageSize 1..100). */
export interface PageRequest {
  page: number;
  pageSize: number;
}

/** Shape of every server-paged list response (`PagedResult<T>` on the server). */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
