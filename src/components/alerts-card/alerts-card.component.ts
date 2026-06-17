import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceAlert } from './../../core/models/dashboard.models';

@Component({
  selector: 'app-alerts-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="alerts-card">
      <div class="section-header">
        <span class="section-header__title">Price Alerts</span>
        <button class="section-header__action">+ New alert</button>
      </div>
      @for (alert of alerts; track alert.id) {
        <div class="alert-row">
          <div class="alert-row__icon"
               [style.background]="alert.iconBg"
               [style.color]="alert.iconColor">
            {{ alert.symbol }}
          </div>
          <div class="alert-row__info">
            <div class="alert-row__pair">{{ alert.pair }}</div>
            <div class="alert-row__cond">{{ alert.condition === 'below' ? 'Drops below' : 'Rises above' }}</div>
          </div>
          <div class="alert-row__target"
               [class.text-up]="alert.condition === 'above'"
               [class.text-dn]="alert.condition === 'below'">
            \${{ alert.target | number }}
          </div>
          <button
            class="toggle"
            [class.toggle--on]="alert.active"
            [class.toggle--off]="!alert.active"
            (click)="toggleAlert.emit(alert.id)"
            [attr.aria-label]="'Toggle alert for ' + alert.pair"
          >
            <span class="toggle__thumb"></span>
          </button>
        </div>
      }
    </div>
  `,
  styleUrls: ['./alerts-card.component.scss']
})
export class AlertsCardComponent {
  @Input({ required: true }) alerts: PriceAlert[] = [];
  @Output() toggleAlert = new EventEmitter<string>();
}
