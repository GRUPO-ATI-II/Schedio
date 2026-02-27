import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { Ticket } from './pages/ticket/ticket';
import { Error } from './pages/error/error';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login', // o la página principal
  },
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'ticket',
        component: Ticket,
      },
      {
        path: 'error',
        component: Error,
      },
    ],
  },
];
