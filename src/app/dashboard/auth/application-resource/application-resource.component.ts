import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ApplicationOptionsComponent } from './application-options/application-options.component';
import { CreateApplicationResourceComponent } from './create-application-resource/create-application-resource.component';
import { DeleteApplicationResourceComponent } from './delete-application-resource/delete-application-resource.component';
import { Resource, ResourceService } from '../../services/resource.service';

@Component({
  selector: 'application-resource',
  templateUrl: './application-resource.component.html',
  styleUrls: ['./application-resource.component.scss'],
})
export class ApplicationResourceComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  resources!: Resource[];
  errorMessage!: string | undefined;
  displayedColumns: string[] = [
    'id',
    'applicationResourceName',
    'options',
    'delete',
  ];

  masterResources = [
    'OAUTH2_global',
    'OAUTH2_user',
    'OAUTH2_client',
    'OAUTH2_application',
    'OAUTH2_role',
    'OAUTH2_option',
  ];

  resultsLength = 0;
  isLoadingResults = true;

  reload = new BehaviorSubject<number>(0);

  userDataSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private resourceServie: ResourceService,
    public dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    this.userDataSubscription?.unsubscribe();
    this.sort.sortChange.complete();
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.userDataSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.reload
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.errorMessage = undefined;
          this.isLoadingResults = true;
          return this.resourceServie!.getResources(
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
        this.resources = data;
      });
  }

  ngOnInit(): void {}

  openCreateAppResourceDialog() {
    const createResourceOptionsDialogRef = this.dialog.open(
      CreateApplicationResourceComponent,
      {
        width: '600px',
        maxHeight: '70vh',
      }
    );

    createResourceOptionsDialogRef
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

  openDeleteResourceDialog(resource: Resource) {
    const deleteResourceOptionsDialogRef = this.dialog.open(
      DeleteApplicationResourceComponent,
      {
        width: '600px',
        maxHeight: '70vh',
        data: resource,
      }
    );

    deleteResourceOptionsDialogRef
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

  openOptionsDialog(resource: Resource) {
    const updateResourceOptionsDialogRef = this.dialog.open(
      ApplicationOptionsComponent,
      {
        width: '600px',
        maxHeight: '70vh',
        data: resource,
      }
    );

    updateResourceOptionsDialogRef
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
