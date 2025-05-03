import { Injectable } from '@angular/core';
import {Route, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {User} from '../../user/interfaces/user';
import {AppSettingsService} from '../../../shared/utilities/services/app-settings/app-settings.service';
import {UserService} from '../../user/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private userService: UserService,
  ) {
  }

  login(email: string, password: string) {
    return this.httpClient.post<User>(AppSettingsService.API_URL+'/auth/login/',{email:email,password:password}, {withCredentials: true})
  }

  register(email: string, password: string) {
    return this.httpClient.post<any>(AppSettingsService.API_URL+'/auth/register/', {email:email, password:password})
  }

  logout() {
    this.httpClient.post<any>(AppSettingsService.API_URL+'/auth/logout/',{}).subscribe({
      next: value => {
        this.router.navigate(['/login']).then(() => {
          this.userService.remove_authentication();
        });
      }
    });
  }

  refreshToken() {
    return this.httpClient.post<any>(AppSettingsService.API_URL+'/auth/token/refresh/',{})
  }


}
