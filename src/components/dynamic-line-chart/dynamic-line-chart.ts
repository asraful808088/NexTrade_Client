import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
@Component({
  selector: 'app-dynamic-line-chart',
  imports: [CommonModule],
  templateUrl: './dynamic-line-chart.html',
  styleUrls: ['./dynamic-line-chart.scss'],
})
export class DynamicLineChartComponent implements OnChanges {
  @Input() data: number[] = [];

  width = 700;
  height = 140;

  linePath: string = '';
  areaPath: string = '';

  lastX = 0;
  lastY = 0;

  ngOnChanges() {
    this.buildChart();
  }

  buildChart() {
    if (!this.data || this.data.length === 0) return;

    const max = Math.max(...this.data);
    const min = Math.min(...this.data);
    const stepX = this.width / (this.data.length - 1);

    const normalizeY = (value: number) => {
      if (max === min) return this.height / 2;
      return this.height - ((value - min) / (max - min)) * this.height;
    };

    let path = '';

    this.data.forEach((value, index) => {
      const x = index * stepX;
      const y = normalizeY(value);

      if (index === 0) {
        path += `M${x},${y}`;
      } else {
        path += ` L${x},${y}`;
      }

      if (index === this.data.length - 1) {
        this.lastX = x;
        this.lastY = y;
      }
    });

    this.linePath = path;

    this.areaPath = path + ` L${this.width},${this.height} L0,${this.height} Z`;
  }
}
