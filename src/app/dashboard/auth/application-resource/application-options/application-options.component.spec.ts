import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationOptionsComponent } from './application-options.component';

describe('ApplicationOptionsComponent', () => {
  let component: ApplicationOptionsComponent;
  let fixture: ComponentFixture<ApplicationOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
