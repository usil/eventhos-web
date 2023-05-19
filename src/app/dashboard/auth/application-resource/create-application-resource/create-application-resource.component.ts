import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Application, ApplicationService } from 'src/app/dashboard/services/application.service';
import { ResourceService } from 'src/app/dashboard/services/resource.service';

@Component({
  selector: 'lib-create-application-resource',
  templateUrl: './create-application-resource.component.html',
  styleUrls: ['./create-application-resource.component.scss'],
})
export class CreateApplicationResourceComponent implements OnInit {
  createResourceForm: FormGroup;
  errorMessage!: string;
  errorMessageRoles!: string;
  applications: Application[] = [];
  hidePassword = true;

  loadingResult = false;

  constructor(
    public dialogRef: MatDialogRef<CreateApplicationResourceComponent>,
    private formBuilder: FormBuilder,
    private resourceService: ResourceService,
    private applicationService: ApplicationService
  ) {
    this.applicationService.getApplications().subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
        this.applications = [];
      },
      next: (res) => {
        this.applications = res.content || [];
      },
    });
    this.createResourceForm = this.formBuilder.group({
      resourceIdentifier: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(45),
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
        ])
      ),
      application: this.formBuilder.control(
        '',
        Validators.compose([Validators.required, Validators.min(1)])
      ),
    });
  }

  ngOnInit(): void {}

  createResource(createResourceForm: {
    resourceIdentifier: string;
    application: number;
  }) {
    this.loadingResult = true;
    this.resourceService
      .createResource(
        createResourceForm.resourceIdentifier,
        createResourceForm.application
      )
      .subscribe({
        error: (err) => {
          this.dialogRef.disableClose = false;
          if (err.error) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Unknown Error';
          }
        },
        next: () => {
          this.dialogRef.close(true);
        },
        complete: () => {
          this.loadingResult = false;
        },
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
