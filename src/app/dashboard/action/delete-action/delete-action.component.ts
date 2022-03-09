import { Action, ActionService } from './../../services/action.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-action',
  templateUrl: './delete-action.component.html',
  styleUrls: ['./delete-action.component.scss'],
})
export class DeleteActionComponent implements OnInit {
  errorMessage!: string;
  loadingResult = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteActionComponent>,
    private actionService: ActionService,
    @Inject(MAT_DIALOG_DATA) public action: Action
  ) {}

  ngOnInit(): void {}

  delete() {
    this.loadingResult = true;
    this.dialogRef.disableClose = true;
    this.actionService.deleteAction(this.action.id).subscribe({
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
      complete: () => {
        this.loadingResult = false;
      },
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
