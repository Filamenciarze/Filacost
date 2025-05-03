import { Routes } from '@angular/router';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {LoginComponent} from './core/auth/pages/login/login.component';
import {authGuard} from './core/auth/guards/auth.guard';
import {RegisterComponent} from './core/auth/pages/register/register.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent},
];
