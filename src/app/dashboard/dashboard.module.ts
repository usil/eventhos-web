import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashBoardMaterials } from './material/material.module';
import { FormsComponent } from './forms/forms.component';
import { TablesComponent } from './tables/tables.component';
import { EventsLogComponent } from './events-log/events-log.component';
import { UserComponent } from './access/user/user.component';
import { ClientComponent } from './access/client/client.component';
import { RoleComponent } from './access/role/role.component';
import { ApplicationPartComponent } from './access/application-part/application-part.component';
import { UserProfileComponent } from './access/user-profile/user-profile.component';
import { NodebootOauth2StarterModule } from 'nodeboot-oauth2-starter-ui';
@NgModule({
  declarations: [
    DashboardComponent,
    FormsComponent,
    TablesComponent,
    EventsLogComponent,
    UserComponent,
    ClientComponent,
    RoleComponent,
    ApplicationPartComponent,
    UserProfileComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashBoardMaterials,
    NodebootOauth2StarterModule,
  ],
})
export class DashboardModule {}
