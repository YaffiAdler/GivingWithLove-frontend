import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { VolunteeringModule } from '../Models/volunteering/volunteering/volunteering-module';
import { Observable } from 'rxjs';
import { SubProjectService } from './sub-project-service';
import { SubProjectModule } from '../Models/sub-project/sub-project-module';
import { apiUrl } from '../core/api-url';

@Injectable({
  providedIn: 'root'
})

export class VolunteeringService {
  http = inject(HttpClient );

volunteerings$!: Observable<VolunteeringModule[]>;
subProjectsrv=inject(SubProjectService)
volunteerings:VolunteeringModule[]=[];
dateOfVolunteeringInS!:Date 
    volunteerCodeInS?:number 

    poorManCodeInS?:number

    matcherCodeInS? :number

    projectCodeInS?:number 

    subProjectCodeInS?:number

    constructor() {
    this.refreshData()
  }
  setSelectedVolunteer(volunteerCode: number) {
    this.volunteerCodeInS = volunteerCode;
  }
  setSelectedPoorMan(poorManCode: number) {
    this.poorManCodeInS = poorManCode;
  }
  setSelectedMatcher(matcherCode: number) {
    this.matcherCodeInS = matcherCode;
  }
  setSelectedProject(projectCode: number) {
    this.projectCodeInS = projectCode;
  }
  setSelectedSubProject(subProjectCode: number) {
    this.subProjectCodeInS = subProjectCode;
  }


  getAllVolunteerings(): Observable<VolunteeringModule[]> {
    return this.http.get<VolunteeringModule[]>(apiUrl('Volunteering'));
  }
  getVolunteeringById(id:number): Observable<VolunteeringModule[]> {
    return this.http.get<VolunteeringModule[]>(apiUrl('Volunteering', id));
  }
  addVolunteering(item: VolunteeringModule) {
    return this.http.post(apiUrl('Volunteering'), item).subscribe(() => this.refreshData());
  }
  updateVolunteering(item: VolunteeringModule){
    return this.http.put<number>(apiUrl('Volunteering', item.volunteeringCode), item).subscribe(() => this.refreshData());
  }
 
  deleteVolunteering(id: number): Observable<number> {
    return this.http.delete<number>(apiUrl('Volunteering', id));
  }

  existingVolunteering(g: VolunteeringModule) {
    return this.volunteerings.findIndex(x => x.volunteeringCode == g.volunteeringCode ) >= 0;
  }
  refreshData() {
  this.getAllVolunteerings().subscribe(x => {
    this.volunteerings = x;
  });
    this.volunteerings$ = this.getAllVolunteerings();
}
  calcCost(): Observable<number> {
  return new Observable<number>(observer => {

    this.getAllVolunteerings().subscribe(x => {

      this.volunteerings = x;

      let sum = 0;

      for (let index = 0; index < this.volunteerings.length; index++) {

        if (this.volunteerings[index].subProjectCode != undefined) {

          sum += Number(
            this.subProjectsrv.Projects.find(
              p => p.projectCode == this.volunteerings[index].subProjectCode
            )?.estimatedCost || 0
          );
        }
      }

      observer.next(sum);
      observer.complete();
    });
  });
}
}