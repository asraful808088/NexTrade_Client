import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { DynamicLineChartComponent } from '../dynamic-line-chart/dynamic-line-chart';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, DynamicLineChartComponent],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnChanges {
  @Input() btcPrice = 67482.55;
  @Output() onBuy: EventEmitter<void>;
  @Output() onSell: EventEmitter<void>;
  active: any;
  portfolio: any;
  chart_items = signal<any>([]);
  activeTab = signal<string>('15m');
  latest_amount: number;
  constructor(public crypto: CryptoService,private router:Router) {
    this.onBuy = new EventEmitter<void>();
    this.onSell = new EventEmitter<void>();
    this.chart_items.set([]);
    this.latest_amount = 0;
  }
  
  ngOnChanges(): void {
    if (this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]) {
      this.chart_items.set([...this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]]);
    }
  }
  ngOnInit() {
    this.portfolio = this.crypto.portfolio;
    this.chart_items.set(this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]);
  }

  tabs = ['15m', '1h', '1d', '1w', '1m', '1y'];

  quickActions = [
    { icon: '🟢', label: 'Buy', func: 1 },
    { icon: '🔴', label: 'Sell', func: 2 },
    { icon: '🔄', label: 'Convert', func: 3,link:"/convert"},
    { icon: '📤', label: 'Send', func: 4,link:"/wallet" },
    { icon: '📥', label: 'Receive', func: 5,link:"/wallet" },
  ];

  setTab(tab: string): void {
    this.activeTab.set(tab);
    this.chart_items.set(this.portfolio?.BTC?.timeline?.current_value?.[this.activeTab()] || []);
  }

  onBuyClick(): void {
    this.onBuy.emit();
  }
  onSellClick(): void {
    this.onSell.emit();
  }
  apply_links(link:any){
    
    this.router.navigate([link])
  }
}
