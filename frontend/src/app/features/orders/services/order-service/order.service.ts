import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {ShipmentType} from '../../interfaces/shipment-type';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {Order} from '../../interfaces/order'

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(AppSettingsService.API_URL+ '/order/list/');
  }

  getOrderDetails(order_id: string): Observable<Order> {
    return this.http.get<Order>(AppSettingsService.API_URL+ '/order/details/');
  }

  createOrder(payload: { shipping_address_id: string, shipment_type_id: string }): Observable<Order> {
    return this.http.post<Order>(AppSettingsService.API_URL+ '/order/create/', payload);
  }

  // SHIPMENT TYPES

  createShipmentType(payload: { shipment_type: string, shipment_cost: number }): Observable<ShipmentType> {
    return this.http.post<ShipmentType>(AppSettingsService.API_URL+ '/order/shipment/create/', payload);
  }

  getShipmentTypes(): Observable<ShipmentType[]> {
    return this.http.get<ShipmentType[]>(AppSettingsService.API_URL+ '/order/shipment/');
  }
}
