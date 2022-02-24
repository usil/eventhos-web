import { ContractComponent } from './contract/contract.component';
import { ActionComponent } from './action/action.component';
import { EventComponent } from './event/event.component';
import { TablesComponent } from './tables/tables.component';
import { EventsLogComponent } from './events-log/events-log.component';
import { SystemComponent } from './system/system.component';

const routes = [
  // {
  //   icon: 'table_chart',
  //   path: 'home',
  //   name: 'Home',
  //   component: TablesComponent,
  // },
  // {
  //   icon: 'table_chart',
  //   path: 'producers',
  //   name: 'Producers',
  //   component: TablesComponent,
  // },
  // {
  //   icon: 'table_chart',
  //   path: 'systems',
  //   name: 'Systems',
  //   component: TablesComponent,
  // },
  // {
  //   icon: 'table_chart',
  //   path: 'actions',
  //   name: 'Subscribers Actions',
  //   component: TablesComponent,
  // },
  // {
  //   icon: 'table_chart',
  //   path: 'contracts',
  //   name: 'Contracts',
  //   component: TablesComponent,
  // },
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
  },
];

export default routes;
