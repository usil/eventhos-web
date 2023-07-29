import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  httpRoute = environment.api + '/contract';

  constructor(private http: HttpClient) {}

  createContract(
    contractDto: CreateContractDto
  ): Observable<CreateContractResult> {
    return this.http
      .post<CreateContractResult>(this.httpRoute, { ...contractDto })
      .pipe(first());
  }

  getContractsFromEvent(eventId: number) {
    return this.http
      .get<ContractEvents>(this.httpRoute + `/event/${eventId}`)
      .pipe(first());
  }

  getContracts(
    activeSort: string,
    order: string,
    pageIndex: number,
    itemsPerPage: number,
    filters?: {wordSearch: string}
  ) {
    let queryString = `?activeSort=${activeSort}&order=${order}&pageIndex=${pageIndex}&itemsPerPage=${itemsPerPage}`;
    if (filters && filters?.wordSearch && filters?.wordSearch !== "") {
      queryString += `&wordSearch=${filters.wordSearch}`;
    }
    return this.http
      .get<ContractPaginationResult>(this.httpRoute + queryString)
      .pipe(first());
  }

  findContractsByEventIdAndActionId(
    eventId: number,
    actionId: number
  ) {
    let path = `/event/${eventId}/action/${actionId}`;    
    return this.http
      .get<ContractResult>(this.httpRoute + path)
      .pipe(first());
  }

  deleteContract(contractId: number) {
    return this.http.delete(this.httpRoute + `/${contractId}`);
  }

  editContract(contractId: number, contractUpdateDto: ContractUpdateDto) {
    return this.http
      .put(this.httpRoute + `/${contractId}`, { ...contractUpdateDto })
      .pipe(first());
  }

  updateContractOrders(orders: { order: number; contractId: number }) {
    return this.http.put(this.httpRoute + `/order`, { orders }).pipe(first());
  }
}

export interface ContractUpdateDto {
  name: string;
  order: number;
  active: boolean;
  mailRecipientsOnError?: string;
}

interface ContractPaginationResult {
  message: string;
  code: number;
  content?: ContractPaginationContent;
}

interface ContractPaginationContent {
  items: Contract[];
  pageIndex: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

interface ContractResult {
  message: string;
  code: number;
  content: Contract[];
}

export interface CreateContractDto {
  name: string;
  identifier?: string;
  order: number;
  producerId: number;
  eventId: number;
  consumerId: number;
  actionId: number;
}

interface CreateContractResult {
  message: string;
  code: number;
  content: { contractId: number };
}

interface ContractEvents {
  message: string;
  code: number;
  content: Contract[];
}

export interface Contract {
  id: number;
  name: string;
  order: number;
  active: number;
  systemName: string;
  consumerName: string;
  eventIdentifier: string;
  actionIdentifier: string;
  mailRecipientsOnError: string;
}
