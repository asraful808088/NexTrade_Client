import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatCell } from './../../core/models/dashboard.models';

@Component({
  selector: 'app-heatmap-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="heatmap-card">
      <div class="section-header">
        <span class="section-header__title">Market Heatmap</span>
        <button class="section-header__action">24H</button>
      </div>
      <div class="heatmap-grid">
        @for (cell of cells; track cell.ticker) {
          <div class="heat-cell" [style.background]="getCellColor(cell.change)">
            <div class="heat-cell__ticker">{{ cell.ticker }}</div>
            <div class="heat-cell__pct">{{ cell.change > 0 ? '+' : '' }}{{ cell.change | number:'1.1-1' }}%</div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./heatmap-card.component.scss']
})
export class HeatmapCardComponent {
  @Input({ required: true }) cells: HeatCell[] = [];

  getCellColor(change: number): string {
    const intensity = Math.min(Math.abs(change) / 6, 1);
    if (change >= 0) {
      const alpha = 0.3 + intensity * 0.55;
      return `rgba(0, 180, 120, ${alpha})`;
    } else {
      const alpha = 0.3 + intensity * 0.55;
      return `rgba(220, 50, 80, ${alpha})`;
    }
  }
}
