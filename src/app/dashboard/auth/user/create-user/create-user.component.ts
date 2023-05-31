import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BasicRole, RoleService } from 'src/app/dashboard/services/role.service';
import { UserService } from 'src/app/dashboard/services/user.service';

@Component({
  selector: 'create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  createUserForm: FormGroup;
  errorMessage!: string;
  errorMessageRoles!: string;
  roles: BasicRole[] = [];
  rolesList: BasicRole[] = [];
  hidePassword = true;

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    private formBuilder: FormBuilder,
    private roleService: RoleService,
    private userService: UserService

  ) {
    this.roleService.getRolesBasic().subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
        this.roles = [];
      },
      next: (res) => {
        this.roles = res.content || [];
      },
    });
    this.createUserForm = this.formBuilder.group({
      name: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(45),
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
        ])
      ),
      description: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(255),
        ])
      ),
      username: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]+$/),
          Validators.minLength(4),
          Validators.maxLength(20),
        ])
      ),
      password: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9\d@$!%*#?&]*[A-Z]+[a-zA-Z0-9\d@$!%*#?&]*$/
          ),
          Validators.pattern(
            /^[a-zA-Z0-9\d@$!%*#?&]*[0-9]+[a-zA-Z0-9\d@$!%*#?&]*$/
          ),
          Validators.pattern(
            /^[a-zA-Z0-9\d@$!%*#?&]*[a-z]+[a-zA-Z0-9\d@$!%*#?&]*$/
          ),
          Validators.minLength(6),
        ])
      ),
      role: this.formBuilder.control(''),
    });
  }

  ngOnInit(): void {}

  addRoleToList() {
    const roleValue = this.createUserForm.get('role')?.value;
    if (!roleValue) {
      return;
    }
    const indexOfRole = this.roles.indexOf(roleValue);
    this.roles.splice(indexOfRole, 1);
    this.rolesList.push(roleValue);
    this.createUserForm.get('role')?.setValue('');
  }

  removeRoleToList(role: BasicRole) {
    const roleValue = role;
    const indexOfRole = this.rolesList.indexOf(roleValue);
    this.roles.unshift(role);
    this.rolesList.splice(indexOfRole, 1);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  createUser(createUserData: {
    name: string;
    username: string;
    password: string;
    role: string | undefined;
  }) {
    createUserData.role = undefined;
    this.dialogRef.disableClose = true;
    this.userService
      .createUser({ ...createUserData, roles: this.rolesList })
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
