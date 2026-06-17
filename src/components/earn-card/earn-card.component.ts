import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarnPool } from './../../core/models/dashboard.models';

@Component({
  selector: 'app-earn-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="earn-card">
      <div class="section-header">
        <span class="section-header__title">Earn &amp; Staking</span>
        <button class="section-header__action">Explore pools</button>
      </div>
      @for (pool of pools; track pool.id) {
        <div class="earn-item">
          <div class="earn-item__icon"
               [style.background]="pool.iconBg"
               [style.border-color]="pool.iconBorder">
            {{ pool.symbol }}
          </div>
          <div class="earn-item__info">
            <div class="earn-item__name">{{ pool.name }}</div>
            <div class="earn-item__sub">{{ pool.lockType }} · \${{ pool.staked | number }} staked</div>
            <div class="earn-item__bar">
              <div class="earn-item__bar-fill" [style.width.%]="pool.progress"></div>
            </div>
          </div>
          <div class="earn-item__apy">
            <div class="earn-item__apy-val">{{ pool.apy }}%</div>
            <div class="earn-item__apy-lbl">APY</div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./earn-card.component.scss']
})
export class EarnCardComponent {
  @Input({ required: true }) pools: EarnPool[] = [];
}
