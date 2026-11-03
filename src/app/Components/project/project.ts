import { Component, inject } from '@angular/core';
import { ProjectModule } from '../../Models/project/project-module';
import { ProjectService } from '../../Services/project-service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';

import { VolunteerService } from '../../Services/volunteer-service';


@Component({
  selector: 'app-project',
  imports: [AsyncPipe,ReactiveFormsModule],
  templateUrl: './project.html',
  styleUrl: './project.scss'
})
export class Project {
vlntService: VolunteerService = inject(VolunteerService);
  projectsArr: ProjectModule[] = [];

  projectService = inject(ProjectService)
  // volunteerService = inject(VolunteerService)
  ngOnInit() {
    this.projectService.getAllProjects().subscribe(res => { this.projectsArr = res })
  }
 
  frm = new FormGroup({
    // volunteeringCode: new FormControl<number | null>(null, Validators.required),
    projectName: new FormControl<string | null>(null, Validators.required),
    projectManagerCode: new FormControl<number | null>(null),
    domainCode: new FormControl<number | null>(null)
      });

  addProject() {
    if (this.frm.valid) {
      const project = {
        // volunteeringCode: this.vlntrFrm.controls['volunteerCode'].value!,
        projectName: this.frm.value.projectName!,
        projectManagerCode: this.frm.value.projectManagerCode!,
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
