import { Component, inject } from '@angular/core';
import { ProjectModule } from '../../Models/project/project-module';
import { ProjectService } from '../../Services/project-service';
import { VolunteerService } from '../../Services/volunteer-service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Project } from '../project/project';
import { SubProject } from '../sub-project/sub-project';

@Component({
  selector: 'app-domains',
  imports: [RouterOutlet,RouterModule,Project,SubProject],
  templateUrl: './domains.html',
  styleUrl: './domains.scss',
})
export class Domains {
projectsArr: ProjectModule[] = [];
  projectService = inject(ProjectService)
  vlntService=inject(VolunteerService)
  // volunteerService = inject(VolunteerService)
  ngOnInit() {
    this.projectService.getAllProjects().subscribe( res => {this.vlntService.refreshData();
       this.projectsArr = res })
  }
   frm = new FormGroup({
    // volunteeringCode: new FormControl<number | null>(null, Validators.required),
    projectName: new FormControl<string | null>(null, Validators.required),
    projectManager: new FormControl<number | null>(null),
    domainCode: new FormControl<number | null>(null)
      });
  addProject() {
    if (this.frm.valid) {
      const project = {
        // volunteeringCode: this.vlntrFrm.controls['volunteerCode'].value!,
        projectName: this.frm.value.projectName!,
        projectManagerCode: this.frm.value.projectManager!,
        domainCode: this.frm.value.domainCode!,
       
      }
      this.projectService.addProject(project);
    }
  }
  updateProject(p: ProjectModule) {
    this.projectService.updateProject(p);
  }

  getProject() {
    this.projectService.getAllProjects().subscribe(res => { this.projectsArr = res })
  }
}
