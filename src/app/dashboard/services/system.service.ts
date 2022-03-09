import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { first, Observable } from 'rxjs';
import { Event } from './event.service';
import { Action } from './action.service';

@Injectable({
  providedIn: 'root',
})
export class SystemService {
  httpRoute = environment.api + '/system';

  constructor(private http: HttpClient) {}

  createSystem(systemDto: CreateSystemDto): Observable<CreateSystemResult> {
    return this.http
      .post<CreateSystemResult>(this.httpRoute, { ...systemDto })
      .pipe(first());
  }

  getSystems(
    activeSort: string,
    order: string,
    pageIndex: number,
    itemsPerPage: number,
    systemClass?: string
  ): Observable<SystemPaginationResult> {
    let queryString = `?activeSort=${activeSort}&order=${order}&pageIndex=${pageIndex}&itemsPerPage=${itemsPerPage}`;
    if (systemClass) {
      queryString += `&systemClass=${systemClass}`;
    }
    return this.http
      .get<SystemPaginationResult>(this.httpRoute + queryString)
      .pipe(first());
  }

  getSystemEvents(systemId: number) {
    return this.http
      .get<GetSystemEvents>(this.httpRoute + `/${systemId}/events`)
      .pipe(first());
  }

  getSystemActions(systemId: number) {
    return this.http
      .get<GetSystemActions>(this.httpRoute + `/${systemId}/actions`)
      .pipe(first());
  }

  editSystem(systemId: number, systemUpdateDto: SystemUpdateDto) {
    return this.http
      .put(this.httpRoute + `/${systemId}`, { ...systemUpdateDto })
      .pipe(first());
  }

  deleteSystem(systemId: number) {
    return this.http.delete(this.httpRoute + `/${systemId}`);
  }
}

export interface SystemUpdateDto {
  name: string;
  type: string;
  description: string;
  systemClass: string;
  clientId?: number;
}

interface GetSystemEvents {
  message: string;
  code: number;
  content: Event[];
}

interface GetSystemActions {
  message: string;
  code: number;
  content: Action[];
}

interface CreateSystemResult {
  message: string;
  code: number;
  content: { systemId: number };
}

export interface CreateSystemDto {
  identifier: string;
  name: string;
  type: string;
  systemClass: string;
  description: string;
  clientId: number;
}

interface SystemPaginationResult {
  message: string;
  code: number;
  content?: SystemPaginationContent;
}

interface SystemPaginationContent {
  items: System[];
  pageIndex: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface System {
  id: number;
  client_id: number;
  class: string;
  identifier: string;
  name: string;
  type: string;
  description: string;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
