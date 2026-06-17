import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicLineChart } from './dynamic-line-chart';

describe('DynamicLineChart', () => {
  let component: DynamicLineChart;
  let fixture: ComponentFixture<DynamicLineChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicLineChart],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicLineChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
