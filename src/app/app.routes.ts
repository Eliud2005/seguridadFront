import { Routes } from '@angular/router';
import { Login } from './auth/pages/login/login';
import { authGuard } from './auth/auth.guard'; // Tu guardián de seguridad
import { Home } from '../pages/home/home';
import { Admin } from '../pages/admin/admin';
import { AuthCallbackComponent } from './auth/auth-callback.component';

export const routes: Routes = [
  { 
    path: 'login', 
    component: Login 
  },
  { 
    path: 'home', 
    component: Home,
  },
  { 
    path: 'admin', 
    component: Admin,
  },
  { 
    path: 'auth-callback', 
    component: AuthCallbackComponent 
  },
  { 
    path: '', 
    redirectTo: 'home', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'home' 
  },
  
];