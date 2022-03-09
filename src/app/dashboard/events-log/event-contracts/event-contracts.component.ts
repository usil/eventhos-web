import {
  EventsLogsService,
  ReceivedEvent,
  ReceivedEventContracts,
} from './../../services/events-logs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-contracts',
  templateUrl: './event-contracts.component.html',
  styleUrls: ['./event-contracts.component.scss'],
})
export class EventContractsComponent implements OnInit {
  displayedColumns: string[] = [
    'contractId',
    'contractActionId',
    'contractActionName',
    'state',
  ];
  receivedEvent!: ReceivedEvent;
  receivedEventDetails: ReceivedEventContracts[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventLogService: EventsLogsService
  ) {
    if (
      this.activatedRoute.snapshot.queryParams['receivedEventId'] !== undefined
    ) {
      this.eventLogService
        .getReceivedEventDetails(
          this.activatedRoute.snapshot.queryParams['receivedEventId']
        )
        .subscribe({
          next: (res) => {
            this.receivedEvent = res.content.receivedEvent;
            this.receivedEventDetails = res.content.executedEventContracts;
          },
        });
    } else {
      this.router.navigate(['/dashboard/events-logs']);
    }
  }

  parseJson(objToParse: Record<string, any>) {
    return JSON.stringify(objToParse, null, 4);
  }

  ngOnInit(): void {}

  goToContractDetailsPage(detailId: number) {
    this.router.navigate(
      [`/dashboard/events-logs/logs-list/event-contracts/contract-details`],
      {
        queryParams: {
          receivedEventId: this.receivedEvent.id,
          detailId,
        },
      }
    );
  }
}
