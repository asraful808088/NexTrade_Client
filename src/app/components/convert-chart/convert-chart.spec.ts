import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertChart } from './convert-chart';

describe('ConvertChart', () => {
  let component: ConvertChart;
  let fixture: ComponentFixture<ConvertChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvertChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvertChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
