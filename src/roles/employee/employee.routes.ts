import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee.component';
import { CreateideaComponent } from './createidea/createidea.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyIdeas } from './my-ideas/my-ideas';

export const emproutes: Routes = [
  {
    path: '',
    component: EmployeeComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'createidea', component: CreateideaComponent },
      { path: 'myideas', component: MyIdeas },
      { path: 'employee', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
