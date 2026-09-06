import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * Central HTTP logging interceptor.
 * Logs every completed request (method + status + url) and every error,
 * so network failures are visible in the console instead of failing silently.
 */
export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          console.log(`[HTTP ${event.status}] ${req.method} ${req.url}`);
        }
      },
      error: (err) => {
        if (err instanceof HttpErrorResponse) {
          console.error(`[HTTP ${err.status}] ${req.method} ${req.url}`, err.message);
        }
      },
    })
  );
