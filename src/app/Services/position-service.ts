import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

// import { PositionModel } from 'd:/RivkyPinter/GWL_Project/GivingWithLove-angular/src/app/Models/PositionModel';
import { Observable } from 'rxjs';
import { PositionModel } from '../Models/PositionModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  http = inject(HttpClient);
BASE_URL: string = `${environment.apiUrl}/api/Position/`;
positions:PositionModel[]=[];
positions$:Observable<PositionModel[]>;
constructor() { 
    this.positions$=this.getAllPositions()
    this.positions$.subscribe(x => this.positions = x);
  }
  getAllPositions(): Observable<PositionModel[]> {
    return this.http.get<PositionModel[]>(this.BASE_URL);
  }
  getPositionById(id:number): Observable<PositionModel[]> {
    return this.http.get<PositionModel[]>(this.BASE_URL+id);
  }
  addPosition(item: PositionModel) {
    return this.http.post(this.BASE_URL,item).subscribe(() => this.refreshData());
  }
  updatePosition(item: PositionModel){
    return this.http.put<number>(this.BASE_URL+item.positionCode, item).subscribe(() => this.refreshData());
  }
 
  deletePosition(id:number) {
    return this.http.delete<number>(this.BASE_URL+id).subscribe(() => this.refreshData())
  }
   refreshData(){
    this.getAllPositions().subscribe(x => this.positions = x);
    this.positions$=this.getAllPositions()
  }

}
