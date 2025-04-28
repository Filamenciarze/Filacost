import {User} from './user';

export interface Status {
  authenticated: boolean,
  user: User
}
