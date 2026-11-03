import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SubProjectModule } from '../Models/sub-project/sub-project-module';
import { apiUrl } from '../core/api-url';

@Injectable({
  providedIn: 'root'
})
export class SubProjectService {
   http = inject(HttpClient );
Projects$: Observable<SubProjectModule[]>= this.getAllProjects();
Projects:SubProjectModule[]=[];
  constructor() { 
    this.refreshData()
    // this.Projects$=this.getAllProjects()
    // this.Projects$.subscribe(x => this.Projects = x);
  }
// --- מתודות CRUD ---
  getAllProjects(): Observable<SubProjectModule[]> {
    return this.http.get<SubProjectModule[]>(apiUrl('SubProject'));
  }
  getProjectById(id:number): Observable<SubProjectModule[]> {
    return this.http.get<SubProjectModule[]>(apiUrl('SubProject', id));
  }
  addProject(item: SubProjectModule) {
  this.http.post(apiUrl('SubProject'), item).pipe(
    tap(() => this.refreshData()) // מעדכן את הנתונים אחרי הוספה
  ).subscribe();
}

updateProject(item: SubProjectModule) {
  this.http.put<number>(apiUrl('SubProject', item.subProjectCode), item).pipe(
    tap(() => this.refreshData()) // מעדכן את הנתונים אחרי עדכון
  ).subscribe();
}
 
  deleteProject(id: number): Observable<number> {
        return this.http.delete<number>(apiUrl('SubProject', id));
  }

  existingProject(g: SubProjectModule) {
    return this.Projects.findIndex(x => x.projectCode == g.projectCode ) >= 0;
  }
   refreshData(){
    this.getAllProjects().subscribe(x => this.Projects = x);
    this.Projects$=this.getAllProjects()
  }
}
