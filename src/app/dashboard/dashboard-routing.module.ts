import { LoginGuard } from './../guards/login.guard';
import { EditActionComponent } from './action/edit-action/edit-action.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '../guards/admin.guard';
import { ApplicationResourceComponent } from './access/application-resource/application-resource.component';
import { ClientComponent } from './access/client/client.component';
import { RoleComponent } from './access/role/role.component';
import { UserProfileComponent } from './access/user-profile/user-profile.component';
import { UserComponent } from './access/user/user.component';

import { DashboardComponent } from './dashboard.component';
import routesList from './routes';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      ...routesList,
      {
        path: 'action/edit',
        component: EditActionComponent,
        canActivate: [AdminGuard],
        canLoad: [AdminGuard],
      },
      {
        path: 'auth/users',
        component: UserComponent,
        canActivate: [AdminGuard],
        canLoad: [AdminGuard],
      },
      {
        path: 'auth/clients',
        component: ClientComponent,
        canActivate: [AdminGuard],
        canLoad: [AdminGuard],
      },
      {
        path: 'auth/roles',
        component: RoleComponent,
        canActivate: [AdminGuard],
        canLoad: [AdminGuard],
      },
      {
        path: 'auth/resource',
        component: ApplicationResourceComponent,
        canActivate: [AdminGuard],
        canLoad: [AdminGuard],
      },
      { path: 'profile', component: UserProfileComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
