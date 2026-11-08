import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ProjectApiService } from '../../core/api/project-api.service';
import { Project } from '../../models/project.model';
import { LoadState } from '../../shared/loading/load-state';

@Component({
  selector: 'app-domains',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './domains.html',
  styleUrl: './domains.scss',
})
export class Domains implements OnInit {
  private readonly projectApi = inject(ProjectApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly projects = signal<Project[]>([]);
  readonly loadState = signal<LoadState>('loading');
  /** Projects without a parent domain are the departments listed here. */
  readonly departments = computed(() => this.projects().filter((p) => p.domainCode == null));

  ngOnInit() {
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
