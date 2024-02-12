import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Client } from 'src/app/dashboard/services/client.service';

@Component({
  selector: 'lib-view-client-roles',
  templateUrl: './view-client-roles.component.html',
  styleUrls: ['./view-client-roles.component.scss'],
})
export class ViewClientRolesComponent implements OnInit {
  userTitle: string;

  constructor(
    public dialogRef: MatDialogRef<ViewClientRolesComponent>,
    @Inject(MAT_DIALOG_DATA) public client: Client
  ) {
    this.userTitle = `${client.name} roles`;
  }

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }
}
