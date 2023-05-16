import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BasicRole } from "./role.service";

@Injectable({
    providedIn: 'root',
})

export class UserService {
  httpRoute = environment.api + '/auth/user';

  constructor(private http: HttpClient) {}

  getUsers(pageIndex: number, order: string): Observable<UserPaginationResult> {
      return this.http
        .get<UserPaginationResult>(
          this.httpRoute +
            `?pageIndex=${pageIndex}&&itemsPerPage=20&&order=${order}`
        )
      .pipe(first());
  }

  createUser(createUserData: {
      name: string;
      username: string;
      password: string;
      roles: BasicRole[];
    }) {
      return this.http.post(this.httpRoute, createUserData).pipe(first());
  }

  updateUser(subjectId: number, updateBody: UserUpdateBody) {
      return this.http
        .put(`${this.httpRoute}/${subjectId}`, updateBody)
        .pipe(first());
  }

  deleteUser(subjectId: number) {
    return this.http.delete(`${this.httpRoute}/${subjectId}`).pipe(first());
  }

  updateUserRoles(
      userId: number,
      roles: BasicRole[],
      originalRolesList: BasicRole[]
  ) {
  return this.http
      .put(`${this.httpRoute}/${userId}/role`, { roles, originalRolesList })
      .pipe(first());
  }
}

interface PaginationUserContent {
    items: User[];
    pageIndex: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  }
  
interface UserPaginationResult {
    message: string;
    code: number;
    content?: PaginationUserContent;
}

export interface UserUpdateBody {
  name: string;
}

export interface BasicResource {
  id: number;
  applicationResourceName: string;
  allowed: string[];
}

interface RoleUser {
  id: number;
  identifier: string;
  resources: BasicResource[];
}
export interface User {
  id: number;
  subjectId: number;
  description: string;
  name: string;
  username: string;
  roles: RoleUser[];
}
