import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Role} from '../../enums/Role';

export const isManagerGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  let isManager = false;
  let user = userService.getUserData();

  if(!!user) {
    isManager = user.role === Role.MANAGER;
  }

  return isManager;
};
