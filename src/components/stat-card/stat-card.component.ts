import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { StatCard } from './../../core/models/dashboard.models';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="stat-card"
      [class]="'stat-card--' + stat.accentClass"
      [style.animationDelay]="animDelay + 's'"
    >
      <div class="stat-card__accent"></div>
      <div class="stat-card__label">{{ stat.label }}</div>
      <div
        class="stat-card__value sc-gold"
        [class.text-up]="stat.changeUp && stat.accentClass !== 'sc-gold'"
        [class.text-gold]="stat.accentClass === 'sc-gold'"
        [class.text-red]="stat.accentClass === 'sc-red'"
      >
        {{ stat.value }}
      </div>
      <div
        class="stat-card__change"
        [class.text-up]="stat.changeUp"
        [class.text-muted]="!stat.changeUp"
      >
        <span *ngIf="stat.changeUp && stat.accentClass != 'sc-red'">▲</span>
        <span *ngIf="stat.accentClass === 'sc-red'" [class.text-red]="stat.accentClass === 'sc-red'"
          >▼</span
        >

        <span [class.text-red]="stat.accentClass === 'sc-red'">{{ stat.change }}</span>
      </div>
      <span aria-hidden="true">{{ stat.icon }}</span>
    </div>
  `,
  styleUrls: ['./stat-card.component.scss'],
})
export class StatCardComponent {
  @Input({ required: true }) stat!: StatCard;
  @Input() animDelay = 0;
  constructor() {}
}
