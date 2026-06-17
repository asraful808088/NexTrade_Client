

export interface CoinStat {
  id: string;
  name: string;
  ticker: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  color: string;
  bgColor: string;
  borderColor: string;
  sparkPoints: string;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'receive';
  asset: string;
  symbol: string;
  amount: string;
  usdValue: number;
  date: string;
  icon: string;
}

export interface EarnPool {
  id: string;
  name: string;
  asset: string;
  symbol: string;
  apy: number;
  staked: number;
  lockType: string;
  progress: number;
  iconBg: string;
  iconBorder: string;
}

export interface PriceAlert {
  id: string;
  pair: string;
  condition: 'above' | 'below';
  target: number;
  active: boolean;
  iconBg: string;
  iconColor: string;
  symbol: string;
}

export interface StatCard {
  label: string;
  value: string;
  change: string;
  changeUp: boolean;
  icon: string;
  accentClass: string;
}

export interface HeatCell {
  ticker: string;
  change: number;
}

export interface AllocationItem {
  name: string;
  ticker: string;
  pct: number;
  color: string;
  dasharray: string;
  dashoffset: string;
}
