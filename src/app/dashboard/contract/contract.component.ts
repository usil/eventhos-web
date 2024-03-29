import { EditContractComponent } from './edit-contract/edit-contract.component';
import { DeleteContractComponent } from './delete-contract/delete-contract.component';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  merge,
  Observable,
  of,
  skip,
  startWith,
  Subscription,
  switchMap,
  firstValueFrom
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
  AbstractControl,
} from '@angular/forms';
import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { System, SystemService } from '../services/system.service';
import { Event } from '../services/event.service';
import { Action } from '../services/action.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../common/common.service';
import { MatSelectChange } from '@angular/material/select';
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'producer',
    'eventIdentifier',
    'consumer',
    'actionIdentifier',
    'state',
    'order',
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

  searchContractForm: FormGroup;
  wordSearchChange$: Subscription;
  wordSearch = ""
  selectedProducerName : string | undefined;
  selectedEventName!: string | undefined;
  selectedConsumerName!: string | undefined;
  selectedActionName!: string | undefined;

  selectedEventId!: string | undefined;
  selectedActionId!: string | undefined;

  commonService = new CommonService();

  constructor(
    private formBuilder: FormBuilder,
    private systemService: SystemService,
    private contractService: ContractService,
    public dialog: MatDialog
  ) {

    this.searchContractForm = this.formBuilder.group({
      wordSearch: this.formBuilder.control(''),
    });

    this.wordSearchChange$ = this.searchContractForm
      .get('wordSearch')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(750))
      .subscribe((changeValue) => {
        this.wordSearch = changeValue;
        this.paginator.pageIndex = 0;
        this.reload.next(this.reload.value + 1);
      }) as Subscription;
    this.createContractForm = this.formBuilder.group({
      name: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_=>:\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(190),
        ])
      ),
      order: this.formBuilder.control(
        0,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(1000),
          Validators.pattern(/^[\d]+$/),
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
      mailRecipientsOnError: this.formBuilder.control(
        '',
        Validators.compose([this.commonService.severalMailsPatternValidator])
      )
    });

    this.systemService.getSystems('id', 'desc', 0, 100, 'producer').subscribe({
      error: (err) => {
        this.handleError(err);
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
            this.handleError(err);
          },
          next: (res) => {
            this.createContractForm.get('eventId')?.enable();
            this.events = res.content || [];
          },
        });
      }) as Subscription;

    this.systemService.getSystems('id', 'desc', 0, 100, 'consumer').subscribe({
      error: (err) => {
        this.handleError(err);
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
            this.handleError(err);
          },
          next: (res) => {
            this.createContractForm.get('actionId')?.enable();
            this.actions = res.content || [];
          },
        });
      }) as Subscription;
  }

  handleError(err: any) {
    if (err.error) {
      this.errorMessage = err.error.message;
    } else {
      this.errorMessage = 'Unknown Error';
    }
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
              this.pageSize,
              {wordSearch: this.wordSearch}
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
        this.contracts = data;
      });
  }
  ngOnDestroy(): void {
    this.consumerId$.unsubscribe();
    this.producerId$.unsubscribe();
    this.wordSearchChange$?.unsubscribe()
  }

  async createContract(contractForm: CreateContractDto) {
    const identifier = this.createContractForm.get('identifier')?.value;
    this.createContractForm.disable();

    const contractsByEventIdAndActionId = await firstValueFrom(
        this.contractService.findContractsByEventIdAndActionId(contractForm.eventId, contractForm.actionId));
    
    if(contractsByEventIdAndActionId && contractsByEventIdAndActionId.code === 200000 
        && contractsByEventIdAndActionId.content.length>0){
          this.errorMessage = 
          `Failed. A contract already exist for this event (${this.selectedEventName}) and this action (${this.selectedActionName}). Try again usiung another values.`;
          this.createContractForm.enable();
          this.createContractForm.get('name')?.reset();
          this.createContractForm.get('identifier')?.disable();
          this.createContractForm.get('eventId')?.disable();
          this.createContractForm.get('actionId')?.disable();         
          return;
    }

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

    if (this.createContractForm.get(formControlName)?.hasError('max')) {
      return 'Maximum value surpassed';
    }

    if (this.createContractForm.get(formControlName)?.hasError('min')) {
      return 'Minimum is 0';
    }

    if (this.createContractForm.get(formControlName)?.hasError('invalidMailsPattern')) {
      return this.createContractForm
        .get(formControlName)
        ?.getError('invalidMailsPattern');
    }      

    return this.createContractForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  onProducerSelectionChange(event: MatSelectChange) {
    this.selectedProducerName = event.source.triggerValue;
    this.generateIdentifierAndName();
  }  

  onEventSelectionChange(event: MatSelectChange) {
    this.selectedEventName = event.source.triggerValue;
    this.selectedEventId = event.value;
    this.generateIdentifierAndName();
  }  
  
  onConsumerSelectionChange(event: MatSelectChange) {
    this.selectedConsumerName = event.source.triggerValue;
    this.generateIdentifierAndName();
  }    

  onActionSelectionChange(event: MatSelectChange) {
    this.selectedActionName = event.source.triggerValue;
    this.selectedActionId = event.value;
    this.generateIdentifierAndName();
  }

  generateIdentifierAndName() {
    this.createContractForm
    .get('identifier')
    ?.setValue(`${this.selectedEventId || 0}_${this.selectedActionId || 0}`);
    this.createContractForm
    .get('name')
    ?.setValue(`${this.selectedProducerName || ' '} -> ${this.selectedEventName || ' '} = ${this.selectedConsumerName || ' '} -> ${this.selectedActionName || ' '}`); 
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
          this.afterDialogCloseHandle(res);
        },
      });
  }

  afterDialogCloseHandle(res: any) {
    if (res) {
      this.reload.next(this.reload.value + 1);
    }
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
          this.afterDialogCloseHandle(res);
        },
      });
  }
}
