import {Pageable} from '../../../shared/utilities/interfaces/pageable';
import {CartItem} from './cart-item';

export interface PageableCartItem extends Pageable{
  results: CartItem[]
}
