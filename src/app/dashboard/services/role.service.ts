import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Option, Resource } from "./resource.service";

@Injectable({
    providedIn: 'root',
})

export class RoleService {
    httpRoute = environment.api + '/auth/role';

    constructor(private http: HttpClient) { }

    getRoles(pageIndex: number, order: string): Observable<RolePaginationResult> {
        return this.http
            .get<RolePaginationResult>(
                this.httpRoute +
                `?pageIndex=${pageIndex}&&itemsPerPage=20&&order=${order}`
            )
            .pipe(first());
    }
    getRolesBasic(): Observable<RoleResult> {
        return this.http
            .get<RoleResult>(this.httpRoute + '?basic=true')
            .pipe(first());
    }


    createRole(identifier: string, allowedObject: Record<string, Option[]>) {
        return this.http
            .post(this.httpRoute, { identifier, allowedObject })
            .pipe(first());
    }

    deleteRole(roleId: number) {
        return this.http.delete(this.httpRoute + `/${roleId}`).pipe(first());
    }

    updateRoleOptions(
        roleId: number,
        newAllowedObject: Record<string, Option[]>,
        originalAllowedObject: Record<string, Option[]>
      ) {
        return this.http
          .put(this.httpRoute + `/${roleId}/permission`, {
            newAllowedObject: newAllowedObject,
            originalAllowedObject: originalAllowedObject,
          })
          .pipe(first());
      }
}

export interface BasicRole {
    id: number;
    identifier: string;
}

interface RoleResult {
    message: string;
    code: number;
    content?: BasicRole[];
}

export interface Role {
    id: number;
    identifier: string;
    resources: Resource[];
}

interface RolePaginationResult {
    message: string;
    code: number;
    content?: RolePaginationContent;
}

interface RolePaginationContent {
    items: Role[];
    pageIndex: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}
