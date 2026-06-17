import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transaction } from './../../core/models/dashboard.models';

@Component({
  selector: 'app-transactions-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tx-card">
      <div class="section-header">
        <span class="section-header__title">Recent Transactions</span>
        <button class="section-header__action">View all</button>
      </div>
      @for (tx of transactions; track tx.id) {
        <div class="tx-row">
          <div class="tx-row__icon"
               [class.tx-row__icon--buy]="tx.type === 'buy' || tx.type === 'receive'"
               [class.tx-row__icon--sell]="tx.type === 'sell'"
               [class.tx-row__icon--swap]="tx.type === 'swap'">
            {{ tx.icon }}
          </div>
          <div class="tx-row__info">
            <div class="tx-row__name">{{ tx.asset }}</div>
            <div class="tx-row__date">{{ tx.date }}</div>
          </div>
          <div class="tx-row__right">
            <div class="tx-row__amount"
                 [class.text-up]="tx.type === 'buy' || tx.type === 'receive'"
                 [class.text-dn]="tx.type === 'sell'">
              {{ tx.amount }}
            </div>
            <div class="tx-row__usd">≈ \${{ tx.usdValue | number:'1.2-2' }}</div>
          </div>
          <span class="tx-row__badge"
                [class.badge--buy]="tx.type === 'buy' || tx.type === 'receive'"
                [class.badge--sell]="tx.type === 'sell'"
                [class.badge--swap]="tx.type === 'swap'">
            {{ tx.type.toUpperCase() }}
          </span>
        </div>
      }
    </div>
  `,
  styleUrls: ['./transactions-card.component.scss']
})
export class TransactionsCardComponent {
  @Input({ required: true }) transactions: Transaction[] = [];
}
