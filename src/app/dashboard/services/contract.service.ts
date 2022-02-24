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

  getContracts(
    activeSort: string,
    order: string,
    pageIndex: number,
    itemsPerPage: number
  ) {
    let queryString = `?activeSort=${activeSort}&order=${order}&pageIndex=${pageIndex}&itemsPerPage=${itemsPerPage}`;
    return this.http
      .get<ContractPaginationResult>(this.httpRoute + queryString)
      .pipe(first());
  }

  deleteContract(contractId: number) {
    return this.http.delete(this.httpRoute + `/${contractId}`);
  }
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

export interface CreateContractDto {
  name: string;
  identifier?: string;
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

export interface Contract {
  id: number;
  name: string;
  active: number;
  systemName: string;
  consumerName: string;
  eventIdentifier: string;
  actionIdentifier: string;
}
