import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  httpRoute = environment.api + '/action';

  constructor(private http: HttpClient) {}

  createAction(
    createActionDto: CreateActionDto
  ): Observable<CreateActionResult> {
    return this.http
      .post<CreateActionResult>(this.httpRoute, { ...createActionDto })
      .pipe(first());
  }

  getActions(
    activeSort: string,
    order: string,
    pageIndex: number,
    itemsPerPage: number
  ) {
    let queryString = `?activeSort=${activeSort}&order=${order}&pageIndex=${pageIndex}&itemsPerPage=${itemsPerPage}`;
    return this.http
      .get<ActionPaginationResult>(this.httpRoute + queryString)
      .pipe(first());
  }

  deleteAction(actionId: number) {
    return this.http.delete(this.httpRoute + `/${actionId}`);
  }
}

interface ActionPaginationResult {
  message: string;
  code: number;
  content?: ActionPaginationContent;
}

interface ActionPaginationContent {
  items: Action[];
  pageIndex: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface CreateActionResult {
  message: string;
  code: number;
  content: { actionId: number };
}

export interface CreateActionDto {
  system_id: number;
  name: string;
  operation: string;
  description: string;
  method: string;
  securityType: number;
  url: string;
  securityUrl: string;
  jsonPath: string;
  identifier?: string;
  headers: { key: string; value: string | number }[];
  body: { key: string; value: string | number }[];
  queryUrlParams: { key: string; value: string | number }[];
  username?: string;
  password?: string;
  clientSecret?: string;
  clientId?: number;
}

export interface Action {
  id: number;
  system_id: number;
  identifier: string;
  name: string;
  operation: string;
  description: string;
  deleted: boolean;
  created_at: Date;
  updated_at: Date;
}
