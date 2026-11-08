import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectApiService } from '../../core/api/project-api.service';
import { DepartmentNode } from '../../models/project-tree.model';

/** One department (אגף) and the projects under it. */
@Component({
  selector: 'app-mid-data',
  imports: [RouterLink],
  templateUrl: './mid-data.html',
  styleUrl: './mid-data.scss'
})
export class MidData implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly projectApi = inject(ProjectApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly department = signal<DepartmentNode | null>(null);
  readonly loaded = signal(false);

  ngOnInit() {
    const departmentCode = Number(this.route.snapshot.paramMap.get('code'));

    this.projectApi
      .getTree()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((departments) => {
        this.department.set(departments.find((d) => d.projectCode === departmentCode) ?? null);
        this.loaded.set(true);
      });
  }
}
