import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProjectApiService } from '../../core/api/project-api.service';
import { Project as ProjectItem } from '../../models/project.model';
import { LoadState } from '../../shared/loading/load-state';
import { PersonPicker } from '../../shared/person-picker/person-picker';
import { PersonSearchService } from '../../shared/person-picker/person-search.service';

@Component({
  selector: 'app-project',
  imports: [ReactiveFormsModule, PersonPicker],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class Project implements OnInit {
  private readonly projectApi = inject(ProjectApiService);
  private readonly personSearch = inject(PersonSearchService);
  private readonly destroyRef = inject(DestroyRef);

  readonly projects = signal<ProjectItem[]>([]);
  readonly loadState = signal<LoadState>('loading');

  frm = new FormGroup({
    projectName: new FormControl<string | null>(null, Validators.required),
    projectManagerCode: new FormControl<number | null>(null),
    domainCode: new FormControl<number | null>(null)
  });

  /** The project manager is picked from the volunteers. */
  readonly searchManagers = this.personSearch.searchVolunteers;

  ngOnInit() {
    this.loadProjects();
  }

  addProject() {
    const form = this.frm.getRawValue();
    if (this.frm.invalid || !form.projectName) {
      return;
    }
    this.projectApi
      .create({ ...form, projectName: form.projectName })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadProjects());
  }

  private loadProjects() {
    this.projectApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (projects) => {
          this.projects.set(projects);
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the list shows its error state.
        error: () => this.loadState.set('error'),
      });
  }
}
