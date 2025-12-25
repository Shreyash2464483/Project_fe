import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/model';

export const authGuard = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/signin']);
  }

  const allowedRoles = (route.data['roles'] as UserRole[]) || [];

  if (allowedRoles.length > 0) {
    const userRole = auth.getUserRole();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
