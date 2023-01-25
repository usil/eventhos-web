import { EditEventComponent } from './edit-event/edit-event.component';
import { DeleteEventComponent } from './delete-event/delete-event.component';
import {
  CreateEventDto,
  Event,
  EventService,
} from './../services/event.service';
import { SystemService } from './../services/system.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { System } from '../services/system.service';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  merge,
  Observable,
  of,
  skip,
  startWith,
  Subscription,
  switchMap,
} from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ViewContractsComponent } from './view-contracts/view-contracts.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss'],
})
export class EventComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'identifier',
    'name',
    'operation',
    'description',
    'contracts',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  roleDataSubscription!: Subscription;

  events: Event[] = [];

  isLoadingResults = true;

  resultsLength = 0;

  pageSize = 10;

  errorMessage!: string | undefined;
  createEventForm: FormGroup;
  searchEventForm: FormGroup;
  operations = ['select', 'new', 'update', 'delete', 'execute', 'other'];
  producerSystems: System[] = [];
  generateIdentifier$: Subscription;
  systemIdChange$: Subscription;
  nameChange$: Subscription;

  systemId!: string;
  eventName = '';

  reload = new BehaviorSubject<number>(0);

  constructor(
    private systemService: SystemService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.searchEventForm = this.formBuilder.group({
      systemId: this.formBuilder.control(''),
      name: this.formBuilder.control(''),
    });

    this.nameChange$ = this.searchEventForm
      .get('name')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(750))
      .subscribe((changeValue) => {
        this.eventName = changeValue;
        this.paginator.pageIndex = 0;
        this.reload.next(this.reload.value + 1);
      }) as Subscription;

    this.systemIdChange$ = this.searchEventForm
      .get('systemId')
      ?.valueChanges.subscribe((changeValue) => {
        this.systemId = changeValue;
        this.paginator.pageIndex = 0;
        this.reload.next(this.reload.value + 1);
      }) as Subscription;

    this.createEventForm = this.formBuilder.group({
      identifier: this.formBuilder.control(
        { value: '', disabled: true },
        Validators.compose([Validators.required])
      ),
      system_id: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      name: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9_\.\-\/\s]+$/),
          Validators.minLength(1),
          Validators.maxLength(45),
        ])
      ),
      operation: this.formBuilder.control(
        '',
        Validators.compose([Validators.required])
      ),
      description: this.formBuilder.control(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(255),
        ])
      ),
    });
    this.generateIdentifier$ = merge(
      this.createEventForm.get('name')?.valueChanges as Observable<any>,
      this.createEventForm.get('operation')?.valueChanges as Observable<any>
    ).subscribe({
      next: () => {
        let name = this.createEventForm.get('name')?.value as string;
        if (name && name !== '') {
          const type = this.createEventForm.get('operation')?.value as string;
          name = name.trim();
          name = name.replace(' ', '_');
          name = name.toLocaleLowerCase();
          this.createEventForm
            .get('identifier')
            ?.setValue(`${name}_${type.toLocaleLowerCase()}`);
        }
      },
    });
  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.roleDataSubscription = merge(
      this.sort.sortChange,
      this.paginator.page,
      this.reload
    )
      .pipe(
        distinctUntilChanged(),
        skip(1),
        startWith({}),
        switchMap(() => {
          this.errorMessage = undefined;
          this.isLoadingResults = true;
          return this.eventService
            .getEvents(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.pageSize,
              { systemId: parseInt(this.systemId), eventName: this.eventName }
            )
            .pipe(
              catchError((err) => {
                if (err.error) {
                  this.errorMessage = err.error.message;
                } else {
                  this.errorMessage = 'Unknown Error';
                }
                return of(null);
              })
            );
        }),
        map((data) => {
          this.isLoadingResults = false;
          if (data === null) {
            return [];
          }
          this.resultsLength = data.content?.totalItems || 0;
          return data.content?.items || [];
        })
      )
      .subscribe((data) => {
        this.events = data;
      });
  }

  ngOnDestroy(): void {
    this.systemIdChange$?.unsubscribe();
    this.generateIdentifier$?.unsubscribe();
    this.nameChange$?.unsubscribe();
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

  createEvent(createEventBody: CreateEventDto) {
    this.createEventForm.disable();
    this.eventService.createEvent(createEventBody).subscribe({
      error: (err) => {
        this.createEventForm.enable();
        this.createEventForm.get('identifier')?.disable();
        if (err.error) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Unknown Error';
        }
      },
      next: () => {
        this.reload.next(this.reload.value + 1);
        this.createEventForm.reset();
        this.formDirective.resetForm();
        this.createEventForm.enable();
        this.createEventForm.get('identifier')?.disable();
      },
    });
  }

  getErrorMessage(formControlName: string) {
    if (this.createEventForm.get(formControlName)?.hasError('required')) {
      return 'You must enter a value';
    }

    if (this.createEventForm.get(formControlName)?.hasError('minLength')) {
      return 'Not long enough';
    }

    return this.createEventForm.get(formControlName)?.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  openDeleteDialog(event: Event) {
    const deleteEventDialogRef = this.dialog.open(DeleteEventComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: event,
    });

    deleteEventDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            this.reload.next(this.reload.value + 1);
          }
        },
      });
  }

  openEditDialog(event: Event) {
    const editActionDialogRef = this.dialog.open(EditEventComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: event,
    });

    editActionDialogRef
      .afterClosed()
      .pipe(first())
      .subscribe({
        next: (res) => {
          if (res) {
            this.reload.next(this.reload.value + 1);
          }
        },
      });
  }

  openViewContractsDialog(event: Event) {
    this.dialog.open(ViewContractsComponent, {
      width: '600px',
      maxHeight: '70vh',
      data: event,
    });
  }
}
