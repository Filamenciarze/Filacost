import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PageableOrder} from '../../../orders/interfaces/pageable-order';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {Order} from '../../../orders/interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  constructor(
    private http: HttpClient,
  ) { }

  allOrders(): Observable<PageableOrder> {
    return this.http.get<PageableOrder>(AppSettingsService.API_URL+"/order/all/");
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(AppSettingsService.API_URL+'/order/update/', order);
  }

  deleteOrder(order: Order): Observable<Order> {
    return this.http.delete<any>(AppSettingsService.API_URL+'/order/delete/', {body: {order_id: order.order_id}});
  }
}
