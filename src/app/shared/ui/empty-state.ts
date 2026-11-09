import { Component, input } from '@angular/core';

/** Shown when the server returned no rows. */
@Component({
  selector: 'app-empty-state',
  template: `<div class="page-state">{{ message() }}</div>`,
  styleUrl: './page-state.scss',
})
export class EmptyState {
  readonly message = input('אין נתונים להצגה');
}
