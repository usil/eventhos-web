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

  getRecivedEvents(): Observable<RecivedEventFullResponse> {
    return this.http
      .get<RecivedEventFullResponse>(this.httpRoute, {
        params: { 'page-size': 0 },
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
  producerId: number;
  producerEventId: number;
  producerName: string;
  producerIdentifier: string;
  producerEventName: string;
  producerEventIdentifier: string;
  header: Record<any, any>;
  body?: Record<any, any>;
  recivedAt: string;
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

export interface RecivedEventFullResponse extends BaseSuccess {
  pagination: Pagination;
  content: ReceivedEvent[];
}

enum Operations {
  SELECT = 'select',
  NEW = 'new',
  UPDATE = 'update',
  DELETE = 'delete',
  PROCESS = 'process',
}
