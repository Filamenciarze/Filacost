import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../../../shared/utilities/services/app-settings/app-settings.service';
import {Status} from '../interfaces/status';
import {User} from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  private isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticated.asObservable();
  public user$: Observable<User | null> = this.user.asObservable();

  setUserData(user: User) {
    this.user.next(user);
  }

  getUserData() {
    return this.user.value;
  }


  checkAuthStatus() {
    return this.httpClient.get<Status>(AppSettingsService.API_URL+'/auth/status/',{})
  }

  authenticate() {
    this.isAuthenticated.next(true);
  }

  remove_authentication() {
    this.isAuthenticated.next(false);
  }
}
