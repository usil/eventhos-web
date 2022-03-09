import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventExecutionDetailsComponent } from './event-execution-details.component';

describe('EventExecutionDetailsComponent', () => {
  let component: EventExecutionDetailsComponent;
  let fixture: ComponentFixture<EventExecutionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventExecutionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventExecutionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
