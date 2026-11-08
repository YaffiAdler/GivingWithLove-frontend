import { HttpParams } from '@angular/common/http';

type QueryValue = string | number | boolean | null | undefined;

/** Builds query parameters, skipping empty values so the server applies its own defaults. */
export function toHttpParams(query: object): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(query) as [string, QueryValue][]) {
    if (value !== undefined && value !== null && value !== '') {
      params = params.set(key, String(value));
    }
  }
  return params;
}
