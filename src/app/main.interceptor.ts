import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from './login/services/login.service';

@Injectable()
export class MainInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let requestToSend = request;
    if (this.loginService.loggedIn()) {
      const secureRequest = request.clone({
        setHeaders: {
          Authorization: `BEARER ${this.loginService.getJwtToken()}`,
        },
        // withCredentials: true,
      });
      requestToSend = secureRequest;
    }
    return next.handle(requestToSend).pipe(
      catchError((error) => {
        if (
          (error.status === 401 || error.status === 403) &&
          this.loginService.loggedIn()
        ) {
          this.loginService.logOut();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
