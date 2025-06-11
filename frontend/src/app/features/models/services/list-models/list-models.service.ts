import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {Observable} from 'rxjs';
import {BaseModel3D} from '../../interfaces/BaseModel3D';
import {PageableModel3D} from '../../interfaces/ExtendedModel3D';

@Injectable({
  providedIn: 'root'
})
export class ListModelsService {

  constructor(
    private http: HttpClient,
  ) { }

  listModels(): Observable<any> {
    return this.http.get<PageableModel3D>(AppSettingsService.API_URL+'/file/list', {withCredentials: true})
  }


}
