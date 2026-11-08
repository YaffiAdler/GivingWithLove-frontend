import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-volunteer',
  imports: [RouterModule],
  templateUrl: './volunteer.html',
  styleUrl: './volunteer.scss'
})
export class Volunteer {
  private readonly router = inject(Router);

  addVolunteer() {
    this.router.navigate(['/volunteer/addvolunteer/add']);
  }

  allVolunteer() {
    this.router.navigate(['/volunteer/allvolunteers']);
  }
}
