import { TablesComponent } from './tables/tables.component';
import { EventsLogComponent } from './events-log/events-log.component';

const routes = [
  {
    icon: 'table_chart',
    path: 'home',
    name: 'Home',
    component: TablesComponent,
  },
  {
    icon: 'table_chart',
    path: 'producers',
    name: 'Producers',
    component: TablesComponent,
  },
  {
    icon: 'table_chart',
    path: 'producer-events',
    name: 'Producer Events',
    component: TablesComponent,
  },
  {
    icon: 'table_chart',
    path: 'subscribers',
    name: 'subscribers',
    component: TablesComponent,
  },
  {
    icon: 'table_chart',
    path: 'actions',
    name: 'Subscribers Actions',
    component: TablesComponent,
  },
  {
    icon: 'table_chart',
    path: 'contracts',
    name: 'Contracts',
    component: TablesComponent,
  },
  {
    icon: 'assignment',
    path: 'events-logs',
    name: 'Events Log',
    component: EventsLogComponent,
  },
];

export default routes;
