import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { VolunteeringModule } from '../Models/volunteering/volunteering/volunteering-module';
import { Observable } from 'rxjs';
import { SubProjectService } from './sub-project-service';
import { SubProjectModule } from '../Models/sub-project/sub-project-module';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class VolunteeringService {
  http = inject(HttpClient );

BASE_URL: string = `${environment.apiUrl}/api/Volunteering`;
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
    return this.http.get<VolunteeringModule[]>(this.BASE_URL);
  }
  getVolunteeringById(id:number): Observable<VolunteeringModule[]> {
    return this.http.get<VolunteeringModule[]>(this.BASE_URL+'/'+id);
  }
  addVolunteering(item: VolunteeringModule) {
    return this.http.post(this.BASE_URL, item).subscribe(() => this.refreshData());
  }
  updateVolunteering(item: VolunteeringModule){
    return this.http.put<number>(this.BASE_URL+item.volunteeringCode, item).subscribe(() => this.refreshData());
  }
 
  deleteVolunteering(id: number): Observable<number> {
    return this.http.delete<number>(this.BASE_URL+'/'+id);
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