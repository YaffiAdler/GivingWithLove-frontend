import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectApiService } from '../../core/api/project-api.service';
import { SubProjectApiService } from '../../core/api/sub-project-api.service';
import { Project } from '../../models/project.model';
import { SubProject as SubProjectItem } from '../../models/sub-project.model';
import { LoadState } from '../../shared/loading/load-state';

@Component({
  selector: 'app-sub-project',
  imports: [RouterModule],
  templateUrl: './sub-project.html',
  styleUrl: './sub-project.scss'
})
export class SubProject implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly projectApi = inject(ProjectApiService);
  private readonly subProjectApi = inject(SubProjectApiService);

  readonly filteredProjects = signal<Project[]>([]);
  readonly subProjects = signal<SubProjectItem[]>([]);
  readonly loadState = signal<LoadState>('loading');

  ngOnInit() {
    const departmentCode = this.route.snapshot.paramMap.get('id');

    forkJoin({ projects: this.projectApi.getAll(), subProjects: this.subProjectApi.getAll() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ projects, subProjects }) => {
          this.filteredProjects.set(
            projects.filter((project) => project.domainCode?.toString() === departmentCode),
          );
          this.subProjects.set(subProjects);
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the page shows its error state.
        error: () => this.loadState.set('error'),
      });
  }

  goToVolunteering(subProject: SubProjectItem) {
    this.router.navigate(['/v'], {
      queryParams: { projectCode: subProject.projectCode, subProjectCode: subProject.subProjectCode },
    });
  }
}
