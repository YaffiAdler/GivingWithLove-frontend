import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';

/** Maps a 404 response to `null`; every other error is rethrown. */
export function notFoundAsNull<T>(source: Observable<T>): Observable<T | null> {
  return source.pipe(
    catchError((error: unknown) =>
      error instanceof HttpErrorResponse && error.status === HttpStatusCode.NotFound
        ? of(null)
        : throwError(() => error),
    ),
  );
}
