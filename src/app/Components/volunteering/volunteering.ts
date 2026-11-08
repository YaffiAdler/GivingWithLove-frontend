import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectApiService } from '../../core/api/project-api.service';
import { SubProjectApiService } from '../../core/api/sub-project-api.service';
import { VolunteerApiService } from '../../core/api/volunteer-api.service';
import { VolunteeringApiService } from '../../core/api/volunteering-api.service';
import { SessionService } from '../../core/auth/session.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { Project } from '../../models/project.model';
import { SubProject } from '../../models/sub-project.model';
import { CreateVolunteering } from '../../models/volunteering.model';
import { PersonOption, toPersonOption } from '../../shared/person-picker/person-option';
import { PersonPicker } from '../../shared/person-picker/person-picker';
import { PersonSearchService } from '../../shared/person-picker/person-search.service';
import { LoadState } from '../../shared/loading/load-state';

/** Query parameters that other pages (volunteer list, sub-projects) use to pre-fill this form. */
interface VolunteeringFormParams {
  volunteerCode?: number;
  projectCode?: number;
  subProjectCode?: number;
}

@Component({
  selector: 'app-volunteering',
  imports: [ReactiveFormsModule, PersonPicker],
  templateUrl: './volunteering.html',
  styleUrl: './volunteering.scss'
})
export class Volunteering implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly session = inject(SessionService);
  private readonly notifications = inject(NotificationService);
  private readonly volunteeringApi = inject(VolunteeringApiService);
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly projectApi = inject(ProjectApiService);
  private readonly subProjectApi = inject(SubProjectApiService);
  private readonly personSearch = inject(PersonSearchService);

  readonly projects = signal<Project[]>([]);
  readonly filteredSubProjects = signal<SubProject[]>([]);
  readonly listsState = signal<LoadState>('loading');
  readonly selectedVolunteer = signal<PersonOption | null>(null);
  readonly selectedMatcher = signal<PersonOption | null>(null);
  private subProjects: SubProject[] = [];

  vlntrFrm = new FormGroup({
    dateOfVolunteering: new FormControl<string | null>(null, Validators.required),
    volunteerCode: new FormControl<number | null>(null, Validators.required),
    poorManCode: new FormControl<number | null>(null, Validators.required),
    matcherCode: new FormControl<number | null>(null, Validators.required),
    projectCode: new FormControl<number | null>(null),
    subProjectCode: new FormControl<number | null>(null)
  });

  /** Volunteer and matcher are both Volunteers; the poor man is an Eichud person. */
  readonly searchVolunteers = this.personSearch.searchVolunteers;
  readonly searchPoorMen = (text: string) => this.personSearch.searchEichud(text);

  ngOnInit() {
    const params = readFormParams(this.route.snapshot.queryParamMap);
    this.vlntrFrm.patchValue({
      dateOfVolunteering: todayAsDateInput(),
      volunteerCode: params.volunteerCode ?? null,
      matcherCode: this.session.currentUser()?.volunteerCode ?? null,
      projectCode: params.projectCode ?? null,
      subProjectCode: params.subProjectCode ?? null,
    });

    const currentUser = this.session.currentUser();
    if (currentUser) {
      this.selectedMatcher.set(
        toPersonOption(currentUser.volunteerCode, currentUser.familyName, currentUser.firstName),
      );
    }
    if (params.volunteerCode !== undefined) {
      this.showPreselectedVolunteer(params.volunteerCode);
    }

    this.vlntrFrm.controls.projectCode.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((projectCode) => this.filterSubProjects(projectCode));

    forkJoin({ projects: this.projectApi.getAll(), subProjects: this.subProjectApi.getAll() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ projects, subProjects }) => {
          this.projects.set(projects);
          this.subProjects = subProjects;
          this.filterSubProjects(this.vlntrFrm.controls.projectCode.value);
          this.listsState.set('ready');
        },
        // The error interceptor already showed the message; the form shows the error state.
        error: () => this.listsState.set('error'),
      });
  }

  addVolunteering() {
    const form = this.vlntrFrm.getRawValue();
    if (this.vlntrFrm.invalid || !form.dateOfVolunteering) {
      return;
    }
    const volunteering: CreateVolunteering = { ...form, dateOfVolunteering: form.dateOfVolunteering };
    this.volunteeringApi
      .create(volunteering)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notifications.success('ההתנדבות נשמרה');
        // Reset only after the server accepted it, so a failed save keeps what the user typed.
        this.vlntrFrm.reset();
      });
  }

  private showPreselectedVolunteer(volunteerCode: number) {
    this.volunteerApi
      .getById(volunteerCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((volunteer) =>
        this.selectedVolunteer.set(
          toPersonOption(volunteer.volunteerCode, volunteer.familyName, volunteer.firstName),
        ),
      );
  }

  /** Shows the chosen project's sub-projects and drops a chosen sub-project of another project. */
  private filterSubProjects(projectCode: number | null) {
    const subProjects = this.subProjects.filter((sub) => sub.projectCode === projectCode);
    this.filteredSubProjects.set(subProjects);

    const subProjectControl = this.vlntrFrm.controls.subProjectCode;
    const chosen = subProjectControl.value;
    if (chosen !== null && !subProjects.some((sub) => sub.subProjectCode === chosen)) {
      subProjectControl.setValue(null);
    }
  }
}

function readFormParams(query: { get(name: string): string | null }): VolunteeringFormParams {
  return {
    volunteerCode: toOptionalNumber(query.get('volunteerCode')),
    projectCode: toOptionalNumber(query.get('projectCode')),
    subProjectCode: toOptionalNumber(query.get('subProjectCode')),
  };
}

function toOptionalNumber(text: string | null): number | undefined {
  const value = Number(text);
  return text !== null && Number.isInteger(value) ? value : undefined;
}

/** Today in the yyyy-MM-dd format a date input expects. */
function todayAsDateInput(): string {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');
}
