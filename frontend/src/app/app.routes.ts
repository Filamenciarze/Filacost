import { Routes } from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {LoginComponent} from './core/auth/pages/login/login.component';
import {authGuard} from './core/auth/guards/auth.guard';
import {RegisterComponent} from './core/auth/pages/register/register.component';
import {ListModelsComponent} from './features/models/pages/list-models/list-models.component';
import {UploadModelComponent} from './features/models/pages/upload-model/upload-model.component';
import {ProfileDetailsComponent} from './features/profile/pages/profile-details/profile-details.component';
import {OrderCreateComponent} from './features/orders/pages/order-create/order-create.component';
import {OrderListComponent} from './features/orders/pages/order-list/order-list.component';
import {isManagerGuard} from './core/user/guards/is-manager/is-manager.guard';
export const routes: Routes = [
  {path: '', redirectTo: 'models', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, isManagerGuard]},
  {path: 'models', component: ListModelsComponent, canActivate: [authGuard]},
  {path: 'models/upload', component: UploadModelComponent, canActivate: [authGuard]},
  {path: 'profile', component: ProfileDetailsComponent, canActivate: [authGuard]},
  {path: 'checkout', component:OrderCreateComponent, canActivate: [authGuard]},
  {path: 'orders', component: OrderListComponent, canActivate: [authGuard]},
];
