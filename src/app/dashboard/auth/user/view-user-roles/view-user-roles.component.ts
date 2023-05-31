import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/dashboard/services/user.service';

@Component({
  selector: 'lib-view-user-roles',
  templateUrl: './view-user-roles.component.html',
  styleUrls: ['./view-user-roles.component.scss'],
})
export class ViewUserRolesComponent implements OnInit {
  userTitle: string;

  constructor(
    public dialogRef: MatDialogRef<ViewUserRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User
  ) {
    this.userTitle = `${user.name} roles`;
  }

  closeDialog() {
    this.dialogRef.close();
  }
  ngOnInit(): void {}
}
