import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientRolesComponent } from './view-client-roles.component';

describe('ViewClientRolesComponent', () => {
  let component: ViewClientRolesComponent;
  let fixture: ComponentFixture<ViewClientRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewClientRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClientRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
