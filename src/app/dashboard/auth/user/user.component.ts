import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, catchError, first, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { User, UserService } from '../../services/user.service';
import { ViewUserRolesComponent } from './view-user-roles/view-user-roles.component';
import { AddUserRolesComponent } from './add-user-roles/add-user-roles.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { DeleteUserComponent } from './delete-user/delete-user.component';


@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnDestroy, AfterViewInit {
    users!: User[];
    errorMessage!: string | undefined;
    displayedColumns: string[] = ['id', 'name', 'username', 'roles', 'edit'];

    resultsLength = 0;
    isLoadingResults = true;

    reload = new BehaviorSubject<number>(0);
    pageSize = 20;


    userDataSubscription!: Subscription;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private userService: UserService,
        public dialog: MatDialog
    ) { }

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
                    return this.userService!.getUsers(
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
                this.users = data;
            });
    }

  openCreateUserDialog() {
      const createUserDialogRef = this.dialog.open(CreateUserComponent, {
        width: '600px',
        maxHeight: '70vh',
      });
      createUserDialogRef
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

  openViewRolesDialog(user: User) {
      this.dialog.open(ViewUserRolesComponent, {
        width: '600px',
        maxHeight: '70vh',
        data: user,
      });
  }

  openUpdateRolesDialog(user: User) {
      const updateRolesDialogRef = this.dialog.open(AddUserRolesComponent, {
        width: '600px',
        maxHeight: '70vh',
        data: user,
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

  openUpdateUserDialog(user: User) {
      const updateUserDialogRef = this.dialog.open(UpdateUserComponent, {
        width: '600px',
        maxHeight: '70vh',
        data: user,
      });
  
      updateUserDialogRef
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
  openDialogDeleteUser(user: User) {
    const updateRolesDialogRef = this.dialog.open(DeleteUserComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: user,
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