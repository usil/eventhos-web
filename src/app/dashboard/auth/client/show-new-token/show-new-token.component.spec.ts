import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowNewTokenComponent } from './show-new-token.component';

describe('ShowNewTokenComponent', () => {
  let component: ShowNewTokenComponent;
  let fixture: ComponentFixture<ShowNewTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowNewTokenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowNewTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
