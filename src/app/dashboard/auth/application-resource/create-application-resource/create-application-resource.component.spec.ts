import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateApplicationResourceComponent } from './create-application-resource.component';

describe('CreateApplicationResourceComponent', () => {
  let component: CreateApplicationResourceComponent;
  let fixture: ComponentFixture<CreateApplicationResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateApplicationResourceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateApplicationResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
