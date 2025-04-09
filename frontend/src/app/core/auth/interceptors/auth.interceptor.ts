import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {catchError, switchMap, throwError} from 'rxjs';
import {UserService} from '../../user/services/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const userService = inject(UserService);
  const request = req.clone({withCredentials: true});

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401 && !req.url.endsWith('/token/refresh/')) {
        return authService.refreshToken().pipe(
          switchMap((res) => {
            const retryRequest = req.clone({withCredentials: true})
            userService.authenticate();
            return next(retryRequest);
          }),
          catchError(error => {
            authService.logout();
            return throwError(() => error);
        })
        );
      }

      return throwError(() => error);
    })
  )
};
