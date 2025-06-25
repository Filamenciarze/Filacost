import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class UploadModelService {

  constructor(private http: HttpClient) { }

  sendModel(file: File, filename_display: string, print_fill: number): Observable<any> {
    const formData = new FormData();
    formData.append('filename_display', filename_display);
    formData.append('print_fill', print_fill.toString());
    formData.append('file', file);

    return this.http.post<any>(AppSettingsService.API_URL+'/file/', formData,
      {
        withCredentials: true,
        reportProgress: true,
        observe: 'events'
      })
  }
}
