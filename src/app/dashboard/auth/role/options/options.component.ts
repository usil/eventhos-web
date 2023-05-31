import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Option, Resource, ResourceService } from 'src/app/dashboard/services/resource.service';
import { Role, RoleService } from 'src/app/dashboard/services/role.service';

@Component({
  selector: 'lib-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit, OnDestroy {
  optionsForm: FormGroup;
  errorMessage!: string;
  options: Resource[] = [];
  allowedShowList: Option[] = [];
  allowedObject: Record<string, Option[]> = {};
  originalAllowedObject: Record<string, Option[]> = {};
  objectKeys = Object.keys;
  convertToString = JSON.stringify;

  selectedSubscription: Subscription;
  resourceSubscription: Subscription;

  constructor(
    public dialogRef: MatDialogRef<OptionsComponent>,
    @Inject(MAT_DIALOG_DATA) public role: Role,
    private resourceService: ResourceService,
    private roleService: RoleService,
    private formBuilder: FormBuilder
  ) {
    for (const option of this.role.resources) {
      this.allowedObject[option.applicationResourceName] = [...option.allowed];
      this.originalAllowedObject[option.applicationResourceName] = [
        ...option.allowed,
      ];
    }

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
    this.optionsForm = this.formBuilder.group({
      resource: this.formBuilder.control(''),
      selected: this.formBuilder.control([]),
    });
    this.resourceSubscription = this.optionsForm
      .get('resource')
      ?.valueChanges.subscribe({
        next: (value) => {
          this.allowedShowList =
            this.options.find((o) => o.applicationResourceName === value)
              ?.allowed || [];

          this.optionsForm
            .get('selected')
            ?.setValue(
              this.allowedObject[this.optionsForm.get('resource')?.value]?.map(
                (asl) => JSON.stringify(asl)
              ) || []
            );
        },
      }) as Subscription;

    this.selectedSubscription = this.optionsForm
      .get('selected')
      ?.valueChanges.subscribe((valueChange: string[]) => {
        const currentAllowedObject =
          this.allowedObject[this.optionsForm.get('resource')?.value] || [];

        if (valueChange.length === 0 && currentAllowedObject.length === 0)
          return;

        let newOptionEntry: Option;

        if (currentAllowedObject.length === 0) {
          newOptionEntry = JSON.parse(valueChange[0]);
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
          JSON.parse(valueChange[0]).allowed !== '*'
        ) {
          newOptionEntry = currentAllowedObject[0];
          this.selectedChange(false, newOptionEntry);
          return;
        }

        if (JSON.parse(valueChange[0]).allowed === '*') {
          newOptionEntry = JSON.parse(valueChange[0]);
          this.selectedChange(true, newOptionEntry);
          return;
        }

        if (currentAllowedObject.length > valueChange.length) {
          for (const allowed of currentAllowedObject) {
            const indexOfAllowed = valueChange.findIndex(
              (v) => JSON.parse(v).id === allowed.id
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
            (c) => c.id === JSON.parse(value).id
          );

          if (indexOfAllowed === -1) {
            newOptionEntry = JSON.parse(value);
            this.selectedChange(true, newOptionEntry);
            break;
          }
        }
      }) as Subscription;
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.resourceSubscription?.unsubscribe();
    this.selectedSubscription?.unsubscribe();
  }

  selectedChange(selected: boolean, value: Option) {
    if (
      value.allowed === '*' &&
      selected &&
      this.optionsForm.get('selected')?.value.length !==
        this.allowedShowList.length
    ) {
      this.optionsForm
        .get('selected')
        ?.setValue(
          this.allowedShowList.map((aso) => JSON.stringify(aso)) || []
        );
      this.allowedObject[this.optionsForm.get('resource')?.value] = [
        this.allowedShowList[0],
      ];
    } else if (value.allowed === '*' && !selected) {
      const temporalAllowed = [...this.allowedShowList];
      temporalAllowed.shift();
      this.allowedObject[this.optionsForm.get('resource')?.value] =
        temporalAllowed;
    } else if (selected) {
      this.allowedObject[this.optionsForm.get('resource')?.value] = (
        this.optionsForm.get('selected')?.value as string[]
      ).map((stringObj) => {
        return JSON.parse(stringObj);
      });
    } else {
      if (this.optionsForm.get('selected')?.value.length === 0) {
        delete this.allowedObject[this.optionsForm.get('resource')?.value];
      } else {
        this.allowedObject[this.optionsForm.get('resource')?.value] = (
          this.optionsForm.get('selected')?.value as string[]
        ).map((stringObj) => {
          return JSON.parse(stringObj);
        });
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateOptions() {
    this.roleService
      .updateRoleOptions(
        this.role.id,
        this.allowedObject,
        this.originalAllowedObject
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
      });
  }
}
