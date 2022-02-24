import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { ApplicationResourceComponent } from './access/application-resource/application-resource.component';
import { UserProfileComponent } from './access/user-profile/user-profile.component';
import { NodebootOauth2StarterModule } from 'nodeboot-oauth2-starter-ui';
import { SystemComponent } from './system/system.component';
import { EventComponent } from './event/event.component';
import { ActionComponent } from './action/action.component';
import { ContractComponent } from './contract/contract.component';
import { EditComponent } from './system/edit/edit.component';
import { DeleteComponent } from './system/delete/delete.component';
import { DeleteSystemComponent } from './system/delete-system/delete-system.component';
import { EditSystemComponent } from './system/edit-system/edit-system.component';
import { DeleteEventComponent } from './event/delete-event/delete-event.component';
import { EditEventComponent } from './event/edit-event/edit-event.component';
import { EditActionComponent } from './action/edit-action/edit-action.component';
import { DeleteActionComponent } from './action/delete-action/delete-action.component';
import { DeleteContractComponent } from './contract/delete-contract/delete-contract.component';
import { EditContractComponent } from './contract/edit-contract/edit-contract.component';
@NgModule({
  declarations: [
    DashboardComponent,
    FormsComponent,
    TablesComponent,
    EventsLogComponent,
    UserComponent,
    ClientComponent,
    RoleComponent,
    ApplicationResourceComponent,
    UserProfileComponent,
    SystemComponent,
    EventComponent,
    ActionComponent,
    ContractComponent,
    EditComponent,
    DeleteComponent,
    DeleteSystemComponent,
    EditSystemComponent,
    DeleteEventComponent,
    EditEventComponent,
    EditActionComponent,
    DeleteActionComponent,
    DeleteContractComponent,
    EditContractComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashBoardMaterials,
    NodebootOauth2StarterModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class DashboardModule {}
