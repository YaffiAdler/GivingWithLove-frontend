import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePosition, Position, UpdatePosition } from '../../models/position.model';
import { apiUrl } from '../api-url';

const RESOURCE = 'Position';

@Injectable({ providedIn: 'root' })
export class PositionApiService {
  private readonly http = inject(HttpClient);

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(apiUrl(RESOURCE));
  }

  getById(id: number): Observable<Position> {
    return this.http.get<Position>(apiUrl(RESOURCE, id));
  }

  create(position: CreatePosition): Observable<Position> {
    return this.http.post<Position>(apiUrl(RESOURCE), position);
  }

  update(position: UpdatePosition): Observable<void> {
    return this.http.put<void>(apiUrl(RESOURCE, position.positionCode), position);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(apiUrl(RESOURCE, id));
  }
}
