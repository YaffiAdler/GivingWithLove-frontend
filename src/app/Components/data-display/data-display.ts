import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProjectApiService } from '../../core/api/project-api.service';
import { DepartmentNode } from '../../models/project-tree.model';

@Component({
  selector: 'app-data-display',
  imports: [RouterLink],
  templateUrl: './data-display.html',
  styleUrl: './data-display.scss',
})
export class DataDisplay implements OnInit {
  private readonly projectApi = inject(ProjectApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly departments = signal<DepartmentNode[]>([]);

  ngOnInit() {
    this.projectApi
      .getTree()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((departments) => this.departments.set(departments));
  }
}
