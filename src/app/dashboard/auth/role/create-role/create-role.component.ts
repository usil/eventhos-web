import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Option, Resource, ResourceService } from 'src/app/dashboard/services/resource.service';
import { RoleService } from 'src/app/dashboard/services/role.service';

@Component({
  selector: 'lib-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss'],
})
export class CreateRoleComponent implements OnInit, OnDestroy {
  createRoleForm: FormGroup;
  errorMessage!: string;
  options: Resource[] = [];
  allowedShowList: Option[] = [];
  allowedObject: Record<string, Option[]> = {};
  objectKeys = Object.keys;

  selectedSubscription: Subscription;
  resourceSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private resourceService: ResourceService,
    public dialogRef: MatDialogRef<CreateRoleComponent>
  ) {
    this.resourceService.getResourcesBasic().subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
        this.options = [];
      },
      next: (res) => {
        this.options = res.content || [];
      },
    });
    this.createRoleForm = this.formBuilder.group({
      identifier: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/]+$/),
          Validators.minLength(4),
          Validators.maxLength(20),
        ])
      ),
      resource: this.formBuilder.control(''),
      selected: this.formBuilder.control(''),
    });
    this.resourceSubscription = this.createRoleForm
      .get('resource')
      ?.valueChanges.subscribe({
        next: (value: string) => {
          this.allowedShowList =
            this.options.find((o) => o.applicationResourceName === value)
              ?.allowed || [];
          this.createRoleForm
            .get('selected')
            ?.setValue(this.allowedObject[value] || []);
        },
      }) as Subscription;

    this.selectedSubscription = this.createRoleForm
      .get('selected')
      ?.valueChanges.subscribe((valueChange: Option[]) => {
        const currentAllowedObject =
          this.allowedObject[this.createRoleForm.get('resource')?.value] || [];

        if (valueChange.length === 0 && currentAllowedObject.length === 0)
          return;

        let newOptionEntry: Option;

        if (currentAllowedObject.length === 0) {
          newOptionEntry = valueChange[0];
          this.selectedChange(true, newOptionEntry);
          return;
        }

        if (valueChange.length === 0) {
          newOptionEntry = currentAllowedObject[0];
          this.selectedChange(false, newOptionEntry);
          return;
        }

        if (
          currentAllowedObject[0].allowed === '*' &&
          valueChange[0].allowed !== '*'
        ) {
          newOptionEntry = currentAllowedObject[0];
          this.selectedChange(false, newOptionEntry);
          return;
        }

        if (valueChange[0].allowed === '*') {
          newOptionEntry = valueChange[0];
          this.selectedChange(true, newOptionEntry);
          return;
        }

        if (currentAllowedObject.length > valueChange.length) {
          for (const allowed of currentAllowedObject) {
            const indexOfAllowed = valueChange.findIndex(
              (v) => v.id === allowed.id
            );

            if (indexOfAllowed === -1) {
              newOptionEntry = allowed;
              this.selectedChange(false, newOptionEntry);
              break;
            }
          }

          return;
        }

        for (const value of valueChange) {
          const indexOfAllowed = currentAllowedObject.findIndex(
            (c) => c.id === value.id
          );

          if (indexOfAllowed === -1) {
            newOptionEntry = value;
            this.selectedChange(true, newOptionEntry);
            break;
          }
        }
      }) as Subscription;
  }

  ngOnDestroy(): void {
    this.resourceSubscription?.unsubscribe();
    this.selectedSubscription?.unsubscribe();
  }

  ngOnInit(): void {}

  createRole(roleBody: { identifier: string; resource: string | undefined }) {
    this.roleService
      .createRole(roleBody.identifier, this.allowedObject)
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
      });
  }

  selectedChange(selected: boolean, value: Option) {
    // const currentAllowedObject =
    //   this.allowedObject[this.createRoleForm.get('resource')?.value];
    if (
      value.allowed === '*' &&
      selected &&
      this.createRoleForm.get('selected')?.value.length !==
        this.allowedShowList.length
    ) {
      this.createRoleForm.get('selected')?.setValue(this.allowedShowList);
      this.allowedObject[this.createRoleForm.get('resource')?.value] = [
        this.allowedShowList[0],
      ];
    } else if (value.allowed === '*' && !selected) {
      const temporalAllowed = [...this.allowedShowList];
      temporalAllowed.shift();
      this.allowedObject[this.createRoleForm.get('resource')?.value] =
        temporalAllowed;
    } else if (selected) {
      this.allowedObject[this.createRoleForm.get('resource')?.value] =
        this.createRoleForm.get('selected')?.value;
    } else {
      if (this.createRoleForm.get('selected')?.value.length === 0) {
        delete this.allowedObject[this.createRoleForm.get('resource')?.value];
      } else {
        this.allowedObject[this.createRoleForm.get('resource')?.value] =
          this.createRoleForm.get('selected')?.value;
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
