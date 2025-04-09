import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../user/services/user.service';
import {map} from 'rxjs/operators';
import {catchError, of} from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  let check_status = false;

  userService.checkAuthStatus().pipe(
    map(status => {
      check_status = status.authenticated;
    }),
    catchError(() => of(router.createUrlTree(["/login"])))
  )
  return check_status;
};
