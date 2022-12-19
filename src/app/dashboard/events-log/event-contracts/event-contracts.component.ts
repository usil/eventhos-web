import {
  EventsLogsService,
  ReceivedEvent,
  ReceivedEventContracts,
} from './../../services/events-logs.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EventService,
} from './../../services/event.service';

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
    'retry'
  ];
  receivedEvent!: ReceivedEvent;
  receivedEventDetails: ReceivedEventContracts[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventLogService: EventsLogsService,
    private eventService: EventService,
  ) {
    if (
      this.activatedRoute.snapshot.queryParams['receivedEventId'] !== undefined
    ) {
      //get all contracts for this event
      this.eventLogService
        .getReceivedEventDetails(
          this.activatedRoute.snapshot.queryParams['receivedEventId']
        )
        .subscribe({
          next: (res) => {
            console.log(res.content)
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

  retrySendEventContract(contractId: number, contractDetailId: number, receivedEventId:  number) {
    console.log(receivedEventId)
    this.eventService.handleEventContract(
      this.receivedEvent.received_request.query["event-identifier"], 
      this.receivedEvent.received_request.query["access-key"],
      contractId,
      contractDetailId,
      receivedEventId
    ).subscribe({
      error: (err) => {
        console.error(err)
      },
      next: () => {
        this.router.navigate(['/dashboard/events-logs']);
      },
    });
  }
}
