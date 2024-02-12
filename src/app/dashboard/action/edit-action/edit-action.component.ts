import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActionService,
  EditActionDto,
  FullAction,
} from './../../services/action.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-edit-action',
  templateUrl: './edit-action.component.html',
  styleUrls: ['./edit-action.component.scss'],
})
export class EditActionComponent implements OnInit, OnDestroy {
  action!: FullAction;
  errorMessage!: string | undefined;
  editActionForm!: FormGroup;
  objectKeys = Object.keys;
  securityTypes = [
    { name: 'custom', code: 0 },
    { name: 'oauth2 client_credentials', code: 1 },
  ];
  operations = ['select', 'new', 'update', 'delete'];
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
  hide = true;
  headersFormArray!: FormArray;
  queryFormArray!: FormArray;
  changeType$!: Subscription;
  methodChangeSubscription$!: Subscription;
  bodyInputType$!: Subscription;

  commonService = new CommonService();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private actionService: ActionService,
    private formBuilder: FormBuilder
  ) {
    if (this.activatedRoute.snapshot.queryParams['actionId'] !== undefined) {
      this.actionService
        .getAction(
          this.activatedRoute.snapshot.queryParams['actionId'] as number
        )
        .subscribe({
          error: (err) => {
            if (err.error) {
              this.errorMessage = err.error.message;
            } else {
              this.errorMessage = 'Unknown Error';
            }
          },
          next: (getActionResult) => {
            this.addForm(getActionResult.content as FullAction);
            this.action = getActionResult.content as FullAction;
          },
        });
    } else {
      this.router.navigate(['/dashboard/action']);
    };
  }

  addForm(action: FullAction) {
    let securityCode = 1;
    switch (action.security.type) {
      case 'custom':
        securityCode = 0;
        break;
      case 'oauth2_client':
        securityCode = 1;
        break;
      default:
        securityCode = 0;
        break;
    }
    this.editActionForm = this.formBuilder.group({
      name: this.formBuilder.control(
        action.name,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      reply_to: this.formBuilder.control(
        action.reply_to
      ),      
      operation: this.formBuilder.control(
        action.operation,
        Validators.compose([Validators.required])
      ),
      description: this.formBuilder.control(
        action.description,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(255),
        ])
      ),
      method: this.formBuilder.control(
        action.httpConfiguration.method,
        Validators.compose([Validators.required])
      ),
      inputType: this.formBuilder.control(
        Object.keys(action.httpConfiguration.data).length > 0 ? "raw" : action.httpConfiguration?.rawFunctionBody ? "function" : "raw",
      ),
      rawBody: this.formBuilder.control(
        {
          value: JSON.stringify(action.httpConfiguration.data, null, 4),
          disabled: true,
        },
        Validators.compose([Validators.required, this.jsonParseValidator])
      ),
      rawFunctionBody: this.formBuilder.control(
        {
          value: action.httpConfiguration?.rawFunctionBody ?? undefined,
          disabled: true,
        },
        Validators.compose([])
      ),
      securityType: this.formBuilder.control(
        securityCode,
        Validators.compose([Validators.required])
      ),
      url: this.formBuilder.control(
        action.httpConfiguration.url,
        Validators.compose([Validators.required, Validators.minLength(2)])
      ),
      securityUrl: this.formBuilder.control(
        { value: action.security.httpConfiguration?.url || '', disabled: true },
        Validators.compose([Validators.required, Validators.minLength(2)])
      ),
      clientSecret: this.formBuilder.control(
        {
          value: action.security.httpConfiguration?.params
            ? action.security.httpConfiguration?.params['client_secret']
            : '',
          disabled: true,
        },
        Validators.compose([this.commonService.secretPatternValidator])
      ),
      clientId: this.formBuilder.control(
        {
          value: action.security.httpConfiguration?.params
            ? action.security.httpConfiguration?.params['client_id']
            : '',
          disabled: true,
        },
        Validators.compose([Validators.required])
      ),
      headers: this.formBuilder.array([]),
      queryUrlParams: this.formBuilder.array([]),
    });
    if (
      action.httpConfiguration.method === 'post' ||
      action.httpConfiguration.method === 'put' ||
      action.httpConfiguration.method === 'get'||
      action.httpConfiguration.method === 'delete' 
    ) {
      this.editActionForm.get('rawBody')?.enable();
      this.editActionForm.get('rawFunctionBody')?.enable();
    }
    if (action.security.type === 'oauth2_client') {
      this.editActionForm.get('clientId')?.enable();
      this.editActionForm.get('clientSecret')?.enable();
      this.editActionForm.get('securityUrl')?.enable();
      this.editActionForm
        .get('clientSecret')
        ?.setValue(action.security.httpConfiguration?.data['client_secret']);
      this.editActionForm
        .get('clientId')
        ?.setValue(action.security.httpConfiguration?.data['client_id']);
    }
    this.bodyInputType$ = this.editActionForm
      .get('inputType')
      ?.valueChanges.subscribe((value: 'raw' | 'function') => {
        if (value == 'raw') {
          this.editActionForm.get('rawFunctionBody')?.reset();
        } else {
          this.editActionForm.get('rawBody')?.setValue("{}");
        }
      }) as Subscription
    this.methodChangeSubscription$ = this.editActionForm
      .get('method')
      ?.valueChanges.subscribe((changeValue) => {
        if (changeValue === 'post' || changeValue === 'put' || changeValue === 'get' || changeValue === 'delete') {
          this.editActionForm.get('rawBody')?.enable();
          this.editActionForm.get('rawFunctionBody')?.enable();
        } else {
          this.editActionForm.get('rawBody')?.disable();
          this.editActionForm.get('rawFunctionBody')?.disable();
          this.editActionForm.get('rawBody')?.setValue("{}");
          this.editActionForm.get('rawFunctionBody')?.reset();
        }
      }) as Subscription;
    this.headersFormArray = this.editActionForm.get('headers') as FormArray;
    this.queryFormArray = this.editActionForm.get(
      'queryUrlParams'
    ) as FormArray;
    this.changeType$ = this.editActionForm
      .get('securityType')
      ?.valueChanges.subscribe({
        next: (code: number) => {
          this.editActionForm.get('clientId')?.disable();
          this.editActionForm.get('clientSecret')?.disable();
          this.editActionForm.get('securityUrl')?.disable();
          if (code === 1) {
            this.editActionForm.get('clientId')?.enable();
            this.editActionForm.get('clientSecret')?.enable();
            this.editActionForm.get('securityUrl')?.enable();
          }
        },
      }) as Subscription;

    for (const key in action.httpConfiguration.headers) {
      const value = action.httpConfiguration.headers[key] as string;
      this.addHeaderPair({ key, value });
    }

    for (const key in action.httpConfiguration.params) {
      const value = action.httpConfiguration.params[key] as string;
      this.addUrlQueryParamPair({ key, value });
    }
  }

  jsonParseValidator(control: AbstractControl) {
    try {
      JSON.parse(control.value);
    } catch (error: any) {
      return { jsonInvalid: error.message };
    }
    return null;
  }

  ngOnInit(): void {}

  getErrorMessage(formControlName: string) {
    if (this.editActionForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.editActionForm.get(formControlName)?.hasError('jsonInvalid')) {
      return this.editActionForm
        .get(formControlName)
        ?.getError('jsonInvalid');
    }

    if (this.editActionForm.get(formControlName)?.hasError('secretInvalid')) {
      return this.editActionForm
        .get(formControlName)
        ?.getError('secretInvalid');
    }        

    return this.editActionForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  updateAction(editActionDto: EditActionDto) {
    this.editActionForm.disable();
    editActionDto.rawBody = JSON.parse(
      (editActionDto.rawBody as string) || ('{}' as string)
    );
    this.actionService
      .editAction(this.action.id, { ...editActionDto })
      .subscribe({
        error: (err) => {
          this.editActionForm.enable();
          this.editActionForm.get('identifier')?.disable();
          if (this.editActionForm.get('securityType')?.value !== 1) {
            this.editActionForm.get('securityUrl')?.disable();
            this.editActionForm.get('clientSecret')?.disable();
            this.editActionForm.get('clientId')?.disable();
          }
          if (err.error) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Unknown Error';
          }
        },
        next: () => {
          this.router.navigate(['/dashboard/action']);
        },
      });
  }

  tapKeyPressedInTextarea(
    keyEvent: KeyboardEvent,
    rawBodyTextArea: HTMLTextAreaElement
  ) {
    if (keyEvent.key === 'Tab') {
      const startPost = rawBodyTextArea.selectionStart;
      keyEvent.preventDefault();
      const rawBodyRef = this.editActionForm.get('rawBody');
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

  addHeaderPair(headerPair = { key: '', value: '' }): void {
    const baseFormGroup = this.formBuilder.group({
      key: this.formBuilder.control(
        headerPair.key,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
          Validators.minLength(2),
          Validators.maxLength(75),
        ])
      ),
      value: this.formBuilder.control(
        headerPair.value,
        Validators.compose([Validators.required])
      ),
    });
    this.headersFormArray.push(baseFormGroup);
  }

  addUrlQueryParamPair(paramPair = { key: '', value: '' }): void {
    const baseFormGroup = this.formBuilder.group({
      key: this.formBuilder.control(
        paramPair.key,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
          Validators.minLength(2),
          Validators.maxLength(75),
        ])
      ),
      value: this.formBuilder.control(
        paramPair.value,
        Validators.compose([Validators.required])
      ),
    });
    this.queryFormArray.push(baseFormGroup);
  }

  ngOnDestroy(): void {
    this.changeType$?.unsubscribe();
    this.methodChangeSubscription$?.unsubscribe();
  }

  removeHeaderPair(groupIndex: number): void {
    this.headersFormArray.removeAt(groupIndex);
  }

  removeUrlQueryParamPair(groupIndex: number): void {
    this.queryFormArray.removeAt(groupIndex);
  }
}
