import {BaseModel3D} from './BaseModel3D';

export interface ExtendedModel3D extends BaseModel3D {
  file: Blob,
  print_fill: number
}
