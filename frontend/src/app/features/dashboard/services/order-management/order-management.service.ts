import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageableOrder} from '../../../orders/interfaces/pageable-order';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  constructor(
    private http: HttpClient,
  ) { }

  allOrders(): Observable<PageableOrder> {
    return this.http.get<PageableOrder>(AppSettingsService.API_URL+"/order/all/")
  }
}
