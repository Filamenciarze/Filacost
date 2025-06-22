import {Pageable} from '../../../shared/utilities/interfaces/pageable';
import {Order} from './order';

export interface PageableOrder extends Pageable {
  results: Order[]
}
