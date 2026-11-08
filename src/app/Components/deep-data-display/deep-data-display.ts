import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { SubProjectApiService } from '../../core/api/sub-project-api.service';
import { SubProject } from '../../models/sub-project.model';

/** One project and its sub-projects. */
@Component({
  selector: 'app-deep-data-display',
  templateUrl: './deep-data-display.html',
  styleUrl: './deep-data-display.scss'
})
export class DeepDataDisplay implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly subProjectApi = inject(SubProjectApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly subProjects = signal<SubProject[]>([]);

  ngOnInit() {
    // Sub-projects are a small lookup table, so the full list is fetched and filtered by project.
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const projectCode = Number(params.get('code'));
          return this.subProjectApi.getAll().pipe(
            map((subProjects) => subProjects.filter((sub) => sub.projectCode === projectCode)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((subProjects) => this.subProjects.set(subProjects));
  }
}
