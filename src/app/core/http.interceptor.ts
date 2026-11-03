import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

/**
 * Central HTTP logging interceptor.
 * Errors are always logged so network failures are visible instead of failing silently.
 * Successful responses are logged only in development, to keep the production console clean.
 */
export const httpLoggingInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    tap({
      next: (event) => {
        if (!environment.production && event.type === HttpEventType.Response) {
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
