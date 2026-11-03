import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

// import { PositionModel } from 'd:/RivkyPinter/GWL_Project/GivingWithLove-angular/src/app/Models/PositionModel';
import { Observable } from 'rxjs';
import { PositionModel } from '../Models/PositionModel';
import { apiUrl } from '../core/api-url';

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  http = inject(HttpClient);
positions:PositionModel[]=[];
positions$:Observable<PositionModel[]>;
constructor() { 
    this.positions$=this.getAllPositions()
    this.positions$.subscribe(x => this.positions = x);
  }
  getAllPositions(): Observable<PositionModel[]> {
    return this.http.get<PositionModel[]>(apiUrl('Position'));
  }
  getPositionById(id:number): Observable<PositionModel[]> {
    return this.http.get<PositionModel[]>(apiUrl('Position', id));
  }
  addPosition(item: PositionModel) {
    return this.http.post(apiUrl('Position'), item).subscribe(() => this.refreshData());
  }
  updatePosition(item: PositionModel){
    return this.http.put<number>(apiUrl('Position', item.positionCode), item).subscribe(() => this.refreshData());
  }
 
  deletePosition(id:number) {
    return this.http.delete<number>(apiUrl('Position', id)).subscribe(() => this.refreshData())
  }
   refreshData(){
    this.getAllPositions().subscribe(x => this.positions = x);
    this.positions$=this.getAllPositions()
  }

}
