import { Routes } from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {LoginComponent} from './core/auth/pages/login/login.component';
import {authGuard} from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent},
];
