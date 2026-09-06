import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SubProjectModule } from '../Models/sub-project/sub-project-module';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubProjectService {
   http = inject(HttpClient );
BASE_URL: string = `${environment.apiUrl}/api/SubProject`;
Projects$: Observable<SubProjectModule[]>= this.getAllProjects();
Projects:SubProjectModule[]=[];
  constructor() { 
    this.refreshData()
    // this.Projects$=this.getAllProjects()
    // this.Projects$.subscribe(x => this.Projects = x);
  }
// --- מתודות CRUD ---
  getAllProjects(): Observable<SubProjectModule[]> {
    return this.http.get<SubProjectModule[]>(this.BASE_URL);
  }
  getProjectById(id:number): Observable<SubProjectModule[]> {
    return this.http.get<SubProjectModule[]>(this.BASE_URL +id);
  }
  // addProject(item: SubProjectModule) {
  //   return this.http.post(this.BASE_URL, item).subscribe(() => this.refreshData());
  // }
  // updateProject(item: SubProjectModule){
  //   return this.http.put<number>(this.BASE_URL+'Put/'+item.projectCode, item).subscribe(() => this.refreshData());
  // }
  addProject(item: SubProjectModule) {
  this.http.post(this.BASE_URL, item).pipe(
    tap(() => this.refreshData()) // מעדכן את הנתונים אחרי הוספה
  ).subscribe();
}

updateProject(item: SubProjectModule) {
  this.http.put<number>(this.BASE_URL + 'Put/' + item.projectCode, item).pipe(
    tap(() => this.refreshData()) // מעדכן את הנתונים אחרי עדכון
  ).subscribe();
}
 
  deleteProject(name: string): Observable<number> {
        return this.http.delete<number>(this.BASE_URL+'Delete/'+name);
  }

  existingProject(g: SubProjectModule) {
    return this.Projects.findIndex(x => x.projectCode == g.projectCode ) >= 0;
  }
   refreshData(){
    this.getAllProjects().subscribe(x => this.Projects = x);
    this.Projects$=this.getAllProjects()
  }
}
