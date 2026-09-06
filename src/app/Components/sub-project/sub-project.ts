import { Component, inject } from '@angular/core';
import { SubProjectService } from '../../Services/sub-project-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SubProjectModule } from '../../Models/sub-project/sub-project-module';
import { ProjectModule } from '../../Models/project/project-module';
import { ProjectService } from '../../Services/project-service';
import { CommonModule } from '@angular/common';
import { VolunteeringService } from '../../Services/volunteering-service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-sub-project',
  imports: [CommonModule,RouterModule],
  templateUrl: './sub-project.html',
  styleUrl: './sub-project.scss'
})
export class SubProject {
  filteredSubProjects: SubProjectModule[] = [];
  filteredProjects: ProjectModule[] = [];
  Projects: ProjectModule[] = [];
  subProjects: SubProjectModule[] = [];
  ProjectService = inject(ProjectService)
  subProjectService = inject(SubProjectService)
  projectCode!: string | null;
  projectName!: string | null;
  router=inject(Router)
  flag:boolean=false
  volunteeringSrv=inject(VolunteeringService)
  constructor(private route: ActivatedRoute) { }

  async ngOnInit() {
    this.projectCode = this.route.snapshot.paramMap.get('id');
    this.projectName = this.route.snapshot.paramMap.get('name');

    // טען את כל הפרויקטים
    try {
      this.Projects = await lastValueFrom(this.ProjectService.getAllProjects());
      this.filteredProjects = this.Projects.filter(sp => sp.domainCode?.toString() === this.projectCode);
    } catch (err) {
      console.error('Failed to load projects', err);
    }

    // טען את כל תתי-הפרויקטים
    try {
      this.subProjects = await lastValueFrom(this.subProjectService.getAllProjects());
    } catch (err) {
      console.error('Failed to load sub-projects', err);
    }
    this.filteredSubProjects = [];
    for (let sp of this.filteredProjects) {
      this.filteredSubProjects.push(...this.subProjects.filter(x => x.projectCode === sp.projectCode));
    }
  }
   async goToVolunteering(p:any){
   await this.volunteeringSrv.setSelectedProject(Number(p.projectCode));
   await this.volunteeringSrv.setSelectedSubProject(Number(p.subProjectCode));
    this.router.navigate(['/v']);

  }}

