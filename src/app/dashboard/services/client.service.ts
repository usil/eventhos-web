import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BasicRole, Role } from './role.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  httpRoute = environment.api + '/auth/client';

  constructor(private http: HttpClient) {}

  getClients(
    pageIndex: number,
    order?: string
  ): Observable<ClientPaginationResult> {
    return this.http
      .get<ClientPaginationResult>(
        this.httpRoute +
          `?pageIndex=${pageIndex}&&itemsPerPage=20&&order=${order}`
      )
      .pipe(first());
  }

  getSecret(clientId: number): Observable<SecretTokenResponse> {
    return this.http
      .get<SecretTokenResponse>(this.httpRoute + `/${clientId}/secret`)
      .pipe(first());
  }

  generateLongLiveToken(
    clientId: number,
    identifier: string
  ): Observable<LongLiveTokenResponse> {
    return this.http
      .put<LongLiveTokenResponse>(
        this.httpRoute + `/${clientId}/long-live`,
        {
          identifier,
        }
      )
      .pipe(first());
  }

  removeLongLiveToken(
    clientId: number,
    identifier: string
  ): Observable<BasicResponse> {
    return this.http
      .put<BasicResponse>(
        this.httpRoute + `/${clientId}/long-live?remove_long_live=true`,
        {
          identifier,
        }
      )
      .pipe(first());
  }

  modifyRevokeStatus(clientId: number, revoke: boolean) {
    return this.http
      .put<BasicResponse>(this.httpRoute + `/${clientId}/revoke`, {
        revoke,
      })
      .pipe(first());
  }

  updateClient(subjectId: number, updateBody: ClientUpdateBody) {
    return this.http
      .put(`${this.httpRoute}/${subjectId}`, updateBody)
      .pipe(first());
  }

  deleteClient(subjectId: number) {
    return this.http.delete(`${this.httpRoute}/${subjectId}`).pipe(first());
  }

  createClient(
    createClientData: {
      name: string;
      identifier: string;
      roles: BasicRole[];
    },
    longLive: boolean
  ): Observable<ClientCreateResult> {
    return this.http
      .post<ClientCreateResult>(
        this.httpRoute + `?longLive=${longLive}`,
        createClientData
      )
      .pipe(first());
  }

  updateClientRoles(
    clientId: number,
    roles: BasicRole[],
    originalRolesList: BasicRole[]
  ) {
    return this.http
      .put(`${this.httpRoute}/${clientId}/role`, {
        roles,
        originalRolesList,
      })
      .pipe(first());
  }
}

interface ClientPaginationResult {
  message: string;
  code: number;
  content?: ClientPaginationContent;
}

interface BasicResponse {
  message: string;
  code: number;
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
export interface ClientCreateContent {
  clientSecret: string;
  clientId: string;
  access_token: string;
}

interface SecretTokenResponse {
  message: string;
  code: number;
  content: {
    clientSecret: string;
  };
}

interface LongLiveTokenResponse {
  message: string;
  code: number;
  content: {
    access_token: string;
  };
}

export interface ClientUpdateBody {
  name: string;
}

interface ClientCreateResult {
  message: string;
  code: number;
  content?: ClientCreateContent;
}

export interface Permission {
  allowed: string;
  id: number;
}
