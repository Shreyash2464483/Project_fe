import { Routes } from '@angular/router';
import { Notfound404Component } from '../ui/notfound404/notfound404.component';
import { LandingpageComponent } from '../components/landingpage/landingpage.component';
import { authGuard } from '../guards/auth.guard';
import { UnauthorizedComponent } from '../ui/unauthorized/unauthorized.component';
import { UserRole } from '../models/model';

export const routes: Routes = [
  { path: '', component: LandingpageComponent },
  {
    path: 'signin',
    loadComponent: () =>
      import('../components/signin/signin.component').then(
        (m) => m.SigninComponent
      ),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('../components/signup/signup.component').then(
        (m) => m.SignupComponent
      ),
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('../roles/admin/admin.routes').then((m) => m.adminRoutes),
    canActivate: [authGuard],
    data: { roles: [UserRole.ADMIN] },
  },
  {
    path: 'employee',
    loadChildren: () =>
      import('../roles/employee/employee.routes').then((m) => m.emproutes),
    canActivate: [authGuard],
    data: { roles: [UserRole.EMPLOYEE] },
  },
  {
    path: 'manager',
    loadChildren: () =>
      import('../roles/manager/manager.routes').then((m) => m.mangerroutes),
    canActivate: [authGuard],
    data: { roles: [UserRole.MANAGER] },
  },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', component: Notfound404Component },
];
