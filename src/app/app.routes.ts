import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
  { 
    path: 'chat', 
    canActivate: [authGuard], // Protect the route
    loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent) 
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
