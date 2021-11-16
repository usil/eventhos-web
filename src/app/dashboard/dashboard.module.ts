import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashBoardMaterials } from './material/material.module';
import { FormsComponent } from './forms/forms.component';
import { TablesComponent } from './tables/tables.component';
import { EventsLogComponent } from './events-log/events-log.component';

@NgModule({
  declarations: [DashboardComponent, FormsComponent, TablesComponent, EventsLogComponent],
  imports: [CommonModule, DashboardRoutingModule, DashBoardMaterials],
})
export class DashboardModule {}
