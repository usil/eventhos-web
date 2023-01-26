import { EditSystemComponent } from './edit-system/edit-system.component';
import { DeleteSystemComponent } from './delete-system/delete-system.component';
import { System, SystemService } from './../services/system.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import { Client, ClientService } from './../services/client.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  merge,
  Subscription,
  Observable,
  catchError,
  map,
  of,
  startWith,
  switchMap,
  first,
  BehaviorSubject,
  skip,
} from 'rxjs';
import { CreateSystemDto } from '../services/system.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
})
export class SystemComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'class',
    'type',
    'description',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  roleDataSubscription!: Subscription;

  reload = new BehaviorSubject<number>(0);

  systemTypes = [
    'API',
    'CMS',
    'CRM',
    'DESKTOP',
    'ERP',
    'ETL',
    'EXTERNAL_SERVICE',
    'IOT',
    'LMS',
    'MICROSERVICE',
    'MOBILE',
    'MONOLITHIC',
    'PWA',
    'REPORT_PLATFORM',
    'SAAS',
    'SCHEDULER',
    'SPA',
    'WEB'
  ];

  loading = false;

  errorMessage!: string | undefined;

  clients: Client[] = [];

  createSystemForm: FormGroup;

  generateIdentifier$: Subscription;

  classSubscription$: Subscription;

  isLoadingResults = true;

  resultsLength = 0;

  pageSize = 10;

  systems: System[] = [];

  constructor(
    private clientService: ClientService,
    private systemService: SystemService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.createSystemForm = this.formBuilder.group({
      name: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      identifier: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      type: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      systemClass: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      description: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(255),
        ])
      ),
      clientId: this.formBuilder.control(
        { value: '', disabled: false },
        Validators.compose([Validators.required])
      ),
    });

    this.classSubscription$ = this.createSystemForm
      .get('systemClass')
      ?.valueChanges.subscribe((val) => {
        if (val === 'consumer') {
          this.createSystemForm.get('clientId')?.disable();
        } else {
          this.createSystemForm.get('clientId')?.enable();
        }
      }) as Subscription;

    this.generateIdentifier$ = merge(
      this.createSystemForm.get('name')?.valueChanges as Observable<any>,
      this.createSystemForm.get('type')?.valueChanges as Observable<any>
    ).subscribe({
      next: () => {
        let name = this.createSystemForm.get('name')?.value as string;
        if (name && name !== '') {
          const type = this.createSystemForm.get('type')?.value as string;
          name = name.trim();
          name = name.replace(' ', '_');
          name = name.toLocaleLowerCase();
          this.createSystemForm
            .get('identifier')
            ?.setValue(`${name}_${type.toLocaleLowerCase()}`);
        }
      },
    });
  }
  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.roleDataSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.reload
    )
      .pipe(
        skip(1),
        startWith({}),
        switchMap(() => {
          this.errorMessage = undefined;
          this.isLoadingResults = true;
          return this.systemService
            .getSystems(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.pageSize
            )
            .pipe(
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
        this.systems = data;
      });
  }
  ngOnDestroy(): void {
    this.generateIdentifier$?.unsubscribe();
    this.roleDataSubscription?.unsubscribe();
    this.classSubscription$?.unsubscribe();
  }

  ngOnInit(): void {
    this.clientService.getClients(0).subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: (res) => {
        this.clients = res.content?.items || [];
      },
    });
  }

  getErrorMessage(formControlName: string) {
    if (this.createSystemForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.createSystemForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  createSystem(createSystemBody: CreateSystemDto) {
    this.loading = true;
    this.createSystemForm.disable();
    this.systemService.createSystem(createSystemBody).subscribe({
      error: (err) => {
        this.loading = false;
        this.createSystemForm.enable();
        this.createSystemForm.get('identifier')?.disable();
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: () => {
        this.reload.next(this.reload.value + 1);
        this.createSystemForm.reset();
        this.formDirective.resetForm();
        this.loading = false;
        this.createSystemForm.enable();
        this.createSystemForm.get('identifier')?.disable();
      },
    });
  }

  openDeleteDialog(system: System) {
    const deleteSystemDialogRef = this.dialog.open(DeleteSystemComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: system,
    });

    deleteSystemDialogRef
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

  openEditDialog(system: System) {
    const editSystemDialogRef = this.dialog.open(EditSystemComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: system,
    });

    editSystemDialogRef
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
