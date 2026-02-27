import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { Ticket } from './pages/ticket/ticket';
import { Error } from './pages/error/error';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { NotFound } from './pages/not-found/not-found';


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
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register),
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
        path: 'edit-profile',
        component: EditProfile,
      },

      {
        path: '**',
        component: NotFound
      }
    ],
  },
];
