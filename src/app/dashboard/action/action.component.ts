import { Router } from '@angular/router';
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
  AbstractControl,
  FormControl,
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
  skip,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs';
import { System, SystemService } from '../services/system.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../common/common.service';
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
  operations = ['new', 'update', 'delete', 'execution', 'other'];
  methods = ['get', 
    'post', 
    'put', 
    'delete', 
    'patch', 
    'copy', 
    'head',
    'options',
    'link',
    'unlink',
    'purge',
    'lock',
    'unlock',
    'propfind',
    'view'
  ];
  securityTypes = [
    { name: 'custom', code: 0 },
    { name: 'oauth2 client_credentials', code: 1 },
  ];
  producerSystems: System[] = [];
  generateIdentifier$: Subscription;
  bodyInputType$: Subscription;
  changeType$: Subscription;
  headersFormArray: FormArray;
  queryFormArray: FormArray;
  bodyFormArray: FormArray;
  hide = true;
  searchActionForm: FormGroup;
  wordSearchChange$: Subscription;
  wordSearch = "";

  reload = new BehaviorSubject<number>(0);

  commonService = new CommonService();

  constructor(
    private actionService: ActionService,
    private systemService: SystemService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.createActionForm = this.formBuilder.group({
      identifier: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      reply_to: this.formBuilder.control(
        { value: '', disabled: false },
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
      bodyInput: this.formBuilder.control('keyValue'),
      rawBody: this.formBuilder.control(
        { value: '{}', disabled: true },
        Validators.compose([Validators.required, this.jsonParseValidator])
      ),
      rawFunctionBody: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([])
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
      clientSecret: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([this.commonService.secretPatternValidator])
      ),
      clientId: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      headers: this.formBuilder.array([]),
      body: this.formBuilder.array([]),
      queryUrlParams: this.formBuilder.array([]),
    });

    this.searchActionForm = this.formBuilder.group({
      wordSearch: this.formBuilder.control(''),
    });

    this.wordSearchChange$ = this.searchActionForm
      .get('wordSearch')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(750))
      .subscribe((changeValue) => {
        this.wordSearch = changeValue;
        this.paginator.pageIndex = 0;
        this.reload.next(this.reload.value + 1);
      }) as Subscription;

    this.headersFormArray = this.createActionForm.get('headers') as FormArray;

    this.bodyInputType$ = this.createActionForm
      .get('bodyInput')
      ?.valueChanges.subscribe((value: 'raw' | 'keyValue' | 'function') => {
        if (value === 'keyValue') {
          this.createActionForm.get('body')?.enable();
          this.createActionForm.get('rawBody')?.disable();
          this.createActionForm.get('rawBody')?.reset();
          this.createActionForm.get('rawFunctionBody')?.disable()
          this.createActionForm.get('rawFunctionBody')?.reset()
        } else if ( value === "raw") {
          this.createActionForm.get('body')?.disable();
          this.createActionForm.get('body')?.reset()
          this.createActionForm.get('rawFunctionBody')?.disable()
          this.createActionForm.get('rawFunctionBody')?.reset()
          this.createActionForm.get('rawBody')?.enable();
        } else {
          this.createActionForm.get('body')?.disable();
          this.createActionForm.get('body')?.reset();
          this.createActionForm.get('rawBody')?.disable();
          this.createActionForm.get('rawBody')?.reset();
          this.createActionForm.get('rawFunctionBody')?.enable()

        }
      }) as Subscription;

    this.queryFormArray = this.createActionForm.get(
      'queryUrlParams'
    ) as FormArray;

    this.bodyFormArray = this.createActionForm.get('body') as FormArray;

    this.generateIdentifier$ = merge(
      this.createActionForm.get('name')?.valueChanges as Observable<any>,
      this.createActionForm.get('operation')?.valueChanges as Observable<any>
    ).subscribe({
      next: () => {
        let name = this.createActionForm.get('name')?.value as string;
        const type = this.createActionForm.get('operation')?.value as string;
        if ((name && name !== '') && (type && type !== '')) {          
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
          if (code === 1) {
            this.createActionForm.get('clientId')?.enable();
            this.createActionForm.get('clientSecret')?.enable();
            this.createActionForm.get('jsonPath')?.enable();
            this.createActionForm.get('securityUrl')?.enable();
          }
        },
      }) as Subscription;
  }

  jsonParseValidator(control: AbstractControl) {
    try {
      JSON.parse(control.value);
    } catch (error: any) {
      return { jsonInvalid: error.message };
    }
    return null;
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
          return this.actionService
            .getActions(
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
        this.actions = data;
      });
  }

  tapKeyPressedInTextarea(
    keyEvent: KeyboardEvent,
    rawBodyTextArea: HTMLTextAreaElement
  ) {
    if (keyEvent.key === 'Tab') {
      const startPost = rawBodyTextArea.selectionStart;
      keyEvent.preventDefault();
      const rawBodyRef = this.createActionForm.get(rawBodyTextArea as unknown as string);
      const originalValue = rawBodyRef?.value as string;

      rawBodyRef?.setValue(
        originalValue.substring(0, startPost) +
          '   ' +
          originalValue.substring(startPost)
      );

      rawBodyTextArea.selectionStart = rawBodyTextArea.selectionEnd =
        startPost + 3;
    }
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
    this.bodyInputType$?.unsubscribe();
    this.wordSearchChange$?.unsubscribe()
  }

  getErrorMessage(formControlName: string) {
    if (this.createActionForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.createActionForm.get(formControlName)?.hasError('jsonInvalid')) {
      return this.createActionForm
        .get(formControlName)
        ?.getError('jsonInvalid');
    }

    if (this.createActionForm.get(formControlName)?.hasError('secretInvalid')) {
      return this.createActionForm
        .get(formControlName)
        ?.getError('secretInvalid');
    }    

    return this.createActionForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  createAction(createEventFormBody: CreateActionDto) {
    this.createActionForm.disable();
    if (createEventFormBody.rawBody) {
      createEventFormBody.rawBody = JSON.parse(
        createEventFormBody.rawBody as string
      );
    }
    const identifier = this.createActionForm.get('identifier')?.value;
    this.actionService
      .createAction({ ...createEventFormBody, identifier })
      .subscribe({
        error: (err) => {
          this.createActionForm.enable();
          this.createActionForm.get('identifier')?.disable();
          if (this.createActionForm.get('securityType')?.value !== 1) {
            this.createActionForm.get('securityUrl')?.disable();
            this.createActionForm.get('clientSecret')?.disable();
            this.createActionForm.get('clientId')?.disable();
          }
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

  goToEditPage(action: Action) {
    this.router.navigate([`/dashboard/action/edit`], {
      queryParams: {
        actionId: action.id,
      },
    });
  }
}
