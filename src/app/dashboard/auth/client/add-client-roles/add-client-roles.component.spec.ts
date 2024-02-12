import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClientRolesComponent } from './add-client-roles.component';

describe('AddClientRolesComponent', () => {
  let component: AddClientRolesComponent;
  let fixture: ComponentFixture<AddClientRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddClientRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClientRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
