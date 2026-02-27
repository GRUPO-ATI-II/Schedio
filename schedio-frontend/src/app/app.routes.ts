import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { Ticket } from './pages/ticket/ticket';
import { ResetUserCredentials } from './pages/contact-center/reset-user-credentials/reset-user-credentials';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ticket', // o la página principal
      },
      {
        path: 'ticket',
        component: Ticket,
      },
      {
        path: 'contact-center/reset-user-credentials',
        component: ResetUserCredentials,
      },
    ],
  },
];
