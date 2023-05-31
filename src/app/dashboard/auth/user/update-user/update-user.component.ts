import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User, UserService, UserUpdateBody } from 'src/app/dashboard/services/user.service';

@Component({
  selector: 'update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss'],
})
export class UpdateUserComponent implements OnInit {
  errorMessage!: string;
  updateUserForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.updateUserForm = this.formBuilder.group({
      name: this.formBuilder.control(
        user.name,
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

  updateUser(updateUserData: UserUpdateBody) {
    this.dialogRef.disableClose = true;
    this.userService.updateUser(this.user.subjectId, updateUserData).subscribe({
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
