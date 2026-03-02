import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { Ticket } from './pages/ticket/ticket';
import { ResetUserCredentials } from './pages/contact-center/reset-user-credentials/reset-user-credentials';
import { EditSpecificUserCredentials } from './pages/contact-center/edit-specific-user-credentials/edit-specific-user-credentials';
import { Error } from './pages/error/error';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ticket',
      },
      {
        path: 'ticket',
        component: Ticket,
      },
      {
        path: 'error',
        component: Error,
      },
      {
        path: 'settings',
        component: EditProfile,
      },
      {
        path: 'contact-center/reset-user-credentials',
        component: ResetUserCredentials,
      },
      {
        path: 'contact-center/edit-user',
        component: EditSpecificUserCredentials,
      },
      {
        path: '**',
        component: NotFound,
      },
    ],
  },
];
