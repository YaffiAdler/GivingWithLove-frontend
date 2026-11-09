import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { PositionApiService } from '../../../core/api/position-api.service';
import { ProjectApiService } from '../../../core/api/project-api.service';
import { VolunteerApiService } from '../../../core/api/volunteer-api.service';
import { Position } from '../../../models/position.model';
import { Project } from '../../../models/project.model';
import { VolunteerDetails } from '../../../models/volunteer.model';
import { ErrorState } from '../../../shared/ui/error-state';
import { LoadState } from '../../../shared/ui/load-state';
import { Loading } from '../../../shared/ui/loading';
import { PersonPicker } from '../../../shared/person-picker/person-picker';
import { PersonSearchService } from '../../../shared/person-picker/person-search.service';
import { VolunteerDomain } from '../volunteer-domain/volunteer-domain';

/** Add mode: picks an Eichud person to become a volunteer. Edit mode (`edit/:id`): updates a volunteer. */
@Component({
  selector: 'app-add-volunteer',
  imports: [ReactiveFormsModule, RouterModule, VolunteerDomain, PersonPicker, Loading, ErrorState],
  templateUrl: './add-volunteer.html',
  styleUrls: ['./add-volunteer.scss']
})
export class AddVolunteer implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly volunteerApi = inject(VolunteerApiService);
  private readonly positionApi = inject(PositionApiService);
  private readonly projectApi = inject(ProjectApiService);
  private readonly personSearch = inject(PersonSearchService);

  readonly isE = signal(false);
  readonly loadState = signal<LoadState>('loading');
  readonly volun = signal<VolunteerDetails | null>(null);
  readonly positions = signal<Position[]>([]);
  readonly projects = signal<Project[]>([]);
  /** The volunteer's project codes, without duplicates (each code is also the row's track id). */
  readonly domains = signal<number[]>([]);

  vlntrFrm = new FormGroup({
    name: new FormControl<number | null>(null, Validators.required),
    position: new FormControl<number | null>(null, Validators.required),
  });

  /** Shtibel and father-in-law help tell apart people with the same name. */
  readonly searchEichud = (text: string) => this.personSearch.searchEichud(text, true);

  ngOnInit() {
    this.isE.set(this.editedVolunteerCode() !== null);
    this.load();
  }

  /** Loads the lists for the selects and, in edit mode, the volunteer being edited. */
  load() {
    const volunteerCode = this.editedVolunteerCode();
    this.loadState.set('loading');

    forkJoin({
      positions: this.positionApi.getAll(),
      projects: this.projectApi.getAll(),
      volunteer: volunteerCode === null ? of(null) : this.volunteerApi.getById(volunteerCode),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ positions, projects, volunteer }) => {
          this.positions.set(positions);
          this.projects.set(projects);
          if (volunteer) {
            this.showVolunteer(volunteer);
          }
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the page shows its error state.
        error: () => this.loadState.set('error'),
      });
  }

  addDomain(projectCode: number) {
    this.domains.update((domains) =>
      domains.includes(projectCode) ? domains : [...domains, projectCode],
    );
  }

  edit() {
    const volunteer = this.volun();
    if (!volunteer) {
      return;
    }
    const volunteerCode = volunteer.volunteerCode;
    this.volunteerApi
      .update({ volunteerCode, positionCode: this.vlntrFrm.controls.position.value })
      .pipe(
        switchMap(() =>
          this.volunteerApi.updateDomains({ volunteerCode, projectCodes: this.domains() }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.router.navigate(['/volunteer']));
  }

  addVolunteer() {
    const volunteerCode = this.vlntrFrm.controls.name.value;
    if (this.vlntrFrm.invalid || volunteerCode === null) {
      return;
    }
    this.volunteerApi
      .create({
        volunteerCode,
        positionCode: this.vlntrFrm.controls.position.value,
        projectCodes: this.domains(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.router.navigate(['/volunteer']));
  }

  private editedVolunteerCode(): number | null {
    const id = this.route.snapshot.paramMap.get('id');
    return id === null ? null : Number(id);
  }

  private showVolunteer(volunteer: VolunteerDetails) {
    this.volun.set(volunteer);
    this.vlntrFrm.patchValue({
      name: volunteer.volunteerCode,
      position: volunteer.positionCode ?? null,
    });
    // The database holds duplicate volunteer-project links; show each project once.
    this.domains.set([...new Set(volunteer.projectCodes)]);
  }
}
