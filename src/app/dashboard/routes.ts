import { ContractExecutionDetailComponent } from './events-log/contract-execution-detail/contract-execution-detail.component';
import { EventContractsComponent } from './events-log/event-contracts/event-contracts.component';
import { LogsListComponent } from './events-log/logs-list/logs-list.component';
import { ContractComponent } from './contract/contract.component';
import { ActionComponent } from './action/action.component';
import { EventComponent } from './event/event.component';

import { EventsLogComponent } from './events-log/events-log.component';
import { SystemComponent } from './system/system.component';

const routes = [
  {
    icon: 'dns',
    path: 'system',
    name: 'Systems',
    component: SystemComponent,
  },
  {
    icon: 'event',
    path: 'event',
    name: 'Events',
    component: EventComponent,
  },
  {
    icon: 'link',
    path: 'action',
    name: 'Actions',
    component: ActionComponent,
  },
  {
    icon: 'assignment',
    path: 'contract',
    name: 'Contracts',
    component: ContractComponent,
  },
  {
    icon: 'list_alt',
    path: 'events-logs',
    name: 'Events Log',
    component: EventsLogComponent,
    children: [
      { path: '', redirectTo: 'logs-list', pathMatch: 'full' },
      {
        path: 'logs-list',
        component: LogsListComponent,
      },
      {
        path: 'logs-list/event-contracts',
        component: EventContractsComponent,
      },
      {
        path: 'logs-list/event-contracts/contract-details',
        component: ContractExecutionDetailComponent,
      },
    ],
  },
];

export default routes;
