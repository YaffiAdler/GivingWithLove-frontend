import { Pipe, PipeTransform } from '@angular/core';

/** Shows a dash for a missing value, so empty cells and fields are visibly empty. */
@Pipe({ name: 'orDash' })
export class OrDashPipe implements PipeTransform {
  transform(value: string | number | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }
    const text = String(value).trim();
    return text === '' ? '—' : text;
  }
}
