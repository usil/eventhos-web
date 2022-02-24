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
import {
  catchError,
  map,
  merge,
  of,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
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
    'systemName',
    'eventName',
    'recivedAt',
    'state',
  ];

  errorMessage!: string;

  receivedEvents: ReceivedEvent[] = [];
  resultsLength = 0;

  eventsLogSubscription!: Subscription;

  isLoadingResults = true;

  pageSize = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private eventsLogsService: EventsLogsService) {}
  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.eventsLogSubscription = merge(
      this.sort.sortChange,
      this.paginator.page
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.eventsLogsService!.getReceivedEvents(
            this.paginator.pageIndex,
            this.sort.direction
          ).pipe(
            catchError((err) => {
              if (err.error) {
                this.errorMessage = err.error.message;
              } else {
                this.errorMessage = 'Unknown Error';
              }
              return of(null);
            })
          );
        }),
        map((data) => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          this.resultsLength = data.content?.totalItems || 0;
          return data.content?.items || [];
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.receivedEvents = data;
      });
  }

  ngOnDestroy(): void {
    this.sort.sortChange.complete();
    this.eventsLogSubscription?.unsubscribe();
  }
}
