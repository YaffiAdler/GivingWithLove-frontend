import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectApiService } from '../../../core/api/project-api.service';
import { DepartmentNode } from '../../../models/project-tree.model';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { LoadState } from '../../../shared/ui/load-state';
import { Loading } from '../../../shared/ui/loading';

/** One department (אגף) and the projects under it. */
@Component({
  selector: 'app-mid-data',
  imports: [RouterLink, Loading, ErrorState, EmptyState],
  templateUrl: './mid-data.html',
  styleUrl: './mid-data.scss'
})
export class MidData implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projectApi = inject(ProjectApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly department = signal<DepartmentNode | null>(null);
  readonly loadState = signal<LoadState>('loading');

  ngOnInit() {
    this.load();
  }

  load() {
    const departmentCode = Number(this.route.snapshot.paramMap.get('code'));
    this.loadState.set('loading');

    this.projectApi
      .getTree()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (departments) => {
          this.department.set(departments.find((d) => d.projectCode === departmentCode) ?? null);
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the page shows its error state.
        error: () => this.loadState.set('error'),
      });
  }
}
