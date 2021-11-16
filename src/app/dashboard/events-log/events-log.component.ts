import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import {
  EventsLogsService,
  ReceivedEvent,
} from '../services/events-logs.service';

@Component({
  selector: 'app-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['./events-log.component.scss'],
})
export class EventsLogComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'producerName',
    'producerEventName',
    'recivedAt',
    'state',
  ];
  dataSource!: MatTableDataSource<ReceivedEvent>;

  eventsLogSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private eventsLogsService: EventsLogsService) {}
  ngOnInit(): void {}
  ngAfterViewInit(): void {
    this.eventsLogSubscription = this.eventsLogsService
      .getRecivedEvents()
      .subscribe({
        next: (res) => {
          this.dataSource = new MatTableDataSource(res.content);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
      });
  }

  ngOnDestroy(): void {
    this.eventsLogSubscription?.unsubscribe();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
