import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {Observable} from 'rxjs';
import {BaseModel3D} from '../../interfaces/BaseModel3D';
import {PageableModel3D} from '../../interfaces/PageableModel3D';

@Injectable({
  providedIn: 'root'
})
export class ListModelsService {

  constructor(
    private http: HttpClient,
  ) { }

  listModels(page: number=1): Observable<any> {
    return this.http.get<PageableModel3D>(AppSettingsService.API_URL+'/file/list', {
      params: {page: page},
      withCredentials: true
    })
  }

  deleteModel(modelId: string): Observable<any> {
    return this.http.delete(AppSettingsService.API_URL+'/file/', {
      params: {id: modelId},
      withCredentials: true
    })
  }


}
