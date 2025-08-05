import { Routes } from '@angular/router';
import { GameRoundComponent } from './components/game-round/game-round';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'game/:playlistId', component: GameRoundComponent },

  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },

  {
    path: 'auth/callback',
    loadComponent: () =>
      import('./auth/auth-callback/auth-callback').then(m => m.AuthCallbackComponent),
  },

  {
    path: '**',
    redirectTo: 'home'
  }
  
];
