import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpRoute = environment.api + '/auth/client';

  constructor(private http: HttpClient) {}

  getClients(pageIndex: number): Observable<ClientPaginationResult> {
    return this.http
      .get<ClientPaginationResult>(
        this.httpRoute + `?pageIndex=${pageIndex}&&itemsPerPage=100&&order=desc`
      )
      .pipe(first());
  }
}

interface ClientPaginationResult {
  message: string;
  code: number;
  content?: ClientPaginationContent;
}

interface ClientPaginationContent {
  items: Client[];
  pageIndex: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface Client {
  id: number;
  subjectId: number;
  name: string;
  description: string;
  identifier: string;
  hasLongLiveToken?: boolean;
  revoked?: boolean;
  roles: Role[];
}

export interface Role {
  id: number;
  identifier: string;
  resources: Resource[];
}

export interface Resource {
  id: number;
  applicationResourceName: string;
  allowed: Permission[];
}

export interface Permission {
  allowed: string;
  id: number;
}
