import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, signal } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { DynamicLineChartComponent } from '../dynamic-line-chart/dynamic-line-chart';
@Component({
  selector: 'app-convert-chart',
  standalone: true,
  imports: [DynamicLineChartComponent, CommonModule],
  templateUrl: './convert-chart.component.html',
  styleUrl: './convert-chart.component.scss',
})
export class ConvertChart implements OnChanges {
  @Input() btcPrice = 67482.55;
  constructor(public crypto:CryptoService ) {}
  portfolio: any;
  activeTab = signal<string>('15m');
  chart_items = signal<any>([]);

  ngOnChanges(): void {
    if (this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]) {
      this.chart_items.set([...this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]]);
    }
  }
  ngOnInit() {
    this.portfolio = this.crypto.portfolio;
    this.chart_items.set(this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]);
  }
  setTab(tab: string): void {
    this.activeTab.set(tab);
    // this.chart_items.set(this.portfolio?.BTC?.timeline?.current_value?.[this.activeTab()] || []);
  }
}
