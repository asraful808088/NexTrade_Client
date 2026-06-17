import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocationItem } from './../../core/models/dashboard.models';
import { CryptoService } from '../../services/crypto.service';
import { signal,effect,computed } from '@angular/core';
@Component({
  selector: 'app-allocation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allocation-card.component.html',
  styleUrls: ['./allocation-card.component.scss']
})
export class AllocationCardComponent {


   
  constructor(
   
    public crypto: CryptoService,
  ) {}


  










 getTicker(name: string): string {
  const map: any = {
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Solana: 'SOL',
    Avalanche: 'AVAX',
    Polkadot: 'DOT',
    Chainlink: 'LINK',
    Uniswap: 'UNI',
    USD: 'USD'
  };

  return map[name] || name.slice(0, 3).toUpperCase();
}
  
items: AllocationItem[] = [
      { name: 'Bitcoin',  ticker: 'BTC', pct: 42, color: '#f7931a', dasharray: '42 58', dashoffset: '25' },
      { name: 'Ethereum', ticker: 'ETH', pct: 28, color: '#627EEA', dasharray: '28 72', dashoffset: '-17' },
      { name: 'Solana',   ticker: 'SOL', pct: 18, color: '#00e6b4', dasharray: '18 82', dashoffset: '-45' },
      { name: 'Others',   ticker: '···', pct: 12, color: '#f5c842', dasharray: '12 88', dashoffset: '-63' }
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

  const getPct = (value: number) =>
    Math.round((value / total) * 100);

  const colorMap: any = {
    BTC: '#f7931a',
    ETH: '#627EEA',
    SOL: '#00e6b4',
    AVAX: '#e84142',
    DOT: '#e6007a',
    LINK: '#2a5ada',
    UNI: '#ff007a',
    USD: '#26a17b'
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
      dashoffset: `${offset}`
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
      dashoffset: `${offset}`
    });
  }
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
  











}
