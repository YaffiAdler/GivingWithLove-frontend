// import { Directive, inject, Injectable } from '@angular/core';
import { VolunteerDomainModule } from '../Models/volunteer-domain/volunteer-domain-module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directive, inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../core/api-url';
@Injectable({
  providedIn: 'root'
})
@Directive({
  selector: '[appVolunteerDomainService]'
})
export class VolunteerDomainService {
http = inject(HttpClient );
volunteerDomains$: Observable<VolunteerDomainModule[]>;
volunteerDomains:VolunteerDomainModule[]=[];
  domains:number[]=[];
  domainstoadd:VolunteerDomainModule[]=[];
  constructor() { 
    this.volunteerDomains$=this.getAllVolunteerDomain()
  }
  setDomains(domains: number[]) {
  this.domains = [...domains];
}
// --- מתודות CRUD ---
addVolunteerDomain(item: VolunteerDomainModule) {
  return this.http.post(apiUrl('VolunteerDomain'), item);
}
  getAllVolunteerDomain(): Observable<VolunteerDomainModule[]> {
    return this.http.get<VolunteerDomainModule[]>(apiUrl('VolunteerDomain'));
  }
  getVolunteerDomainById(id:number): Observable<VolunteerDomainModule[]> {
    return this.http.get<VolunteerDomainModule[]>(apiUrl('VolunteerDomain', id));
  }
  updateVolunteerDomain(item: VolunteerDomainModule){
    return this.http.put<number>(apiUrl('VolunteerDomain', item.volunteerDomainsCode), item).subscribe(() => this.refreshData());
  }
 
  deleteVolunteerDomain(id: number): Observable<number> {
    return this.http.delete<number>(apiUrl('VolunteerDomain', id));
  }

  existingVolunteerDomain(g: VolunteerDomainModule) {
    return this.volunteerDomains.findIndex(x => x.volunteerDomainsCode == g.volunteerDomainsCode ) >= 0;
  }
   refreshData(){
    this.getAllVolunteerDomain().subscribe(x => this.volunteerDomains = x);
    this.volunteerDomains$=this.getAllVolunteerDomain()
  }
  addDomain(d:any){
  this.domains.push(d);
 }


}
