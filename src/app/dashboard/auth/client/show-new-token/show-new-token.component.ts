import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'show-new-token',
  templateUrl: './show-new-token.component.html',
  styleUrls: ['./show-new-token.component.scss'],
})
export class ShowNewTokenComponent implements OnInit {
  hide = true;
  errorMessage!: string;

  constructor(
    public dialogRef: MatDialogRef<ShowNewTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public security: { access_token: string }
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }
}
