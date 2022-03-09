import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { first, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  authApi = environment.api + '/auth';

  constructor(private http: HttpClient) {}

  login(userLoginInfo: {
    password: string;
    username: string;
  }): Observable<LoginResult> {
    const loginUrl = this.authApi + '/login';
    return this.http.post<LoginResult>(loginUrl, userLoginInfo).pipe(
      first(),
      tap((loginResult) => this.saveLogin(loginResult))
    );
  }

  saveLogin(loginResult: LoginResult) {
    localStorage.setItem('name', loginResult.content?.name as string);
    localStorage.setItem('username', loginResult.content?.username as string);
    localStorage.setItem('jwt_token', loginResult.content?.jwt_token as string);
    localStorage.setItem('userId', loginResult.content?.userId as string);
    localStorage.setItem('roles', loginResult.content?.roles.join('|||') || '');
  }

  logOut() {
    localStorage.removeItem('name');
    localStorage.removeItem('username');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('roles');
  }

  loggedIn() {
    return !!localStorage.getItem('jwt_token');
  }

  getJwtToken() {
    return localStorage.getItem('jwt_token');
  }

  getUsername() {
    return localStorage.getItem('username');
  }

  getRoles() {
    const roles = localStorage.getItem('roles');
    const rolesArray = roles?.split('|||');
    return rolesArray;
  }
}

interface LoginResult {
  message: string;
  code: Number;
  content?: UserLogin;
}

interface UserLogin {
  userId: string;
  username: string;
  name: string;
  jwt_token: string;
  roles: string[];
}
