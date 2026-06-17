import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { CryptoService } from '../../services/crypto.service';
@Component({
  selector: 'app-toast-box',
  imports: [CommonModule, FormsModule],
  templateUrl: './toast-box.html',
  styleUrl: './toast-box.scss',
})
export class ToastBox {
  amount: number;
  crypto_items: any = [];
  active_item: number;
  @Input() title: string;
  @Input() forBuy: boolean;
  @Output() onClose = new EventEmitter<void>();
  please_w8 = signal<boolean>(false);
  current_amount = signal<string | null>(null);
  error_msg = signal<string | null>(null);

  constructor(
    private crypto: CryptoService,
    private api: Api,
  ) {
    this.title = '💰 Choose Crypto to Purchase';
    this.forBuy = true;
    this.amount = 0;
    this.active_item = 0;
    const allItems: any = crypto.portfolio();

    let crypto_items = [
      {
        title: 'BTC',
        par_doller: 20,
        index: 0,
      },
      {
        title: 'ETH',
        par_doller: 10,
        index: 1,
      },
      {
        title: 'SOL',
        par_doller: 40,
        index: 2,
      },
      {
        title: 'UNI',
        par_doller: 60,
        index: 3,
      },
      {
        title: 'AVAX',
        par_doller: 60,
        index: 4,
      },
      {
        title: 'DOT',
        par_doller: 60,
        index: 5,
      },
    ];
    for (const key in allItems) {
      if (!Object.hasOwn(allItems, key)) continue;
      const element = allItems[key];

      crypto_items = crypto_items.map((element2, index) => {
        if (element2.title == element.id.toUpperCase()) {
          return {
            ...element2,
            par_doller: element.price_usd,
          };
        }
        return element2;
      });
    }

    this.crypto_items = crypto_items;
  }
  onChange(value: any): void {
    this.amount = 0;
  }
  onCngOption(value: any): void {
    this.active_item = value?.target.value;
  }
  onCloseToast(): void {
    this.onClose.emit();
    this.error_msg.set(null);
  }

  onBuyItem(): void {
    if (this.amount <= 0) {
      this.error_msg.set('Trading with zero crypto is not allowed.');

      return;
    }
    this.error_msg.set(null);
    this.please_w8.set(true);
    this.current_amount.set(null);

    this.api
      .submitToBuy({
        amount: this.amount,
        totalAmount: this.crypto_items[this.active_item].par_doller,
        cryptoName: this.crypto_items[this.active_item].title,
      })
      .subscribe(
        (res: any) => {
          this.please_w8.set(false);
          this.crypto.portfolioDataInject(res.data.portfolio, res.data.compare);
          this.onCloseToast();
        },
        (err: any) => {
          if (err.status == 402) {
            this.please_w8.set(false);
            this.current_amount.set(err.error.amount);
          } else {
            this.api.userLogout();
          }
        },
      );
  }

  onSellItem(): void {
    if (this.amount <= 0) {
      this.error_msg.set('Trading with zero crypto is not allowed.');

      return;
    }
    this.error_msg.set(null);

    this.please_w8.set(true);
    this.current_amount.set(null);

    this.api
      .submitToSell({
        amount: this.amount,
        totalAmount: this.crypto_items[this.active_item].par_doller,
        cryptoName: this.crypto_items[this.active_item].title,
      })
      .subscribe(
        (res: any) => {
          this.please_w8.set(false);
          this.crypto.portfolioDataInject(res.data.portfolio, res.data.compare);
          this.onCloseToast();
        },
        (err: any) => {
          if (err.status == 402) {
            this.current_amount.set(err.error.amount);
            this.please_w8.set(false);
          } else {
            this.api.userLogout();
          }
        },
      );
  }
}
