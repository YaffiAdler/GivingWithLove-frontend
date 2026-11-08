import { computed, Injectable, signal } from '@angular/core';
import { VolunteerDetails } from '../../models/volunteer.model';

/**
 * In-memory logged-in user. Temporary: nothing persists across a page refresh,
 * and there are no tokens or guards. Real authentication replaces this later (SEC-01).
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly currentUserState = signal<VolunteerDetails | undefined>(undefined);
  private readonly loggedInState = signal(false);

  readonly currentUser = this.currentUserState.asReadonly();
  readonly isVolunteerLoggedIn = this.loggedInState.asReadonly();
  /** Position name of the logged-in volunteer. */
  readonly userPosition = computed(() => this.currentUserState()?.positionName ?? undefined);

  logIn(volunteer: VolunteerDetails): void {
    this.currentUserState.set(volunteer);
    this.loggedInState.set(true);
  }

  /**
   * The person exists in the registry but is not a volunteer. Matches the previous login
   * behavior: the current user is forgotten, the menu state is left as it was.
   */
  clearCurrentUser(): void {
    this.currentUserState.set(undefined);
  }
}
