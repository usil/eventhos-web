import { TestBed } from '@angular/core/testing';

import { EventsLogsService } from './events-logs.service';

describe('EventsLogsService', () => {
  let service: EventsLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
