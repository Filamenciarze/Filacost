import {BaseModel3D} from '../../models/interfaces/BaseModel3D';
import {PrintMaterial} from '../../models/enums/print-material';

export interface CartItem {
  cartitem_id: string,
  model3d: BaseModel3D,
  quantity: number,
  material: PrintMaterial
}
