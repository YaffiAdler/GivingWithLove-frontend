import { Component, input, output } from '@angular/core';

/** Shown when loading failed; the error interceptor has already shown the cause. */
@Component({
  selector: 'app-error-state',
  template: `
    <div class="page-state page-state-error" role="alert">
      <span>{{ message() }}</span>
      <button type="button" class="page-state-retry" (click)="retry.emit()">נסה שוב</button>
    </div>
  `,
  styleUrl: './page-state.scss',
})
export class ErrorState {
  readonly message = input('שגיאה בטעינת הנתונים');
  readonly retry = output<void>();
}
