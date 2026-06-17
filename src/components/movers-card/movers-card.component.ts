import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinStat } from './../../core/models/dashboard.models';

@Component({
  selector: 'app-movers-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="movers-card">
      <div class="section-header">
        <span class="section-header__title">Top Movers</span>
        <button class="section-header__action">See all</button>
      </div>
      @for (coin of coins; track coin.id) {
        <div class="mover-row">
          <div class="mover-row__icon"
               [style.background]="coin.bgColor"
               [style.border-color]="coin.borderColor"
               [style.color]="coin.color">
            {{ coin.symbol }}
          </div>
          <div class="mover-row__info">
            <div class="mover-row__name">{{ coin.name }}</div>
            <div class="mover-row__mkt">{{ coin.ticker }} · {{ coin.marketCap }}</div>
          </div>
          <svg class="mover-row__spark" width="56" height="24" viewBox="0 0 56 24">
            <polyline [attr.points]="coin.sparkPoints" fill="none"
                      [attr.stroke]="coin.change24h >= 0 ? '#00e6b4' : '#ff4466'"
                      stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
          <div class="mover-row__price">
            <div class="mover-row__price-val">\${{ coin.price | number:'1.0-2' }}</div>
            <div class="mover-row__price-chg"
                 [class.text-up]="coin.change24h >= 0"
                 [class.text-dn]="coin.change24h < 0">
              {{ coin.change24h >= 0 ? '+' : '' }}{{ coin.change24h | number:'1.2-2' }}%
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./movers-card.component.scss']
})
export class MoversCardComponent {
  @Input({ required: true }) coins: CoinStat[] = [];
}
