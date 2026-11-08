import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ValidationProblemDetails } from '../../models/problem-details.model';
import { NotificationService } from '../notifications/notification.service';
import { SILENT_ERROR_STATUSES } from './silent-error-statuses';

const SERVER_UNAVAILABLE = 'השרת אינו זמין';
const VALIDATION_FAILED = 'הנתונים שנשלחו אינם תקינים';

const MESSAGE_BY_STATUS: Partial<Record<number, string>> = {
  [HttpStatusCode.BadRequest]: 'הבקשה אינה תקינה',
  [HttpStatusCode.NotFound]: 'הפריט המבוקש לא נמצא',
  [HttpStatusCode.Conflict]: 'הפעולה מתנגשת בנתונים קיימים',
  [HttpStatusCode.InternalServerError]: 'אירעה שגיאה בשרת',
};

/**
 * Shows every failed HTTP call to the user, then rethrows so callers that must
 * change their own state can still react. Statuses listed in SILENT_ERROR_STATUSES are skipped.
 */
export const errorNotificationInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        !req.context.get(SILENT_ERROR_STATUSES).includes(error.status)
      ) {
        notifications.error(toUserMessage(error));
      }
      return throwError(() => error);
    }),
  );
};

function toUserMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return SERVER_UNAVAILABLE;
  }

  // The server's `title` and `detail` are English, so only the Hebrew summary is shown.
  const summary = MESSAGE_BY_STATUS[error.status] ?? `אירעה שגיאה (קוד ${error.status})`;
  const fieldMessages = readValidationMessages(error.error);
  return fieldMessages.length ? `${VALIDATION_FAILED}: ${fieldMessages.join('; ')}` : summary;
}

/** The per-field messages of a ValidationProblemDetails body; empty for any other body. */
function readValidationMessages(body: unknown): string[] {
  return isValidationProblem(body) ? Object.values(body.errors).flat() : [];
}

function isValidationProblem(body: unknown): body is ValidationProblemDetails {
  return (
    typeof body === 'object' &&
    body !== null &&
    'errors' in body &&
    typeof body.errors === 'object' &&
    body.errors !== null
  );
}
