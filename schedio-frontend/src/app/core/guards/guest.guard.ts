import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Para rutas solo de invitados (login, register).
 * Si ya hay token, redirige a la zona de la app (p. ej. ticket).
 */
export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    return router.createUrlTree(['/agenda']);
  }

  return true;
};
