import {Pageable} from '../../../shared/utilities/interfaces/pageable';
import {BaseModel3D} from './BaseModel3D';

export interface PageableModel3D extends Pageable {
  results: BaseModel3D[];
}
