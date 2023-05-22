import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client, ClientService, ClientUpdateBody } from 'src/app/dashboard/services/client.service';


@Component({
  selector: 'update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss'],
})
export class UpdateClientComponent implements OnInit {
  errorMessage!: string;
  updateUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateClientComponent>,
    private clientService: ClientService,
    @Inject(MAT_DIALOG_DATA) public client: Client
  ) {
    this.updateUserForm = this.formBuilder.group({
      name: this.formBuilder.control(
        client.name,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(45),
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
        ])
      ),
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateUser(updateClientData: ClientUpdateBody) {
    this.dialogRef.disableClose = true;
    this.clientService
      .updateClient(this.client.subjectId, updateClientData)
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

  ngOnInit(): void {}
}
