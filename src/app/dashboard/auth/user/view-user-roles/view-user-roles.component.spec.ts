import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserRolesComponent } from './view-user-roles.component';

describe('ViewUserRolesComponent', () => {
  let component: ViewUserRolesComponent;
  let fixture: ComponentFixture<ViewUserRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewUserRolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
