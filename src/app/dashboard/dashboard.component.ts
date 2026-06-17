import { CommonModule } from '@angular/common';
import { Component, inject, OnChanges, signal,effect,computed } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsCardComponent } from '../../components/alerts-card/alerts-card.component';
import { AllocationCardComponent } from '../../components/allocation-card/allocation-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { EarnCardComponent } from '../../components/earn-card/earn-card.component';
import { HeatmapCardComponent } from '../../components/heatmap-card/heatmap-card.component';
import { HomeOptionDialog } from '../../components/home-option-dialog/home-option-dialog';
import { MoversCardComponent } from '../../components/movers-card/movers-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { ToastBox } from '../../components/toast-box/toast-box';
import { TransactionsCardComponent } from '../../components/transactions-card/transactions-card.component';
import { StatCard } from '../../core/models/dashboard.models';
import { Api } from '../../services/api';
import { CryptoService } from '../../services/crypto.service';
import { DashboardService } from '../../services/dashboard.service';
import { Users } from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatCardComponent,
    ChartCardComponent,
    AllocationCardComponent,
    MoversCardComponent,
    TransactionsCardComponent,
    EarnCardComponent,
    HeatmapCardComponent,
    AlertsCardComponent,
    NavbarComponent,
    ToastBox,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent  {
  toast_type_code?: number | null;

  constructor(
    private router: Router,
    public users: Users,
    private api: Api,
    private crypto: CryptoService,
  ) {

    
    if (!(users.userData() || crypto?.comData()?.totalNew) ) {
      this.router.navigate(['/']);
    }
  }
 
  private svc = inject(DashboardService);
 
  card_1 = computed(() => {
    const totalNew = this.crypto?.comData()?.totalNew;
    return {
      label: 'Total Portfolio',
      value: totalNew.toLocaleString()|| '0000',
      change: `${this.crypto?.comData().totalChange.toLocaleString()}  (${(this.crypto?.comData().totalRate*100).toFixed(2)}%)`,
      changeUp: true,
      icon: '💰',
      accentClass: this.crypto?.comData().marketTrend=='down'?'sc-red': 'sc-cyan',
    };
  });




  card_2 = computed(() => {
    const totalNew = this.crypto?.comData()?.totalNew;
   
    return {
        label: '24H Profit',
        value: `${(this.crypto?.comData()?.totalNew/49).toLocaleString()}`,
        change: 'Best day this week',
        changeUp: true,
        icon: '📈',
        accentClass: 'sc-gold'
      };
  });


  moversItems = computed(()=>{
    const totalItems = this.crypto?.comData()?.items
    return [
      {
        id: 'btc', name: 'Bitcoin',   ticker: 'BTC', symbol: '₿',
        price: totalItems['BTC'].new_price,  change24h:  totalItems['BTC'].price_change_percent, marketCap: '$1.32T',
        color: '#f7931a', bgColor: 'rgba(247,147,26,0.1)', borderColor: 'rgba(247,147,26,0.22)',
        sparkPoints: totalItems['BTC'].price_change_percent >0?'0,20 8,16 18,18 26,10 36,13 46,6 56,2':'0,4 10,8 18,6 28,14 36,10 46,16 56,12'
      },
      {
        id: 'eth', name: 'Ethereum',  ticker: 'ETH', symbol: 'Ξ',
        price: totalItems['ETH'].new_price,   change24h: totalItems['ETH'].price_change_percent, marketCap: '$428B',
        color: '#627EEA', bgColor: 'rgba(98,126,234,0.1)', borderColor: 'rgba(98,126,234,0.22)',
        sparkPoints:  totalItems['ETH'].price_change_percent >0?'0,20 8,16 18,18 26,10 36,13 46,6 56,2':'0,4 10,8 18,6 28,14 36,10 46,16 56,12'
      },
      {
        id: 'sol', name: 'Solana',    ticker: 'SOL', symbol: '◎',
        price: totalItems['SOL'].new_price, change24h:totalItems['SOL'].price_change_percent, marketCap: '$84B',
        color: '#00e6b4', bgColor: 'rgba(0,230,180,0.08)', borderColor: 'rgba(0,230,180,0.2)',
        sparkPoints:totalItems['SOL'].price_change_percent >0?'0,20 8,16 18,18 26,10 36,13 46,6 56,2':'0,4 10,8 18,6 28,14 36,10 46,16 56,12'
      },
      {
        id: 'avax', name: 'Avalanche', ticker: 'AVAX', symbol: '◈',
        price: totalItems['AVAX'].new_price,  change24h:  totalItems['AVAX'].price_change_percent, marketCap: '$18B',
        color: '#e84142', bgColor: 'rgba(232,65,66,0.1)', borderColor: 'rgba(232,65,66,0.22)',
        sparkPoints:totalItems['AVAX'].price_change_percent >0?'0,20 8,16 18,18 26,10 36,13 46,6 56,2':'0,4 10,8 18,6 28,14 36,10 46,16 56,12'
      },
      {
        id: 'link', name: 'Chainlink', ticker: 'LINK', symbol: '⬡',
        price:totalItems['LINK'].new_price,  change24h: totalItems['LINK'].price_change_percent, marketCap: '$12B',
        color: '#2a5ada', bgColor: 'rgba(42,90,218,0.1)', borderColor: 'rgba(42,90,218,0.22)',
        sparkPoints:totalItems['LINK'].price_change_percent >0?'0,20 8,16 18,18 26,10 36,13 46,6 56,2':'0,4 10,8 18,6 28,14 36,10 46,16 56,12'
      }
    ];
  })
  stats = this.svc.getStats();
  movers = this.svc.getMarketMovers();
  transactions = this.svc.getTransactions();
  earnPools = this.svc.getEarnPools();
  alerts = this.svc.getPriceAlerts();
  heatmap = this.svc.getHeatmap();
  allocation = this.svc.getAllocation();
  btcPrice = this.svc.btcPrice;

  today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  toggleAlert(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) alert.active = !alert.active;
  }

  openToast(value: any): void {
    this.toast_type_code = value;
  }
  closeToast(): void {
    this.toast_type_code = null;
  }

  get username(){
   
    return this?.users?.userData()?.fristname
  }
  
}
