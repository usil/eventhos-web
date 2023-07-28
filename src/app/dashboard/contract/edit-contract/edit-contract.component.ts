import {
  ContractService,
  ContractUpdateDto,
} from './../../services/contract.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contract } from '../../services/contract.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-edit-contract',
  templateUrl: './edit-contract.component.html',
  styleUrls: ['./edit-contract.component.scss'],
})
export class EditContractComponent implements OnInit {
  editContractForm: FormGroup;
  errorMessage!: string | undefined;

  commonService = new CommonService();

  constructor(
    private contractService: ContractService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public contract: Contract,
    public dialogRef: MatDialogRef<EditContractComponent>
  ) {
    this.editContractForm = this.formBuilder.group({
      name: this.formBuilder.control(
        this.contract.name,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      order: this.formBuilder.control(
        this.contract.order,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(1000),
          Validators.pattern(/^[0-9]+$/),
        ])
      ),
      active: this.formBuilder.control(
        this.contract.active,
        Validators.required
      ),
      mailRecipientsOnError: this.formBuilder.control(
        this.contract.mailRecipientsOnError,
        Validators.compose([this.commonService.severalMailsPatternValidator])
      )
    });
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  updateContract(contractUpdateDto: ContractUpdateDto) {
    this.editContractForm.disable();
    this.contractService
      .editContract(this.contract.id, contractUpdateDto)
      .subscribe({
        error: (err) => {
          this.editContractForm.enable();
          this.dialogRef.disableClose = false;
          if (err.error) {
            this.editContractForm.enable();
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

  getErrorMessage(formControlName: string) {
    if (this.editContractForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.editContractForm.get(formControlName)?.hasError('invalidMailsPattern')) {
      return this.editContractForm
        .get(formControlName)
        ?.getError('invalidMailsPattern');
    }        

    return this.editContractForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }
}
