import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PrintMaterial} from '../../../models/enums/print-material';
import {AppSettingsService} from '../../../../shared/utilities/services/app-settings/app-settings.service';
import {PageableCartItem} from '../../interfaces/pageable-cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private http: HttpClient
  ) { }

  addToCart(print_id: string, material: PrintMaterial, quantity: number) {
    return this.http.post(AppSettingsService.API_URL+"/order/cart/", {print_id, material, quantity})
  }

  cartList() {
    return this.http.get<PageableCartItem>(AppSettingsService.API_URL+'/order/cart/list/')
  }

  deleteFromCart(cartitem_id: string) {
    return this.http.delete(`${AppSettingsService.API_URL}/order/cart/`, {
      body: { cartitem_id }
    });
  }

  updateCartItemQuantity(cartitem_id: string, quantity: number) {
    return this.http.patch(AppSettingsService.API_URL + '/order/cart/', {cartitem_id, quantity})
  }

}
