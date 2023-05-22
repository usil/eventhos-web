import { ShowSecretComponent } from './show-secret/show-secret.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  BehaviorSubject,
  Subscription,
  merge,
  startWith,
  switchMap,
  catchError,
  of,
  map,
  first,
} from 'rxjs';
import { AddClientRolesComponent } from './add-client-roles/add-client-roles.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { DeleteClientComponent } from './delete-client/delete-client.component';
import { ShowTokenComponent } from './show-token/show-token.component';
import { UpdateClientComponent } from './update-client/update-client.component';
import { ViewClientRolesComponent } from './view-client-roles/view-client-roles.component';
import { ShowNewTokenComponent } from './show-new-token/show-new-token.component';
import { Client, ClientCreateContent, ClientService } from '../../services/client.service';

@Component({
  selector: 'client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  clients!: Client[];
  errorMessage!: string | undefined;
  displayedColumns: string[] = [
    'id',
    'name',
    'identifier',
    'clientSecret',
    'accessToken',
    'roles',
    'edit',
  ];

  resultsLength = 0;
  isLoadingResults = true;
  wholePageLoading = false;

  reload = new BehaviorSubject<number>(0);

  clientDataSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private clientService: ClientService,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.clientDataSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.reload
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.errorMessage = undefined;
          this.isLoadingResults = true;
          return this.clientService!.getClients(
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
        this.clients = data;
      });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.clientDataSubscription?.unsubscribe();
    this.sort.sortChange.complete();
  }

  openShowSecretComponent(client: Client) {
    this.dialog.open(ShowSecretComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: client,
    });
  }

  generateNewLongLiveToken(client: Client) {
    this.clientService
      .generateLongLiveToken(client.id, client.identifier)
      .subscribe({
        error: (err) => {
          if (err.error) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Unknown Error';
          }
        },
        next: (res) => {
          this.reload.next(this.reload.value + 1);
          this.dialog.open(ShowNewTokenComponent, {
            width: '600px',
            maxHeight: '70vh',
            data: { access_token: res.content.access_token },
          });
        },
      });
  }

  removeLongLiveToken(client: Client) {
    this.wholePageLoading = true;
    this.clientService.removeLongLiveToken(client.id, client.identifier).subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: () => {
        this.reload.next(this.reload.value + 1);
      },
      complete: () => {
        this.wholePageLoading = false;
      },
    });
  }

  revokeClient(client: Client) {
    this.wholePageLoading = true;
    this.clientService.modifyRevokeStatus(client.id, true).subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: () => {
        this.reload.next(this.reload.value + 1);
      },
      complete: () => {
        this.wholePageLoading = false;
      },
    });
  }

  ratifyClient(client: Client) {
    this.wholePageLoading = true;
    this.clientService.modifyRevokeStatus(client.id, false).subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: () => {
        this.reload.next(this.reload.value + 1);
      },
      complete: () => {
        this.wholePageLoading = false;
      },
    });
  }

  openCreateClientDialog() {
    const createClientDialogRef = this.dialog.open(CreateClientComponent, {
      width: '600px',
      maxHeight: '70vh',
    });
    createClientDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (res: ClientCreateContent) => {
          if (res) {
            this.dialog.open(ShowTokenComponent, {
              width: '600px',
              maxHeight: '70vh',
              data: res,
            });
            this.reload.next(this.reload.value + 1);
          }
        },
      });
  }

  openViewRolesDialog(client: Client) {
    this.dialog.open(ViewClientRolesComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: client,
    });
  }

  openUpdateRolesDialog(client: Client) {
    const updateRolesDialogRef = this.dialog.open(AddClientRolesComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: client,
    });

    updateRolesDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            this.reload.next(this.reload.value + 1);
          }
        },
      });
  }

  openUpdateClientDialog(client: Client) {
    const updateClientDialogRef = this.dialog.open(UpdateClientComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: client,
    });

    updateClientDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            this.reload.next(this.reload.value + 1);
          }
        },
      });
  }

  openDialogDeleteClient(client: Client) {
    const updateRolesDialogRef = this.dialog.open(DeleteClientComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: client,
    });

    updateRolesDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            this.reload.next(this.reload.value + 1);
          }
        },
      });
  }
}
