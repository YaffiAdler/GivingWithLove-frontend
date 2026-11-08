import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../core/notifications/notification.service';
import { Project } from '../../models/project.model';

/** One "volunteering domain" row: pick a project and add it to the volunteer's domains. */
@Component({
  selector: 'app-volunteer-domain',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './volunteer-domain.html',
  styleUrl: './volunteer-domain.scss'
})
export class VolunteerDomain implements OnInit {
  private readonly notifications = inject(NotificationService);

  readonly projects = input.required<Project[]>();
  /** A domain the volunteer already has; shown as the selected project. */
  readonly domain = input<number | null>(null);
  readonly domainAdded = output<number>();

  vlntrDmnFrm = new FormGroup({
    domain: new FormControl<number | null>(null),
  });

  ngOnInit() {
    this.vlntrDmnFrm.patchValue({ domain: this.domain() });
  }

  addDomain() {
    const projectCode = this.vlntrDmnFrm.controls.domain.value;
    if (projectCode !== null && projectCode > 0) {
      this.domainAdded.emit(projectCode);
    } else {
      this.notifications.error('מלאו קודם תחום התנדבות');
    }
  }
}
