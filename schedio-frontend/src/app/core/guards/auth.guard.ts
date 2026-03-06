import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

/**
 * Protege las rutas que requieren sesión.
 * Si no hay token en localStorage, redirige a /login.
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (token) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
