import {ShipmentType} from './shipment-type';

export interface Order {
  order_id: string;
  order_status: string;
  total_cost: string;
  shipping_address: string;
  shipment_type: ShipmentType;
  ordered_models: any[];
  created_at: string;
}
