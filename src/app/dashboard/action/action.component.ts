import { DeleteActionComponent } from './delete-action/delete-action.component';
import {
  Action,
  ActionService,
  CreateActionDto,
} from './../services/action.service';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormGroupDirective,
} from '@angular/forms';
import {
  Subscription,
  merge,
  Observable,
  catchError,
  map,
  of,
  startWith,
  switchMap,
  BehaviorSubject,
  first,
} from 'rxjs';
import { System, SystemService } from '../services/system.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'operation',
    'description',
    'system_id',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  roleDataSubscription!: Subscription;

  actions: Action[] = [];

  isLoadingResults = true;

  resultsLength = 0;

  pageSize = 10;

  errorMessage!: string | undefined;

  createActionForm: FormGroup;
  operations = ['select', 'new', 'update', 'delete'];
  methods = ['get', 'post', 'put', 'delete'];
  securityTypes = [
    { name: 'public', code: 1 },
    { name: 'oauth2 client', code: 2 },
    { name: 'api key query', code: 4 },
    { name: 'api key header', code: 5 },
  ];
  producerSystems: System[] = [];
  generateIdentifier$: Subscription;
  changeType$: Subscription;
  headersFormArray: FormArray;
  queryFormArray: FormArray;
  bodyFormArray: FormArray;
  hide = true;

  reload = new BehaviorSubject<number>(0);

  constructor(
    private actionService: ActionService,
    private systemService: SystemService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.createActionForm = this.formBuilder.group({
      identifier: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      system_id: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      name: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      operation: this.formBuilder.control(
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
      method: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      securityType: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      url: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.minLength(2)])
      ),
      securityUrl: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required, Validators.minLength(2)])
      ),
      username: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      password: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      clientSecret: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-]+$/),
          Validators.minLength(1),
        ])
      ),
      clientId: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      headers: this.formBuilder.array([]),
      body: this.formBuilder.array([]),
      queryUrlParams: this.formBuilder.array([]),
    });

    this.headersFormArray = this.createActionForm.get('headers') as FormArray;

    this.queryFormArray = this.createActionForm.get(
      'queryUrlParams'
    ) as FormArray;

    this.bodyFormArray = this.createActionForm.get('body') as FormArray;

    this.generateIdentifier$ = merge(
      this.reload,
      this.createActionForm.get('name')?.valueChanges as Observable<any>,
      this.createActionForm.get('operation')?.valueChanges as Observable<any>
    ).subscribe({
      next: () => {
        let name = this.createActionForm.get('name')?.value as string;
        if (name && name !== '') {
          const type = this.createActionForm.get('operation')?.value as string;
          name = name.trim();
          name = name.replace(' ', '_');
          name = name.toLocaleLowerCase();
          this.createActionForm
            .get('identifier')
            ?.setValue(`${name}_${type.toLocaleLowerCase()}`);
        }
      },
    });

    this.changeType$ = this.createActionForm
      .get('securityType')
      ?.valueChanges.subscribe({
        next: (code: number) => {
          this.createActionForm.get('username')?.disable();
          this.createActionForm.get('password')?.disable();
          this.createActionForm.get('clientId')?.disable();
          this.createActionForm.get('clientSecret')?.disable();
          this.createActionForm.get('jsonPath')?.disable();
          this.createActionForm.get('securityUrl')?.disable();
          if (code === 3) {
            this.createActionForm.get('username')?.enable();
            this.createActionForm.get('password')?.enable();
            this.createActionForm.get('jsonPath')?.enable();
            this.createActionForm.get('securityUrl')?.enable();
          }
          if (code === 2) {
            this.createActionForm.get('clientId')?.enable();
            this.createActionForm.get('clientSecret')?.enable();
            this.createActionForm.get('jsonPath')?.enable();
            this.createActionForm.get('securityUrl')?.enable();
          }
        },
      }) as Subscription;
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.roleDataSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.reload
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this.errorMessage = undefined;
          this.isLoadingResults = true;
          return this.actionService
            .getActions(
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
          console.log(data);
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          this.resultsLength = data.content?.totalItems || 0;
          return data.content?.items || [];
        })
      )
      .subscribe((data) => {
        this.actions = data;
      });
  }

  removeHeaderPair(groupIndex: number): void {
    this.headersFormArray.removeAt(groupIndex);
  }

  removeBodyPair(groupIndex: number): void {
    this.bodyFormArray.removeAt(groupIndex);
  }

  removeUrlQueryParamPair(groupIndex: number): void {
    this.queryFormArray.removeAt(groupIndex);
  }

  addHeaderPair(): void {
    const baseFormGroup = this.formBuilder.group({
      key: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
          Validators.minLength(2),
          Validators.maxLength(75),
        ])
      ),
      value: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
    });
    this.headersFormArray.push(baseFormGroup);
  }

  addBodyPair(): void {
    const baseFormGroup = this.formBuilder.group({
      key: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
          Validators.minLength(2),
          Validators.maxLength(75),
        ])
      ),
      value: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
    });
    this.bodyFormArray.push(baseFormGroup);
  }

  addUrlQueryParamPair(): void {
    const baseFormGroup = this.formBuilder.group({
      key: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
          Validators.minLength(2),
          Validators.maxLength(75),
        ])
      ),
      value: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
    });
    this.queryFormArray.push(baseFormGroup);
  }

  ngOnDestroy(): void {
    this.generateIdentifier$?.unsubscribe();
    this.changeType$?.unsubscribe();
    this.roleDataSubscription?.unsubscribe();
  }

  getErrorMessage(formControlName: string) {
    if (this.createActionForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.createActionForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  createAction(createEventFormBody: CreateActionDto) {
    this.createActionForm.disable();
    const identifier = this.createActionForm.get('identifier')?.value;
    this.actionService
      .createAction({ ...createEventFormBody, identifier })
      .subscribe({
        error: (err) => {
          this.createActionForm.enable();
          this.createActionForm.get('identifier')?.disable();
          if (err.error) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Unknown Error';
          }
        },
        next: () => {
          this.reload.next(this.reload.value + 1);
          this.createActionForm.reset();
          this.formDirective.resetForm();
          this.createActionForm.enable();
          this.createActionForm.get('identifier')?.disable();
        },
      });
  }

  ngOnInit(): void {
    this.systemService.getSystems('id', 'desc', 0, 100, 'consumer').subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: (res) => {
        this.producerSystems = res.content?.items || [];
      },
    });
  }

  openDeleteDialog(action: Action) {
    const deleteActionDialogRef = this.dialog.open(DeleteActionComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: action,
    });

    deleteActionDialogRef
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
