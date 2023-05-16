import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root',
})

export class RoleService {
    httpRoute = environment.api + '/auth/role';

    constructor(private http: HttpClient) {}

    getRolesBasic(): Observable<RoleResult> {
        return this.http
          .get<RoleResult>(this.httpRoute + '?basic=true')
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