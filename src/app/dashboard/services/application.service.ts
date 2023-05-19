import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { first, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { BasicRole } from "./role.service";

@Injectable({
    providedIn: 'root',
})

export class ApplicationService {
  httpRoute = environment.api + '/auth/application';

  constructor(private http: HttpClient) {}


  getApplications(): Observable<ApplicationResult> {
    return this.http.get<ApplicationResult>(this.httpRoute);
  }
}

interface ApplicationResult {
    message: string;
    code: number;
    content?: Application[];
  }
  
  export interface Application {
    id: number;
    identifier: string;
  }
  