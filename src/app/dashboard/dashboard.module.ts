import {
  MatDatepickerModule,
  // MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  // MAT_MOMENT_DATE_FORMATS,
  // MomentDateAdapter,
} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashBoardMaterials } from './material/material.module';
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
import { DeleteSystemComponent } from './system/delete-system/delete-system.component';
import { EditSystemComponent } from './system/edit-system/edit-system.component';
import { DeleteEventComponent } from './event/delete-event/delete-event.component';
import { EditEventComponent } from './event/edit-event/edit-event.component';
import { EditActionComponent } from './action/edit-action/edit-action.component';
import { DeleteActionComponent } from './action/delete-action/delete-action.component';
import { DeleteContractComponent } from './contract/delete-contract/delete-contract.component';
import { EditContractComponent } from './contract/edit-contract/edit-contract.component';
import { UserComponent as AuthUserComponent } from './auth/user/user.component';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MatMomentDateModule,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { LogsListComponent } from './events-log/logs-list/logs-list.component';
import { EventExecutionDetailsComponent } from './events-log/event-execution-details/event-execution-details.component';
import { EventContractsComponent } from './events-log/event-contracts/event-contracts.component';
import { ContractExecutionDetailComponent } from './events-log/contract-execution-detail/contract-execution-detail.component';
import { ViewContractsComponent } from './event/view-contracts/view-contracts.component';
import { CreateUserComponent } from './auth/user/create-user/create-user.component';
import { ViewUserRolesComponent } from './auth/user/view-user-roles/view-user-roles.component';
import { AddUserRolesComponent } from './auth/user/add-user-roles/add-user-roles.component';
import { UpdateUserComponent } from './auth/user/update-user/update-user.component';
import { DeleteUserComponent } from './auth/user/delete-user/delete-user.component';

@NgModule({
  declarations: [
    DashboardComponent,
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
    DeleteSystemComponent,
    EditSystemComponent,
    DeleteEventComponent,
    EditEventComponent,
    EditActionComponent,
    DeleteActionComponent,
    DeleteContractComponent,
    EditContractComponent,
    LogsListComponent,
    EventExecutionDetailsComponent,
    EventContractsComponent,
    ContractExecutionDetailComponent,
    ViewContractsComponent,
    AuthUserComponent,
    CreateUserComponent,
    ViewUserRolesComponent,
    AddUserRolesComponent,
    UpdateUserComponent,
    DeleteUserComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashBoardMaterials,
    NodebootOauth2StarterModule,
    ReactiveFormsModule,
    FormsModule,
    MatMomentDateModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-PE' },
    { provide: MAT_DATE_LOCALE, useValue: 'es-PE' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class DashboardModule {}
