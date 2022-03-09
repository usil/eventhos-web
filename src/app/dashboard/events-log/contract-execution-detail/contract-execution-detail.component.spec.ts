import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractExecutionDetailComponent } from './contract-execution-detail.component';

describe('ContractExecutionDetailComponent', () => {
  let component: ContractExecutionDetailComponent;
  let fixture: ComponentFixture<ContractExecutionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractExecutionDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractExecutionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
