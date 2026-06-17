import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOptionDialog } from './home-option-dialog';

describe('HomeOptionDialog', () => {
  let component: HomeOptionDialog;
  let fixture: ComponentFixture<HomeOptionDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeOptionDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeOptionDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
