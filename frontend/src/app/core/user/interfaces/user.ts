import {Profile} from './profile';
import {Role} from '../enums/Role'

export interface User {
  email: string,
  role: Role,
  profile: Profile,
}
