import { System, SystemService } from './../../services/system.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-system',
  templateUrl: './delete-system.component.html',
  styleUrls: ['./delete-system.component.scss'],
})
export class DeleteSystemComponent implements OnInit {
  errorMessage!: string;
  loadingResult = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteSystemComponent>,
    private systemService: SystemService,
    @Inject(MAT_DIALOG_DATA) public system: System
  ) {}

  ngOnInit(): void {}

  delete() {
    this.loadingResult = true;
    this.dialogRef.disableClose = true;
    this.systemService.deleteSystem(this.system.id).subscribe({
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
