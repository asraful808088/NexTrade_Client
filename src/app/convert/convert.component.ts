import { CommonModule } from '@angular/common';
import { Component, OnChanges, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsCardComponent } from '../../components/alerts-card/alerts-card.component';
import { AllocationCardComponent } from '../../components/allocation-card/allocation-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { DynamicLineChartComponent } from '../../components/dynamic-line-chart/dynamic-line-chart';
import { EarnCardComponent } from '../../components/earn-card/earn-card.component';
import { HeatmapCardComponent } from '../../components/heatmap-card/heatmap-card.component';
import { MoversCardComponent } from '../../components/movers-card/movers-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { TransactionsCardComponent } from '../../components/transactions-card/transactions-card.component';
import { Api } from '../../services/api';
import { CryptoService } from '../../services/crypto.service';
import { RouteHistory } from '../../services/route-history';
import { Users } from '../../services/users.service';
@Component({
  selector: 'app-convert',
  imports: [
    CommonModule,
    NavbarComponent,
    DynamicLineChartComponent,
  ],
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss'],
})
export class ConvertComponent implements OnChanges {
  active_aside_button: number;
  current_rate: number;
  portfolio: any;
  activeTab = signal<string>('15m');
  chart_items = signal<any>([]);
  rotate_animation_holder = signal<boolean>(false);
  rotate_animation_holder_time_track?: any;
  active_curr?: number | undefined | null;
  convertApply = signal<boolean>(false);
  confirmCnvertApply = signal<boolean>(false);
  applyMessage = signal<object | null>(null);
  error_msg = signal<string|null>(null);
  send_obj = signal<any|null>(null)
  constructor(
    public crypto: CryptoService,
    private users: Users,
    private router: Router,
    private api: Api,
    private routerHistory: RouteHistory,
  ) {
    this.current_rate = 25;
    this.active_aside_button = 0;

     if (!(users.userData() || crypto?.comData()?.totalNew) ) {
      this.router.navigate(['/']);
    }
    
  }






  c_converter(): any {

     if (0>=this.crypto.exchange_cry().from[Object.keys(this.crypto.exchange_cry().from)[0]].amount) {
        this.error_msg.set('Your cryptocurrency balance is insufficient.')
      return ''
    }
    if (!this.convertApply()) {
      this.convertApply.set(true);

      this.api.toConvert({ ...this.crypto.exchange_cry(), rate: this.current_rate }).subscribe(
        (res: any) => {
                       this.crypto.portfolioDataInject(res.data.portfolio,res.data.compare);
          this.send_obj.set(res.conversion)
          this.convertApply.set(false);
          setTimeout(() => {
            this.closeToastMsg()
          }, 5000);
        },
        (err: any) => {
          console.log(err);
          this.convertApply.set(false);
        },
      );
    }
  }
  exChngeShow(i: number): any {
   
    if (this.active_curr == i) {
      this.active_curr = null;
    } else {
      this.active_curr = i;
    }
  }

  closeToastMsg(): void {
    
    this.send_obj.set(null);
  }

  ngOnChanges(): void {
    if (this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]) {
      this.chart_items.set([...this.portfolio?.BTC?.timeline?.current_value[this.activeTab()]]);
    }
  }
  get getCryptoItems(){
    return Object.keys(this.crypto.comData()?.items)
  }
  ngOnInit() {
    this.portfolio = this.crypto.portfolio;
    // console.log()
    // this.chart_items.set(this.crypto.portfolio?.BTC?.timeline?.current_value[this.activeTab()]);
  }
  get firstExchangeKeyFrom(): string {
    return Object.keys(this.crypto.exchange_cry()['from'])[0];
  }
  get firstExchangeKeyTo(): string {
    return Object.keys(this.crypto.exchange_cry()['to'])[0];
  }
  get getStyleEXfrom(): string {
    return (this.crypto.exchange_cry() as any)['from'][this.firstExchangeKeyFrom]['style'];
  }
  get getSymbolEXfrom(): string {
    return (this.crypto.exchange_cry() as any)['from'][this.firstExchangeKeyFrom]['symbol'];
  }
  get getSymbolEXTo(): string {
    return (this.crypto.exchange_cry() as any)['to'][this.firstExchangeKeyTo]['symbol'];
  }
  get getStyleEXTo(): string {
    return (this.crypto.exchange_cry() as any)['to'][this.firstExchangeKeyTo]['style'];
  }

  get getUD(): string {
    return (this.crypto.exchange_cry() as any)['base']['USD']['amount'];
  }
  get convertFromValue(): string {
    return `${(this.crypto.exchange_cry() as any)['from'][this.firstExchangeKeyFrom]['value_usd'] * (this.current_rate / 100)}`;
  }

  get convertToValue(): string {
    return `${((this.crypto.exchange_cry() as any)['from'][this.firstExchangeKeyFrom]['value_usd'] * (this.current_rate / 100)) / (this.crypto.exchange_cry() as any)['to'][this.firstExchangeKeyTo]['price_usd']}`;
  }
  get getFromAmount(): string {
    return `${this.crypto.portfolio()[this.firstExchangeKeyFrom]['amount'] * (this.current_rate / 100)}`;
  }
  get getTOAmount(): string {
    return `${(this.crypto.portfolio()[this.firstExchangeKeyFrom]['value_usd'] * (this.current_rate / 100)) / (this.crypto.exchange_cry() as any)['to'][this.firstExchangeKeyTo]['price_usd']}`;
  }
   cryptoIcon(itemname:string){
    
    return this.crypto.portfolio()[itemname].symbol
  }

  styleCss(itemname:string){
    return this.crypto.portfolio()[itemname]?.style
  }
  setTab(tab: string): void {
    this.activeTab.set(tab);
    // this.chart_items.set(this.portfolio?.BTC?.timeline?.current_value?.[this.activeTab()] || []);
  }
  changeTabButton(value: number): void {
    this.active_aside_button = value;
  }
  send_setPct(value: number): void {
    this.current_rate = value;
  }

  rorate_animation_activtor() {
    if (!this.rotate_animation_holder()) {
      this.crypto.swapExchange();
      if (this.rotate_animation_holder_time_track) {
        clearInterval(this.rotate_animation_holder_time_track);
      }
      this.rotate_animation_holder.set(true);
      this.rotate_animation_holder_time_track = setTimeout(() => {
        this.rotate_animation_holder.set(false);
      }, 500);
    }
  }


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

checkLog(s:any):any{
  console.log(s)

}

closeModal(){
  console.log('12312313123213')
}

}
