import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewContractsComponent } from './view-contracts.component';

describe('ViewContractsComponent', () => {
  let component: ViewContractsComponent;
  let fixture: ComponentFixture<ViewContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewContractsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
