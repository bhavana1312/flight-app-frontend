import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { FlightSearch } from './pages/flight-search/flight-search';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: FlightSearch },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
  },

  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking').then((m) => m.Booking),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: 'booking/:flightId',
    loadComponent: () => import('./pages/book-flight/book-flight').then((m) => m.BookFlight),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
    canActivate: [authGuard],
  },
];
