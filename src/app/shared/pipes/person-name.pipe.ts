import { Pipe, PipeTransform } from '@angular/core';

/** The name parts a registry person or volunteer has. */
export interface PersonNameParts {
  tohar?: string | null;
  firstName?: string | null;
  familyName?: string | null;
  ending?: string | null;
}

/** Title, first name, family name and ending, the order the registry uses; empty parts are skipped. */
@Pipe({ name: 'personName' })
export class PersonNamePipe implements PipeTransform {
  transform(person: PersonNameParts): string {
    return [person.tohar, person.firstName, person.familyName, person.ending]
      .map((part) => part?.trim())
      .filter((part) => !!part)
      .join(' ');
  }
}
