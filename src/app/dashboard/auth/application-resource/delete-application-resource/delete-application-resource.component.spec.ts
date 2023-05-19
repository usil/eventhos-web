import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteApplicationResourceComponent } from './delete-application-resource.component';

describe('DeleteApplicationResourceComponent', () => {
  let component: DeleteApplicationResourceComponent;
  let fixture: ComponentFixture<DeleteApplicationResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteApplicationResourceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteApplicationResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
