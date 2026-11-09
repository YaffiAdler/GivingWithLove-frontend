import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { EichudApiService } from '../../core/api/eichud-api.service';
import { VolunteerApiService } from '../../core/api/volunteer-api.service';
import { SessionService } from '../../core/auth/session.service';
import { Eichud } from '../../models/eichud.model';
import { VolunteerDetails } from '../../models/volunteer.model';

const INT32_MAX = 2_147_483_647;

type LoginResult =
  | { kind: 'wrongCredentials' }
  | { kind: 'notVolunteer' }
  | { kind: 'volunteer'; volunteer: VolunteerDetails };

@Component({
  selector: 'app-log-in',
  imports: [ReactiveFormsModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
})
export class LogIn {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly eichudApi = inject(EichudApiService);
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly session = inject(SessionService);

  readonly loginFailed = signal(false);

  lgFrm = new FormGroup({
    userName: new FormControl<string | null>('אנונימי', [Validators.required]),
    password: new FormControl<string | number | null>(1, [Validators.required]),
  });

  enter() {
    const userName = this.lgFrm.controls.userName.value;
    const personCode = Number(this.lgFrm.controls.password.value);

    this.findLoginResult(userName, personCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.applyLoginResult(result),
        // Server down, 400 or 500: the interceptor showed the cause; the form shows the login error.
        error: () => this.loginFailed.set(true),
      });
  }

  /** The password is the person's registry code; the user name must match that person's name. */
  private findLoginResult(userName: string | null, personCode: number): Observable<LoginResult> {
    if (!isPersonCode(personCode)) {
      return of({ kind: 'wrongCredentials' });
    }

    return this.eichudApi.findById(personCode).pipe(
      switchMap((person) => {
        if (!person || registryUserName(person) !== userName) {
          return of<LoginResult>({ kind: 'wrongCredentials' });
        }
        return this.volunteerApi
          .findById(personCode)
          .pipe(
            map((volunteer): LoginResult =>
              volunteer ? { kind: 'volunteer', volunteer } : { kind: 'notVolunteer' },
            ),
          );
      }),
    );
  }

  private applyLoginResult(result: LoginResult) {
    switch (result.kind) {
      case 'wrongCredentials':
        this.loginFailed.set(true);
        return;
      case 'notVolunteer':
        this.session.clearCurrentUser();
        return;
      case 'volunteer':
        this.session.logIn(result.volunteer);
        this.lgFrm.reset({ userName: null, password: null });
        this.router.navigate(['/home']);
        return;
    }
  }
}

/** The login name format used so far: family name, a space, first name. */
function registryUserName(person: Eichud): string {
  return `${person.familyName?.trim()} ${person.firstName?.trim()}`;
}

/** Registry codes are non-negative int32 values on the server; anything else cannot be a person. */
function isPersonCode(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= INT32_MAX;
}
