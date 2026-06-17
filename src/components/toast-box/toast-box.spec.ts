import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastBox } from './toast-box';

describe('ToastBox', () => {
  let component: ToastBox;
  let fixture: ComponentFixture<ToastBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
