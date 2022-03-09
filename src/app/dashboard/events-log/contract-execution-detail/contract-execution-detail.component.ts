import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsLogsService } from '../../services/events-logs.service';

@Component({
  selector: 'app-contract-execution-detail',
  templateUrl: './contract-execution-detail.component.html',
  styleUrls: ['./contract-execution-detail.component.scss'],
})
export class ContractExecutionDetailComponent implements OnInit {
  contractExecutionDetail!: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private eventLogService: EventsLogsService,
    private router: Router
  ) {
    if (this.activatedRoute.snapshot.queryParams['detailId'] !== undefined) {
      this.eventLogService
        .getContractExecutionDetail(
          this.activatedRoute.snapshot.queryParams['detailId']
        )
        .subscribe({
          next: (res: any) => {
            this.contractExecutionDetail = res.content;
          },
        });
    } else {
      this.router.navigate(['/dashboard/events-logs']);
    }
  }

  parseJson(objToParse: Record<string, any>) {
    return JSON.stringify(objToParse, null, 4);
  }

  getElapsedTime() {
    const startDate = new Date(this.contractExecutionDetail.response.startTime);
    const endDate = new Date(this.contractExecutionDetail.response.endTime);
    const diffTime = Math.abs((endDate as any) - (startDate as any));
    return diffTime / 1000;
  }

  ngOnInit(): void {}
}
