import { HttpContext, HttpContextToken } from '@angular/common/http';

/**
 * HTTP status codes that the caller handles itself, so the error interceptor must not
 * show a notification for them (e.g. 404 on a lookup where "not found" is a normal answer).
 */
export const SILENT_ERROR_STATUSES = new HttpContextToken<readonly number[]>(() => []);

export function silentErrorStatuses(...statuses: number[]): HttpContext {
  return new HttpContext().set(SILENT_ERROR_STATUSES, statuses);
}
