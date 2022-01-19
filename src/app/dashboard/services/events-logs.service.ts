import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
  concatMap,
  delay,
  Observable,
  retryWhen,
  take,
  throwError,
} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EventsLogsService {
  httpRoute = environment.api + '/event';
  constructor(private http: HttpClient) {}

  getReceivedEvents(
    pageIndex: number,
    order: string
  ): Observable<ReceivedEventFullResponse> {
    return this.http
      .get<ReceivedEventFullResponse>(this.httpRoute, {
        params: { pageIndex, order, itemsPerPage: 20 },
      })
      .pipe(
        retryWhen((errors) =>
          errors.pipe(delay(500), take(5), concatMap(throwError))
        )
      );
  }
}

export interface ReceivedEvent {
  id: number;
  systemId: number;
  eventId: number;
  systemName: string;
  systemIdentifier: string;
  eventName: string;
  eventIdentifier: string;
  eventDescription: string;
  header: Record<any, any>;
  body?: Record<any, any>;
  recivedAt: Date;
}

interface ProducerEvent {
  id: number;
  producer_id: number;
  identifier: string;
  name: string;
  operation: Operations;
  description: string;
  deleted: number;
  created_at: Date;
  updated_at: Date;
}

interface Producer {
  id: number;
  identifier: string;
  name: string;
  type: string;
  key: string;
  description: string;
  deleted: number;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  totalElements: number;
  totalPages: number;
  page: number;
  pageSize: number;
}

interface BaseSuccess {
  code: number;
  message: string;
}

export interface ReceivedEventFullResponse extends BaseSuccess {
  content: PaginatedEvent;
}

interface PaginatedEvent {
  items: ReceivedEvent[];
  pageIndex: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

enum Operations {
  SELECT = 'select',
  NEW = 'new',
  UPDATE = 'update',
  DELETE = 'delete',
  PROCESS = 'process',
}
