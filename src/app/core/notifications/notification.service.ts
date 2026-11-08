import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

const SUCCESS_DURATION_MS = 3000;
const ERROR_DURATION_MS = 6000;
const CLOSE_LABEL = 'סגור';

/** Short user-facing messages (Hebrew, right-to-left). */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  success(message: string): void {
    this.snackBar.open(message, CLOSE_LABEL, {
      duration: SUCCESS_DURATION_MS,
      direction: 'rtl',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, CLOSE_LABEL, {
      duration: ERROR_DURATION_MS,
      direction: 'rtl',
      politeness: 'assertive',
    });
  }
}
