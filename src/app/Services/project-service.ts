import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectModule } from '../Models/project/project-module';
import { Volunteer } from '../Components/volunteer/volunteer';
import { VolunteerDomainModule } from '../Models/volunteer-domain/volunteer-domain-module';
import { VolunteerService } from './volunteer-service';
import { VolunteeringModule } from '../Models/volunteering/volunteering/volunteering-module';
import { apiUrl } from '../core/api-url';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  http = inject(HttpClient);
  Projects$!: Observable<ProjectModule[]>;
  projects: ProjectModule[] = [];
  VolunteerDomain: VolunteerDomainModule[] = [];
  volunteeringArr: VolunteeringModule[] = [];
  volunteerSrv = inject(VolunteerService)
  project: ProjectModule = new ProjectModule();
  estimatedCost: number = 0;
  estimatedTime: number = 0;

  constructor() {
    this.refreshData()
  }
  // --- מתודות CRUD ---
  getAllProjects(): Observable<ProjectModule[]> {
        this.dataPerProject()

    return this.http.get<ProjectModule[]>(apiUrl('Project'));
  }
  getProjectById(id: number): Observable<ProjectModule> {
    return this.http.get<ProjectModule>(apiUrl('Project', id));
  }
  addProject(item: ProjectModule) {
    return this.http.post(apiUrl('Project'), item).subscribe(() => this.refreshData());
  }
  updateProject(item: ProjectModule) {
    return this.http.put<number>(apiUrl('Project', item.projectCode), item).subscribe(() => this.refreshData());
  }

  deleteProject(id: number): Observable<number> {
    return this.http.delete<number>(apiUrl('Project', id));
  }

  existingProject(g: ProjectModule) {
    return this.projects.findIndex(x => x.projectCode == g.projectCode) >= 0;
  }
  refreshData() {
    this.Projects$ = this.getAllProjects()

    this.Projects$.subscribe(x => this.projects = x);
    for (let index = 0; index < this.projects.length; index++) {
      // this.dataPerProject();
    }
  }

  //   dataPerProject(projectCode: number){
  //     for (let index = 0; index < this.VolunteerDomain.length; index++) {
  //       if (this.VolunteerDomain[index].projectCode === projectCode) {
  //         var volunteerCode = this.VolunteerDomain[index].volunteerCode;
  //         if (volunteerCode !== undefined) {
  //           this.volunteerSrv.getVolunteerById(Number(volunteerCode)).subscribe(volunteer => {
  //             this.volounteerArrPerProject.push(volunteer);
  //           });
  //         }
  //       }
  //     }
  // this.project.volunteersPerProject =[...this.volounteerArrPerProject];


  //   } 
  dataPerProject() {
    for (let index = 0; index < this.projects.length; index++) {
      this.estimatedCost = 0;
      this.estimatedTime = 0;
      this.projects[index].volunteeringArrToProject = [];
      for (let index2 = 0; index2 < this.volunteeringArr.length; index2++) {
        if (this.volunteeringArr[index2].projectCode == this.projects[index].projectCode) {
          (this.projects[index].volunteeringArrToProject ??= []).push(this.volunteeringArr[index2]);
        }
      }

      for (let i = 0; i < (this.projects[index].volunteeringArrToProject?.length ?? 0); i++) {

        if (this.projects[index]?.subProjects) {

          for (let index2 = 0; index2 < (this.projects[index]?.subProjects?.length ?? 0); index2++) {

            const volunteering = this.projects[index].volunteeringArrToProject?.[i];
            const subProject = this.project.subProjects?.[index2];

            if (
              volunteering &&
              subProject &&
              volunteering.subProjectCode === subProject.subProjectCode
            ) {
              this.projects[index].estimatedCost =
                (this.projects[index].estimatedCost ?? 0) +
                (subProject.estimatedCost ?? 0);

              this.projects[index].estimatedTime =
                (this.projects[index].estimatedTime ?? 0) +
                (subProject.estimatedTime ?? 0);
            }
          }
        }
      }
    }

  }

}
