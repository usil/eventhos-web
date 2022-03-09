import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-events-log',
  templateUrl: './events-log.component.html',
  styleUrls: ['./events-log.component.scss'],
})
export class EventsLogComponent implements OnInit, OnDestroy {
  receivedEventId!: number;
  detailId!: number;
  activatedRoute$!: Subscription;
  constructor(private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.receivedEventId = params['receivedEventId'];
      this.detailId = params['detailId'];
    });
  }
  ngOnDestroy(): void {
    this.activatedRoute$?.unsubscribe();
  }
  ngOnInit(): void {}
}
