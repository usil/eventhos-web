import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContractService, Contract } from '../../services/contract.service';
import { Event } from '../../services/event.service';
import { FormBuilder, Validators, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-contracts',
  templateUrl: './view-contracts.component.html',
  styleUrls: ['./view-contracts.component.scss'],
})
export class ViewContractsComponent implements OnInit {
  errorMessage!: string | undefined;
  contracts: Contract[] = [];
  ordersFormArray: FormArray;
  ordersFormGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    @Inject(MAT_DIALOG_DATA) public event: Event,
    public dialogRef: MatDialogRef<ViewContractsComponent>
  ) {
    this.ordersFormGroup = this.formBuilder.group({
      orders: this.formBuilder.array([]),
    });

    this.ordersFormArray = this.ordersFormGroup.get('orders') as FormArray;
  }

  ngOnInit(): void {
    this.contractService.getContractsFromEvent(this.event.id).subscribe({
      next: (res) => {
        this.contracts = res.content;

        for (const contract of this.contracts) {
          const orderFormGroup = this.formBuilder.group({
            contractId: this.formBuilder.control(contract.id),
            order: this.formBuilder.control(
              contract.order,
              Validators.compose([
                Validators.required,
                Validators.min(0),
                Validators.max(1000),
                Validators.pattern(/^[0-9]+$/),
              ])
            ),
          });
          this.ordersFormArray.push(orderFormGroup);
        }
      },
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message || err.error;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
    });
  }

  updateContractsOrder() {
    this.contractService
      .updateContractOrders(this.ordersFormGroup.value.orders)
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          if (err.error) {
            this.errorMessage = err.error.message || err.error;
          } else {
            this.errorMessage = 'Unknown Error';
          }
        },
      });
    console.log(this.ordersFormGroup.value);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
