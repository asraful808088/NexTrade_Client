
import { Injectable, signal } from '@angular/core';
import { interval } from 'rxjs';
import {
  CoinStat, Transaction, EarnPool,
  PriceAlert, StatCard, HeatCell, AllocationItem
} from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  btcPrice = signal<number>(67482.55);

  constructor() {
    interval(4000).subscribe(() => {
      const delta = (Math.random() - 0.48) * 90;
      this.btcPrice.update(p => Math.round((p + delta) * 100) / 100);
    });
  }

  getStats(): StatCard[] {
    return [
      
      
      {
        label: 'Open Orders',
        value: '7',
        change: '3 limit · 4 stop-loss',
        changeUp: false,
        icon: '⚡',
        accentClass: 'sc-blue'
      },
      {
        label: 'Fear & Greed',
        value: '72',
        change: '+8 from yesterday',
        changeUp: true,
        icon: '🧠',
        accentClass: 'sc-red'
      }
    ];
  }

  getMarketMovers(): CoinStat[] {
    return [
      {
        id: 'btc', name: 'Bitcoin',   ticker: 'BTC', symbol: '₿',
        price: 67482,  change24h:  2.18, marketCap: '$1.32T',
        color: '#f7931a', bgColor: 'rgba(247,147,26,0.1)', borderColor: 'rgba(247,147,26,0.22)',
        sparkPoints: '0,20 8,16 18,18 26,10 36,13 46,6 56,2'
      },
      {
        id: 'eth', name: 'Ethereum',  ticker: 'ETH', symbol: 'Ξ',
        price: 3548,   change24h: -1.04, marketCap: '$428B',
        color: '#627EEA', bgColor: 'rgba(98,126,234,0.1)', borderColor: 'rgba(98,126,234,0.22)',
        sparkPoints: '0,4 10,8 18,6 28,14 36,10 46,16 56,12'
      },
      {
        id: 'sol', name: 'Solana',    ticker: 'SOL', symbol: '◎',
        price: 188.40, change24h:  5.62, marketCap: '$84B',
        color: '#00e6b4', bgColor: 'rgba(0,230,180,0.08)', borderColor: 'rgba(0,230,180,0.2)',
        sparkPoints: '0,18 10,14 20,8 30,10 40,4 48,6 56,2'
      },
      {
        id: 'avax', name: 'Avalanche', ticker: 'AVAX', symbol: '◈',
        price: 46.72,  change24h:  3.81, marketCap: '$18B',
        color: '#e84142', bgColor: 'rgba(232,65,66,0.1)', borderColor: 'rgba(232,65,66,0.22)',
        sparkPoints: '0,12 10,8 22,12 32,6 42,8 50,4 56,2'
      },
      {
        id: 'link', name: 'Chainlink', ticker: 'LINK', symbol: '⬡',
        price: 19.84,  change24h:  4.10, marketCap: '$12B',
        color: '#2a5ada', bgColor: 'rgba(42,90,218,0.1)', borderColor: 'rgba(42,90,218,0.22)',
        sparkPoints: '0,16 12,12 22,8 32,10 42,4 50,6 56,3'
      }
    ];
  }

  getTransactions(): Transaction[] {
    return [
      { id: '1', type: 'buy',     asset: 'Bitcoin',   symbol: 'BTC',  amount: '+0.0412 BTC', usdValue: 2780.27, date: 'Today · 09:42 AM',       icon: '📥' },
      { id: '2', type: 'sell',    asset: 'Ethereum',  symbol: 'ETH',  amount: '−1.5 ETH',    usdValue: 5322.00, date: 'Yesterday · 03:15 PM',   icon: '📤' },
      { id: '3', type: 'swap',    asset: 'SOL → USDC',symbol: 'SOL',  amount: '12 SOL',      usdValue: 2260.80, date: 'Feb 28 · 11:00 AM',      icon: '🔄' },
      { id: '4', type: 'receive', asset: 'Avalanche', symbol: 'AVAX', amount: '+40 AVAX',    usdValue: 1868.80, date: 'Feb 27 · 06:30 PM',      icon: '📥' },
      { id: '5', type: 'sell',    asset: 'Chainlink', symbol: 'LINK', amount: '−50 LINK',    usdValue:  992.00, date: 'Feb 26 · 02:00 PM',      icon: '📤' }
    ];
  }

  getEarnPools(): EarnPool[] {
    return [
      { id: '1', name: 'Bitcoin Yield',    asset: 'BTC',  symbol: '₿', apy: 4.2, staked: 35422, lockType: 'Flexible',   progress: 72, iconBg: 'rgba(247,147,26,0.1)',  iconBorder: 'rgba(247,147,26,0.22)' },
      { id: '2', name: 'ETH Staking',      asset: 'ETH',  symbol: 'Ξ', apy: 5.8, staked: 23680, lockType: 'Locked 30d', progress: 55, iconBg: 'rgba(98,126,234,0.1)',  iconBorder: 'rgba(98,126,234,0.22)' },
      { id: '3', name: 'SOL Liquid Stake', asset: 'SOL',  symbol: '◎', apy: 7.1, staked: 8420,  lockType: 'Flexible',   progress: 38, iconBg: 'rgba(0,230,180,0.08)',  iconBorder: 'rgba(0,230,180,0.2)' },
      { id: '4', name: 'USDC Savings',     asset: 'USDC', symbol: '💵',apy: 9.5, staked: 12000, lockType: 'Flexible',   progress: 88, iconBg: 'rgba(0,196,245,0.08)',  iconBorder: 'rgba(0,196,245,0.2)' }
    ];
  }

  getPriceAlerts(): PriceAlert[] {
    return [
      { id: '1', pair: 'BTC / USD',  condition: 'below', target: 65000, active: true,  symbol: '₿', iconBg: 'rgba(247,147,26,0.12)', iconColor: '#f7931a' },
      { id: '2', pair: 'ETH / USD',  condition: 'above', target: 4000,  active: true,  symbol: 'Ξ', iconBg: 'rgba(98,126,234,0.12)', iconColor: '#627EEA' },
      { id: '3', pair: 'SOL / USD',  condition: 'above', target: 200,   active: false, symbol: '◎', iconBg: 'rgba(0,230,180,0.1)',   iconColor: '#00e6b4' },
      { id: '4', pair: 'AVAX / USD', condition: 'below', target: 40,    active: true,  symbol: '◈', iconBg: 'rgba(232,65,66,0.1)',   iconColor: '#e84142' }
    ];
  }

  getHeatmap(): HeatCell[] {
    return [
      { ticker: 'BTC',   change:  2.18 },
      { ticker: 'ETH',   change: -1.04 },
      { ticker: 'SOL',   change:  5.62 },
      { ticker: 'AVAX',  change:  3.81 },
      { ticker: 'DOT',   change: -0.72 },
      { ticker: 'ADA',   change:  1.30 },
      { ticker: 'MATIC', change: -2.45 },
      { ticker: 'LINK',  change:  4.10 },
      { ticker: 'UNI',   change:  0.88 },
      { ticker: 'XRP',   change: -0.33 },
      { ticker: 'ATOM',  change:  3.20 },
      { ticker: 'FTM',   change: -1.80 }
    ];
  }

  getAllocation(): AllocationItem[] {
    return [
      { name: 'Bitcoin',  ticker: 'BTC', pct: 42, color: '#f7931a', dasharray: '42 58', dashoffset: '25' },
      { name: 'Ethereum', ticker: 'ETH', pct: 28, color: '#627EEA', dasharray: '28 72', dashoffset: '-17' },
      { name: 'Solana',   ticker: 'SOL', pct: 18, color: '#00e6b4', dasharray: '18 82', dashoffset: '-45' },
      { name: 'Others',   ticker: '···', pct: 12, color: '#f5c842', dasharray: '12 88', dashoffset: '-63' }
    ];
  }
}
