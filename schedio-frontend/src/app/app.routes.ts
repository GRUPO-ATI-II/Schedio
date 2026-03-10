import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { Ticket } from './pages/ticket/ticket';
import { Tasks } from './pages/tasks/tasks';
import { ResetUserCredentials } from './pages/contact-center/reset-user-credentials/reset-user-credentials';
import { EditSpecificUserCredentials } from './pages/contact-center/edit-specific-user-credentials/edit-specific-user-credentials';
import { Error } from './pages/error/error';
import { EditProfile } from './pages/edit-profile/edit-profile';
import { CreateAssignment } from './pages/create-assignment/create-assignment';
import { CreateEvent } from './pages/create-event/create-event';
import { EditAssignment } from './pages/edit-assignment/edit-assignment';
import { NotFound } from './pages/not-found/not-found';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/login/login').then(m => m.Login),
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () => import('./pages/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'agenda',
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
        path: 'agenda/new-assignment',
        component: CreateAssignment,
      },
      {
        path: 'agenda/edit-assignment',
        component: EditAssignment,
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
        path: 'calendar',
        loadComponent: () => import('./pages/calendar/calendar').then(m => m.Calendar),
      },
      {
        path: 'agenda',
        component: Tasks,
      },
      {
        path: 'agenda/new-assignment',
        component: CreateAssignment,
      },
      {
        path: 'agenda/new-event',
        component: CreateEvent,
      },
      {
        path: '**',
        component: NotFound,
      },
    ],
  },
];
