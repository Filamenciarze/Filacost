import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../../../shared/utilities/services/app-settings/app-settings.service';
import {Profile} from '../interfaces/profile';
import {Observable} from 'rxjs';
import {Address} from '../interfaces/address';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private http: HttpClient
  ) { }

  getProfile() {
    return this.http.get<Profile>(AppSettingsService.API_URL+'/auth/profile/');
  }

  updateProfile(profile: Profile): Observable<Profile> {
    return this.http.put<Profile>(AppSettingsService.API_URL+'/auth/profile/', profile);
  }

  getAddresses() {
    return this.http.get<Address[]>(AppSettingsService.API_URL+'/auth/addresses/');
  }

  addAddress(address: Address): Observable<Address> {
    return this.http.post<Address>(AppSettingsService.API_URL+'/auth/addresses/', address);
  }

  updateAddress(address: Address) {
    return this.http.put<Address>(AppSettingsService.API_URL+'/auth/addresses/update/', address);
  }

  deleteAddress(address_id: string): Observable<any> {
    return this.http.delete(AppSettingsService.API_URL+'/auth/addresses/delete/', {body: {address_id}});
  }


}
