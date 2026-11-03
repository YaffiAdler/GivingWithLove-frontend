import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {EichudModel}from '../Models/EichudModel';
import { Observable, of, tap } from 'rxjs';
// import {EichudModel}from 'd:/RivkyPinter/GWL_Project/GivingWithLove-angular/src/app/Models/EichudModel'
import { UserModel } from '../Models/user/user-model/user-model';
import { apiUrl } from '../core/api-url';

@Injectable({
  providedIn: 'root'
})
export class EichudService {
  http = inject(HttpClient);
peopleInTheEichud:EichudModel[]=[];
peopleInTheEichud$!:Observable<EichudModel[]>;

constructor(){
  this.refreshData()
}


// --- מתודות CRUD ---
  getAllEichud(): Observable<EichudModel[]> {
    return this.http.get<EichudModel[]>(apiUrl('Eichud'));
  }
  getPersonById(id:number): Observable<EichudModel[]> {
    return this.http.get<EichudModel[]>(apiUrl('Eichud', id));
  }
  addPerson(item: EichudModel) {
    return this.http.post(apiUrl('Eichud'), item).subscribe(() => this.refreshData());
  }
  updatePerson(item: EichudModel){
    return this.http.put<number>(apiUrl('Eichud', item.eichudCode), item).subscribe(() => this.refreshData());
  }
 
  deletePerson(id:number): Observable<number> {
    return this.http.delete<number>(apiUrl('Eichud', id));
  }
   
   refreshData(){
    this.getAllEichud().subscribe(x => this.peopleInTheEichud = x);
     this.peopleInTheEichud$=this.getAllEichud()
  }

}
