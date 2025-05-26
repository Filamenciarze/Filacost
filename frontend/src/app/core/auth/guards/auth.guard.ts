import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../../user/services/user.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.checkAuthStatus().pipe(
    map(status => {
      return status.authenticated ? true : router.createUrlTree(['/login']);
    }),
    catchError(() => {
      // If check fails, redirect to login
      return of(router.createUrlTree(['/login']));
    })
  );
};
