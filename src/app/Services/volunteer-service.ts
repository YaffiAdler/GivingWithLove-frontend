// import { inject, Injectable } from '@angular/core';
import { VolunteerModel } from '../Models/volunteer/volunteer-module';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { VolunteerDomainModule } from '../Models/volunteering/volunteer-domain/volunteer-domain-module';

import { EichudModel } from '../Models/EichudModel';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../core/api-url';


@Injectable({
  providedIn: 'root'
})
export class VolunteerService {
  http = inject(HttpClient);
  currentUser?:VolunteerModel
  isVolunteerLoggedIn:boolean = false
  volunteers$!: Observable<VolunteerModel[]>;
  volunteers:VolunteerModel[]=[];

    volunteerCodeInS?:number 
    volunteerInS?:VolunteerModel
  setSelectedVolunteer(volunteerCode: number) {
    this.volunteerCodeInS = volunteerCode;
  }
   setSelectedVolunteer2(volunteer: VolunteerModel) {
    this.volunteerInS = volunteer;
  }
  // volunterrDomain:

  userPosition?:string;//מה התפקיד של המשתמש הנוכחי


  getAllVolunteers(): Observable<VolunteerModel[]> {
    return this.http.get<VolunteerModel[]>(apiUrl('Volunteer'));
  }

getVolunteerById(id: number): Observable<VolunteerModel> {
    return this.http.get<VolunteerModel>(apiUrl('Volunteer', id));
}


  addVolunteer(item: VolunteerModel) {
    return this.http.post(apiUrl('Volunteer'), item).subscribe((res) => this.refreshData());
  }
  updateVolunteer(item: VolunteerModel){
    return this.http.put<number>(apiUrl('Volunteer', item.volunteerCode), item).subscribe(() => this.refreshData());
  }
  deleteVolunteer(id: number): Observable<number> {
    return this.http.delete<number>(apiUrl('Volunteer', id));
  }   
  refreshData(){
    this.getAllVolunteers().subscribe(x => this.volunteers = x);
    this.volunteers$=this.getAllVolunteers()
  }


setCurrentUser(password:number){
    this.currentUser = this.volunteers.find(x => x.volunteerCode == password)
    this.isVolunteerLoggedIn = true
   
  }


}


