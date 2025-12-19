import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { FlightSearch } from './pages/flight-search/flight-search';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'search', component: FlightSearch },

  {
    path: 'booking',
    loadComponent: () => import('./pages/booking/booking').then((m) => m.Booking),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
    canActivate: [authGuard],
  },
  {
    path: 'booking/:flightId',
    loadComponent: () => import('./pages/book-flight/book-flight').then((m) => m.BookFlight),
    canActivate: [authGuard],
  },
];
