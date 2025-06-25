import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ShipmentType} from '../../../orders/interfaces/shipment-type';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {

  constructor(
    private http: HttpClient
  ) { }

  getShipmentTypes() {
    return this.http.get<ShipmentType[]>(AppSettingsService.API_URL+'/order/shipment/');
  }

  addShipmentType(shipment: ShipmentType) {
    return this.http.post<any>(AppSettingsService.API_URL+'/order/shipment/create/', shipment);
  }

  deleteShipmentType(shipment: ShipmentType) {
    return this.http.delete<any>(AppSettingsService.API_URL+'/order/shipment/',{body:{id: shipment.shipment_type_id}});
  }

  editShipmentType(shipment: ShipmentType) {
    return this.http.put<any>(AppSettingsService.API_URL+'/order/shipment/', shipment);
  }
}
