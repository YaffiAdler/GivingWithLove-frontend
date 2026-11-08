import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionApiService } from '../../core/api/position-api.service';
import { Position as PositionItem } from '../../models/position.model';
import { LoadState } from '../../shared/loading/load-state';

@Component({
  selector: 'app-position',
  imports: [ReactiveFormsModule],
  templateUrl: './position.html',
  styleUrls: ['./position.scss'],
})
export class Position implements OnInit {
  private readonly positionApi = inject(PositionApiService);
  private readonly destroyRef = inject(DestroyRef);

  readonly positions = signal<PositionItem[]>([]);
  readonly loadState = signal<LoadState>('loading');

  frmPosition = new FormGroup({
    positionName: new FormControl<string | null>(null, Validators.required),
  });

  ngOnInit() {
    this.loadPositions();
  }

  save() {
    const positionName = this.frmPosition.controls.positionName.value;
    if (!positionName) {
      return;
    }
    this.positionApi
      .create({ positionName })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadPositions());
  }

  private loadPositions() {
    this.positionApi
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (positions) => {
          this.positions.set(positions);
          this.loadState.set('ready');
        },
        // The error interceptor already showed the message; the table shows its error state.
        error: () => this.loadState.set('error'),
      });
  }
}
