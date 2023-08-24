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
    itemsPerPage: number,
    filters?: {wordSearch: string}
  ) {
    let queryString = `?activeSort=${activeSort}&order=${order}&pageIndex=${pageIndex}&itemsPerPage=${itemsPerPage}`;
    if (filters && filters.wordSearch && filters.wordSearch !== "") {
      queryString += `&wordSearch=${filters.wordSearch}`;
    }
    return this.http
      .get<ActionPaginationResult>(this.httpRoute + queryString)
      .pipe(first());
  }

  getAction(actionId: number): Observable<GetActionResponse> {
    return this.http
      .get<GetActionResponse>(this.httpRoute + `/${actionId}`)
      .pipe(first());
  }

  editAction(actionId: number, editActionDto: EditActionDto) {
    return this.http
      .put(this.httpRoute + `/${actionId}`, editActionDto)
      .pipe(first());
  }

  deleteAction(actionId: number) {
    return this.http.delete(this.httpRoute + `/${actionId}`);
  }
}

interface GetActionResponse {
  message: string;
  code: number;
  content?: FullAction;
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
  identifier?: string;
  headers: { key: string; value: string | number }[];
  body?: { key: string; value: string | number }[];
  rawBody?: Record<string, any> | Record<string, any>[] | string[] | string;
  queryUrlParams: { key: string; value: string | number }[];
  clientSecret?: string;
  clientId?: number;
  rawFunctionBody: string;
  reply_to: string;
}

export interface EditActionDto {
  name: string;
  operation: string;
  description: string;
  method: string;
  securityType: number;
  url: string;
  securityUrl: string;
  headers: { key: string; value: string | number }[];
  rawBody?: Record<string, any> | Record<string, any>[] | string[] | string;
  queryUrlParams: { key: string; value: string | number }[];
  clientSecret?: string;
  clientId?: number;
  reply_to?: string;
}

export interface Action {
  id: number;
  system_id: number;
  identifier: string;
  name: string;
  operation: string;
  description: string;
  deleted: boolean;
  reply_to:string;
  created_at: Date;
  updated_at: Date;
}

export interface ActionWithSystem extends Action {
  system_name: string
}

export interface FullAction {
  id: number;
  system_id: number;
  identifier: string;
  name: string;
  operation: string;
  description: string;
  deleted: boolean;
  reply_to:string;
  httpConfiguration: {
    rawFunctionBody?: string;
    url: string;
    method: string;
    headers: Record<any, string | string[]>;
    params: Record<any, string | string[]>;
    data: Record<any, any>;
  };
  security: {
    type: string;
    httpConfiguration?: {
      url: string;
      method: string;
      headers: Record<any, string | string[]>;
      params: Record<any, string | string[]>;
      data: Record<any, any>;
    };
  };
  created_at: Date;
  updated_at: Date;
}
