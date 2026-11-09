import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectApiService } from '../../../core/api/project-api.service';
import { DepartmentNode } from '../../../models/project-tree.model';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { LoadState } from '../../../shared/ui/load-state';
import { Loading } from '../../../shared/ui/loading';

@Component({
  selector: 'app-data-display',
  imports: [RouterLink, Loading, ErrorState, EmptyState],
  templateUrl: './data-display.html',
  styleUrl: './data-display.scss',
})
export class DataDisplay implements OnInit {
  private readonly projectApi = inject(ProjectApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly departments = signal<DepartmentNode[]>([]);
  readonly loadState = signal<LoadState>('loading');

  ngOnInit() {
    this.load();
  }

  load() {
    this.loadState.set('loading');
    this.projectApi
      .getTree()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (departments) => {
          this.departments.set(departments);
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the page shows its error state.
        error: () => this.loadState.set('error'),
      });
  }
}
