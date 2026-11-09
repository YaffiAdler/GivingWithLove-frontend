import { Component, input } from '@angular/core';

/** Shown while a page or a list waits for the server. */
@Component({
  selector: 'app-loading',
  template: `<div class="page-state" role="status">{{ message() }}</div>`,
  styleUrl: './page-state.scss',
})
export class Loading {
  readonly message = input('טוען נתונים...');
}
