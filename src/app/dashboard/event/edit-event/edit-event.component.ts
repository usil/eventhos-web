import { Event, EventUpdateDto } from './../../services/event.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../services/client.service';
import { EventService } from '../../services/event.service';
import { System, SystemService } from '../../services/system.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})
export class EditEventComponent implements OnInit {
  editEventForm: FormGroup;
  errorMessage!: string | undefined;
  clients: Client[] = [];
  producerSystems: System[] = [];
  operations = ['select', 'new', 'update', 'delete'];

  constructor(
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private systemService: SystemService,
    @Inject(MAT_DIALOG_DATA) public event: Event,
    public dialogRef: MatDialogRef<EditEventComponent>
  ) {
    this.editEventForm = this.formBuilder.group({
      name: this.formBuilder.control(
        this.event.name,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      operation: this.formBuilder.control(
        this.event.operation,
        Validators.compose([Validators.required])
      ),
      description: this.formBuilder.control(
        this.event.description,
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(255),
        ])
      ),
    });
  }

  ngOnInit(): void {
    this.systemService.getSystems('id', 'desc', 0, 100, 'producer').subscribe({
      error: (err) => {
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: (res) => {
        this.producerSystems = res.content?.items || [];
      },
    });
  }

  updateEvent(eventUpdateDto: EventUpdateDto) {
    this.editEventForm.disable();
    this.eventService.editEvent(this.event.id, eventUpdateDto).subscribe({
      error: (err) => {
        this.editEventForm.enable();
        this.dialogRef.disableClose = false;
        if (err.error) {
          this.editEventForm.enable();
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

  closeDialog() {
    this.dialogRef.close();
  }

  getErrorMessage(formControlName: string) {
    if (this.editEventForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    return this.editEventForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }
}
