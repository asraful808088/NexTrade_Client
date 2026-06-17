import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsCardComponent } from '../../components/alerts-card/alerts-card.component';
import { AllocationCardComponent } from '../../components/allocation-card/allocation-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { EarnCardComponent } from '../../components/earn-card/earn-card.component';
import { HeatmapCardComponent } from '../../components/heatmap-card/heatmap-card.component';
import { MoversCardComponent } from '../../components/movers-card/movers-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { TransactionsCardComponent } from '../../components/transactions-card/transactions-card.component';
import { AllocationItem } from '../../core/models/dashboard.models';
import { Api } from '../../services/api';
import { CryptoService } from '../../services/crypto.service';
import { Users } from '../../services/users.service';
@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
  activeCryptoIndex = signal<number>(0);
  addressCryptoForSend = signal<string>('');
  addressCryptoForAmount = signal<number>(0);
  userAddress = signal<string>('');
  paymentAddress = signal<string | null>(null);
  paymentAddressAmount = signal<string | null>(null);
  paymentError = signal<string | null>(null);
  historyMode = signal<number>(0);
  tsx = [
    {
      type: 'Received',
      desc: 'From: 0x8a2f…3e91',
      e: '📥',
      amt: '+0.5 ETH',
      usd: '+$1,774',
      st: 'ok',
      t: '2h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
    {
      type: 'Sent',
      desc: 'To: 0xb4c7…9d02',
      e: '📤',
      amt: '−0.15 BTC',
      usd: '−$10,122',
      st: 'ok',
      t: '5h ago',
    },
  ];

  assets:any = computed(() => {
    const totalNew = this.crypto?.comData();
    return [
    {
      sym: 'BTC',
      name: 'Bitcoin',
      e: '₿',
      bg: 'rgba(247,147,26,.13)',
      c: '#f7931a',
      price: 67482.55,
      ch: 2.18,
      bal: totalNew.items['BTC'].amount,
      val: 42836,
      alloc: 48,
      spark: [60, 55, 62, 58, 52, 48, 40],
      index: 0,
    },
    {
      sym: 'ETH',
      name: 'Ethereum',
      e: 'Ξ',
      bg: 'rgba(98,126,234,.13)',
      c: '#627EEA',
      price: 3548.0,
      ch: -1.04,
      bal: totalNew.items['ETH'].amount,
      val: 19633,
      alloc: 22,
      spark: [40, 45, 42, 50, 48, 55, 52],
      index: 1,
    },
    {
      sym: 'SOL',
      name: 'Solana',
      e: '◎',
      bg: 'rgba(0,230,180,.1)',
      c: '#00e6b4',
      price: 188.4,
      ch: 5.62,
      bal: totalNew.items['SOL'].amount,
      val: 12494,
      alloc: 14,
      spark: [70, 65, 55, 50, 45, 38, 30],
      index: 2,
    },
    {
      sym: 'AVAX',
      name: 'Avalanche',
      e: '◈',
      bg: 'rgba(232,65,66,.1)',
      c: '#e84142',
      price: 46.72,
      ch: 3.81,
      bal: totalNew.items['AVAX'].amount,
      val: 7139,
      alloc: 8,
      spark: [55, 60, 58, 52, 48, 44, 40],
      index: 3,
    },
  ]
  });
  
  tabSwt = signal<number | null>(null);
  sendPanding = signal<boolean>(false);

  constructor(
    private users: Users,
    private router: Router,
    private api: Api,
    private crypto: CryptoService,
  ) {

     if (!(users.userData() || crypto?.comData()?.totalNew) ) {
      this.router.navigate(['/']);
      
    }
    
      if (!this.crypto.recordsList()) {
        this.api.getRecord().subscribe((res:any)=>{
        this.crypto.historyRecordsInjector(res?.data)
      },(err:any)=>{
        
         this.crypto.historyRecordsInjector([])
      })
      }
  }

  get userEmail(): string {
    return this.users.userData().email;
  }
  card_1 = computed(() => {
    const totalNew = this.crypto?.comData()?.totalNew;
    return {
      label: 'Total Portfolio',
      value: totalNew.toLocaleString() || '0000',
      change: `${this.crypto?.comData().totalChange.toLocaleString()}  (${(this.crypto?.comData().totalRate * 100).toFixed(2)}%)`,
      changeUp: true,
      icon: '💰',
      accentClass: this.crypto?.comData().marketTrend == 'down' ? 'sc-red' : 'sc-cyan',
      numbervalue:totalNew
    };
  });
  styleCss(itemname: string): string {
    return `${this.crypto.portfolio()[itemname]?.style}`;
  }
  get historyRecord(): any {
    return this.crypto.recordsList();
  }
  // clearErrors

  sendFinished() {
    this.addressCryptoForSend.set('');
  }
  swtToSwft(): void {
    this.router.navigate(['/convert']);
  }
  ngOnInit() {
    this.getAddressItem();
  }
  getAddressItem(): void {
    this.api.recevCrypto().subscribe(
      (res: any) => {
        if (res?.data?.paymentAddress) {
          this.paymentAddress.set(res?.data?.paymentAddress);
        }
      },
      (err: any) => {
        this.api.userLogout();
      },
    );
  }
  onActiveToast(): void {
    this.addressCryptoForAmount.set(0);
    if (this.tabSwt() != null) {
      this.tabSwt.set(null);
    } else {
      this.tabSwt.set(0);
    }
  }

  onChangeToast(number: number): void {
    this.tabSwt.set(number);
  }

  chnageCryptoIndex(index: number): void {
    if (index == 1 && this.paymentAddress() != null) {
      this.activeCryptoIndex.set(index);
    } else {
      this.activeCryptoIndex.set(index);
    }
  }

  toSendCrypto(): void {
    if (!this.sendPanding()) {
      this.sendPanding.set(true);

      this.paymentError.set(null);
     
      this.api
        .sendCrypto({
          crypto_item: this.assets()[this.activeCryptoIndex()],
          address: this.addressCryptoForSend(),
          amount: this.addressCryptoForAmount(),
        })
        .subscribe(
          (res: any) => {
            this.crypto.portfolioDataInject(res.data.portfolio, res.data.compare);
            this.sendPanding.set(false);
            this.tabSwt.set(2);
            this.sendFinished();
          },
          (err: any) => {
            this.sendPanding.set(false);

            if (err?.error?.message) {
              this.paymentError.set(err.error.message);
            }
          },
        );
    }
  }
  setPaymentAddress(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.addressCryptoForSend.set(value);
  }
  setPaymentAmount(event: Event): void {
    if (!this.sendPanding()) {
      const value: any = (event.target as HTMLInputElement).value;
      if (value >= 0) {
        this.addressCryptoForAmount.set(parseFloat(value));
      } else {
        this.addressCryptoForAmount.set(0);
      }
    }
  }

  getTicker(name: string): string {
    const map: any = {
      Bitcoin: 'BTC',
      Ethereum: 'ETH',
      Solana: 'SOL',
      Avalanche: 'AVAX',
      Polkadot: 'DOT',
      Chainlink: 'LINK',
      Uniswap: 'UNI',
      USD: 'USD',
    };

    return map[name] || name.slice(0, 3).toUpperCase();
  }

  items: AllocationItem[] = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      pct: 42,
      color: '#f7931a',
      dasharray: '42 58',
      dashoffset: '25',
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      pct: 28,
      color: '#627EEA',
      dasharray: '28 72',
      dashoffset: '-17',
    },
    {
      name: 'Solana',
      ticker: 'SOL',
      pct: 18,
      color: '#00e6b4',
      dasharray: '18 82',
      dashoffset: '-45',
    },
    {
      name: 'Others',
      ticker: '···',
      pct: 12,
      color: '#f5c842',
      dasharray: '12 88',
      dashoffset: '-63',
    },
  ];

  extractColor(style: string): string {
    const match = style?.match(/color:\s*(#[0-9a-fA-F]+)/);
    return match ? match[1] : '#999';
  }

  items2 = computed(() => {
    const data = this.crypto?.comData();
    if (!data?.items) return [];

    const arr: any[] = Object.values(data.items);

    const total = arr.reduce((sum, item) => {
      return sum + (item.new_value || 0);
    }, 0);

    if (total === 0) return [];

    const sorted = arr.sort((a, b) => b.new_value - a.new_value);

    const top = sorted.slice(0, 4);
    const others = sorted.slice(4);

    const othersTotal = others.reduce((sum, item) => {
      return sum + (item.new_value || 0);
    }, 0);

    const getPct = (value: number) => Math.round((value / total) * 100);

    const colorMap: any = {
      BTC: '#f7931a',
      ETH: '#627EEA',
      SOL: '#00e6b4',
      AVAX: '#e84142',
      DOT: '#e6007a',
      LINK: '#2a5ada',
      UNI: '#ff007a',
      USD: '#26a17b',
    };

    let offset = 25;

    const result: any[] = [];

    top.forEach((item: any) => {
      const pct = getPct(item.new_value);

      result.push({
        name: item.name,
        ticker: this.getTicker(item.name),
        pct,
        value: item.new_value,
        color: colorMap[this.getTicker(item.name)] || '#999',
        dasharray: `${pct} ${100 - pct}`,
        dashoffset: `${offset}`,
      });

      offset -= pct;
    });

    if (othersTotal > 0) {
      const pct = getPct(othersTotal);

      result.push({
        name: 'Others',
        ticker: '···',
        pct,
        value: othersTotal,
        color: '#f5c842',
        dasharray: `${pct} ${100 - pct}`,
        dashoffset: `${offset}`,
      });
    }
    // console.log(result)
    return result;
  });

  formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  }
  copyToClipboard(text: string): void {
    if (!text) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {})
      .catch(() => {});
  }
  timeAgo(timestamp: any) {
    const seconds: any = timestamp._seconds;
    const nanoseconds: any = timestamp._nanoseconds;
    const timestampMs: any = seconds * 1000 + nanoseconds / 1000000;
    const date: any = new Date(timestampMs);
    const now: any = new Date();

    const diffSeconds: any = Math.floor((now - date) / 1000);

    if (diffSeconds < 0) {
      return 'in the future';
    }

    const years = Math.floor(diffSeconds / 31536000);
    const months = Math.floor(diffSeconds / 2592000);
    const weeks = Math.floor(diffSeconds / 604800);
    const days = Math.floor(diffSeconds / 86400);
    const hours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor(diffSeconds / 60);
    const seconds_left = diffSeconds;

    if (years >= 1) {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    } else if (months >= 1) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else if (weeks >= 1) {
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (days >= 1) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes >= 1) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds_left} second${seconds_left !== 1 ? 's' : ''} ago`;
    }
  }

  truncateMiddle(str: any) {
    if (str.length <= 6) {
      return str;
    }
    const firstThree = str.slice(0, 3);
    const lastThree = str.slice(-3);
    return `${firstThree}...${lastThree}`;
  }

  chageTabHistory(index: number) {
    this.historyMode.set(index);
  }



}
