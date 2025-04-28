import { CanActivateFn } from '@angular/router';

export const isManagerGuard: CanActivateFn = (route, state) => {
  return true;
};
