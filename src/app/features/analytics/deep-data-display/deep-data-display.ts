import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, Subject, switchMap, tap } from 'rxjs';
import { SubProjectApiService } from '../../../core/api/sub-project-api.service';
import { SubProject } from '../../../models/sub-project.model';
import { EmptyState } from '../../../shared/ui/empty-state';
import { ErrorState } from '../../../shared/ui/error-state';
import { LoadState } from '../../../shared/ui/load-state';
import { Loading } from '../../../shared/ui/loading';

/** One project and its sub-projects. */
@Component({
  selector: 'app-deep-data-display',
  imports: [Loading, ErrorState, EmptyState],
  templateUrl: './deep-data-display.html',
  styleUrl: './deep-data-display.scss'
})
export class DeepDataDisplay implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly subProjectApi = inject(SubProjectApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly retries = new Subject<void>();

  readonly subProjects = signal<SubProject[]>([]);
  readonly loadState = signal<LoadState>('loading');

  ngOnInit() {
    // Sub-projects are a small lookup table, so the full list is fetched and filtered by project.
    combineLatest([this.route.paramMap, this.retries.pipe(startWith(undefined))])
      .pipe(
        switchMap(([params]) => {
          const projectCode = Number(params.get('code'));
          this.loadState.set('loading');
          return this.subProjectApi.getAll().pipe(
            map((subProjects) => subProjects.filter((sub) => sub.projectCode === projectCode)),
            tap(() => this.loadState.set('ready')),
            // The error interceptor already showed the message; the page shows its error state.
            catchError(() => {
              this.loadState.set('error');
              return of<SubProject[]>([]);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((subProjects) => this.subProjects.set(subProjects));
  }

  retry() {
    this.retries.next();
  }
}
