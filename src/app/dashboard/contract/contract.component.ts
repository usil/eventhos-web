import { EditContractComponent } from './edit-contract/edit-contract.component';
import { DeleteContractComponent } from './delete-contract/delete-contract.component';
import {
  BehaviorSubject,
  catchError,
  first,
  map,
  merge,
  Observable,
  of,
  skip,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import {
  Contract,
  ContractService,
  CreateContractDto,
} from './../services/contract.service';
import {
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { System, SystemService } from '../services/system.service';
import { Event } from '../services/event.service';
import { Action } from '../services/action.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'producer',
    'eventIdentifier',
    'consumer',
    'actionIdentifier',
    'state',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  reload = new BehaviorSubject<number>(0);

  roleDataSubscription!: Subscription;

  contracts: Contract[] = [];

  isLoadingResults = true;

  resultsLength = 0;

  pageSize = 10;

  errorMessage!: string | undefined;

  createContractForm: FormGroup;
  producers: System[] = [];
  consumers: System[] = [];
  events: Event[] = [];
  actions: Action[] = [];

  producerId$: Subscription;
  consumerId$: Subscription;
  generateIdentifier$: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private systemService: SystemService,
    private contractService: ContractService,
    public dialog: MatDialog
  ) {
    this.createContractForm = this.formBuilder.group({
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
      producerId: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.required
      ),
      eventId: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.required
      ),
      consumerId: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.required
      ),
      actionId: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.required
      ),
    });

    this.systemService.getSystems('id', 'desc', 0, 100, 'producer').subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: (res) => {
        this.createContractForm.get('producerId')?.enable();
        this.producers = res.content?.items || [];
      },
    });

    this.producerId$ = this.createContractForm
      .get('producerId')
      ?.valueChanges.subscribe((id: number) => {
        this.createContractForm.get('eventId')?.reset();
        this.events = [];
        if (!id) return;
        this.systemService.getSystemEvents(id).subscribe({
          error: (err) => {
            if (err.error) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Unknown Error';
            }
          },
          next: (res) => {
            this.createContractForm.get('eventId')?.enable();
            this.events = res.content || [];
          },
        });
      }) as Subscription;

    this.systemService.getSystems('id', 'desc', 0, 100, 'consumer').subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: (res) => {
        this.createContractForm.get('consumerId')?.enable();
        this.consumers = res.content?.items || [];
      },
    });

    this.consumerId$ = this.createContractForm
      .get('consumerId')
      ?.valueChanges.subscribe((id: number) => {
        this.createContractForm.get('actionId')?.reset();
        this.actions = [];
        if (!id) return;
        this.systemService.getSystemActions(id).subscribe({
          error: (err) => {
            if (err.error) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Unknown Error';
            }
          },
          next: (res) => {
            this.createContractForm.get('actionId')?.enable();
            this.actions = res.content || [];
          },
        });
      }) as Subscription;

    this.generateIdentifier$ = merge(
      this.createContractForm.get('name')?.valueChanges as Observable<any>,
      this.createContractForm.get('eventId')?.valueChanges as Observable<any>,
      this.createContractForm.get('actionId')?.valueChanges as Observable<any>
    ).subscribe({
      next: () => {
        let name = this.createContractForm.get('name')?.value as string;
        if (name && name !== '') {
          const actionId = this.createContractForm.get('actionId')
            ?.value as string;
          const eventId = this.createContractForm.get('eventId')
            ?.value as string;
          name = name.trim();
          name = name.replace(' ', '_');
          name = name.toLocaleLowerCase();
          this.createContractForm
            .get('identifier')
            ?.setValue(`${name}_${eventId || 0}_${actionId || 0}`);
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
          return this.contractService
            .getContracts(
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
        console.log(data);
        this.contracts = data;
      });
  }
  ngOnDestroy(): void {
    this.generateIdentifier$?.unsubscribe();
    this.consumerId$.unsubscribe();
    this.producerId$.unsubscribe();
  }

  ngOnInit(): void {}

  createContract(contractForm: CreateContractDto) {
    const identifier = this.createContractForm.get('identifier')?.value;
    this.createContractForm.disable();
    this.contractService
      .createContract({ ...contractForm, identifier })
      .subscribe({
        error: (err) => {
          this.createContractForm.enable();
          this.createContractForm.get('identifier')?.disable();
          if (err.error) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Unknown Error';
          }
        },
        next: () => {
          this.reload.next(this.reload.value + 1);
          this.createContractForm.reset();
          this.formDirective.resetForm();
          this.createContractForm.enable();
          this.createContractForm.get('identifier')?.disable();
          this.createContractForm.get('eventId')?.disable();
          this.createContractForm.get('actionId')?.disable();
          this.events = [];
          this.actions = [];
        },
      });
  }

  getErrorMessage(formControlName: string) {
    if (this.createContractForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.createContractForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  openDeleteDialog(contract: Contract) {
    const deleteContractDialogRef = this.dialog.open(DeleteContractComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: contract,
    });

    deleteContractDialogRef
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

  openEditDialog(contract: Contract) {
    const editContractDialogRef = this.dialog.open(EditContractComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: contract,
    });

    editContractDialogRef
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
