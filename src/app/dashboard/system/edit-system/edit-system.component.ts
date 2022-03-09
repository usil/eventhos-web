import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Client, ClientService } from '../../services/client.service';
import {
  System,
  SystemService,
  SystemUpdateDto,
} from '../../services/system.service';

@Component({
  selector: 'app-edit-system',
  templateUrl: './edit-system.component.html',
  styleUrls: ['./edit-system.component.scss'],
})
export class EditSystemComponent implements OnInit, OnDestroy {
  systemTypes = [
    'ERP',
    'CRM',
    'CMS',
    'LMS',
    'IOT',
    'ETL',
    'API',
    'MICROSERVICE',
    'SPA',
    'PWA',
    'MONOLITHIC',
    'DESKTOP',
    'EXTERNAL SERVICE',
    'SaaS',
  ];
  editSystemForm: FormGroup;
  originalSystemClass: string;
  errorMessage!: string | undefined;
  clients: Client[] = [];
  client$: Subscription;

  constructor(
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private systemService: SystemService,
    @Inject(MAT_DIALOG_DATA) public system: System,
    public dialogRef: MatDialogRef<EditSystemComponent>
  ) {
    this.originalSystemClass = this.system.class;
    this.editSystemForm = this.formBuilder.group({
      name: this.formBuilder.control(
        this.system.name,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      type: this.formBuilder.control(
        this.system.type,
        Validators.compose([Validators.required])
      ),
      clientId: this.formBuilder.control(
        {
          value: this.system.client_id,
          disabled: false,
        },
        Validators.compose([Validators.required])
      ),
      description: this.formBuilder.control(
        this.system.description,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(255),
        ])
      ),
      systemClass: this.formBuilder.control(
        this.system.class,
        Validators.compose([Validators.required])
      ),
    });
    if (this.editSystemForm.get('systemClass')?.value === 'consumer') {
      this.editSystemForm.get('clientId')?.disable();
    }
    this.client$ = this.editSystemForm
      .get('systemClass')
      ?.valueChanges.subscribe((change) => {
        if (change === 'hybrid' || change === 'producer') {
          this.editSystemForm.get('clientId')?.enable();
        } else {
          this.editSystemForm.get('clientId')?.disable();
        }
      }) as Subscription;
  }
  ngOnDestroy(): void {
    this.client$?.unsubscribe();
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

  updateSystem(systemUpdateDto: SystemUpdateDto) {
    this.editSystemForm.disable();
    this.systemService.editSystem(this.system.id, systemUpdateDto).subscribe({
      error: (err) => {
        this.editSystemForm.enable();
        this.dialogRef.disableClose = false;
        if (err.error) {
          this.editSystemForm.enable();
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: () => {
        this.dialogRef.close(true);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  getErrorMessage(formControlName: string) {
    if (this.editSystemForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.editSystemForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }
}
