import { computed, Injectable, signal } from '@angular/core';

export interface CoinTimeline {
  current_value: Record<string, number[]>;
  exchange_value: Record<string, number[]>;
}

export interface Coin {
  name: string;
  amount: number;
  price_usd: number;
  value_usd: number;
  id: string;
  symbol: string;
  timeline: CoinTimeline;
  style?: string;
}

export interface Portfolio {
  [key: string]: Coin;
}

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private updateInterval: any;

  private readonly PERIODS = ['15m', '1h', '1d', '1w', '1m', '1y'];
  private readonly MAX_POINTS = 20;

  portfolio  = signal<Portfolio>({});
  dataFetch  = signal<boolean>(false);
  user_items = signal<Record<string, any>>({});
  comData  = signal<any>({});
  recordsList = signal<any>(null);
  
  exchange_cry = signal<{
    from: Record<string, Coin>;
    to:   Record<string, Coin>;
    base: Record<string, any>;
  }>({ from: {}, to: {}, base: {} });

  totalValue = computed(() =>
    Object.values(this.portfolio()).reduce((sum, coin) => sum + coin.value_usd, 0),
  );

  coins = computed(() =>
    Object.entries(this.portfolio()).map(([key, coin]) => ({ key, ...coin })),
  );

  constructor() {}

  historyRecordsInjector(listItems:any):void{
    this.recordsList.set(listItems)
  }
  portfolioDataInject(data: Record<string, any>,comData?:any|null): void {
    this.stopUpdate();
    const normalized: Portfolio = {};
     this.comData.set(comData)
    

    Object.keys(data).forEach((key) => {
      const coin  = data[key];
      const price = +coin.price_usd || 0;
      const amt   = +coin.amount    || 0;

      normalized[key] = {
        name:      coin.name   || key,
        amount:    amt,
        price_usd: price,
        value_usd: amt * price,
        id:        coin.id     || key.toLowerCase(),
        symbol:    coin.symbol || key,
        style:     coin.style  || '',
        timeline:  this.buildPriceTimeline(coin.timeline, price),
      };
    });

    this.portfolio.set(normalized);
    this.dataFetch.set(true);

    const keys    = Object.keys(normalized);
    const from    = keys.find((k) => k !== 'USD' && k !== 'USDT') ?? keys[0];
    const to      = keys.find((k) => k !== from && k !== 'USD' && k !== 'USDT') ?? keys[1];
    const baseKey = keys.find((k) => k === 'USD' || k === 'USDT');

    this.setExchange(from ?? null, to ?? null);

    if (baseKey) {
      this.exchange_cry.update((c) => ({
        ...c,
        base: { [baseKey]: normalized[baseKey] },
      }));
    }

    this.startUpdate();
  }

  setExchange(from: string | null = null, to: string | null = null): void {
    this.exchange_cry.update((current) => ({
      ...current,
      ...(from && this.portfolio()[from] ? { from: { [from]: this.portfolio()[from] } } : {}),
      ...(to   && this.portfolio()[to]   ? { to:   { [to]:   this.portfolio()[to]   } } : {}),
    }));
  }

  getExchangePair(): { from: string; to: string } {
    const current = this.exchange_cry();
    return {
      from: Object.keys(current.from)[0] ?? '',
      to:   Object.keys(current.to)[0]   ?? '',
    };
  }

  swapExchange(): void {
    this.exchange_cry.update((current) => ({
      ...current,
      from: current.to,
      to:   current.from,
    }));
  }


  startUpdate(): void {
    this.updateInterval = setInterval(() => {
      if (!this.dataFetch()) return;

      this.portfolio.update((portfolio) => {
        if (!Object.keys(portfolio).length) return portfolio;

        const updated: Portfolio = {};

        Object.keys(portfolio).forEach((key) => {
          const coin = portfolio[key];

          if (!coin.price_usd || coin.price_usd <= 0) {
            updated[key] = coin;
            return;
          }

          const changePct = (Math.random() - 0.5) * 0.01;
          const newPrice  = Math.max(coin.price_usd * (1 + changePct), 0.0001);

          const ev15 = [...coin.timeline.exchange_value['15m'], newPrice];
          const cv15 = [...coin.timeline.current_value['15m'],  newPrice];

          if (ev15.length > this.MAX_POINTS) ev15.shift();
          if (cv15.length > this.MAX_POINTS) cv15.shift();

          updated[key] = {
            ...coin,
            price_usd: newPrice,
            value_usd: coin.amount * newPrice, 
            timeline: {
              exchange_value: { ...coin.timeline.exchange_value, '15m': ev15 },
              current_value:  { ...coin.timeline.current_value,  '15m': cv15 },
            },
          };
        });

        const { from, to } = this.getExchangePair();
        if (from && updated[from]) this.syncExchangeSide('from', from, updated[from]);
        if (to   && updated[to])   this.syncExchangeSide('to',   to,   updated[to]);

        return updated;
      });
    }, 5000);
  }

  stopUpdate(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

 
  private buildPriceTimeline(timeline: any, price: number): CoinTimeline {
    const exchange_value: Record<string, number[]> = {};
    const current_value:  Record<string, number[]> = {};

    const safePrice = price > 0 ? price : 1;

    this.PERIODS.forEach((p) => {
      const backendEv: number[] = Array.isArray(timeline?.exchange_value?.[p])
        ? [...timeline.exchange_value[p]]
        : [];
      const backendCv: number[] = Array.isArray(timeline?.current_value?.[p])
        ? [...timeline.current_value[p]]
        : [];

      let points: number[] = backendEv.length
        ? backendEv
        : backendCv.length
          ? backendCv
          : [];

      points = points.filter((v) => isFinite(v) && v > 0);

      while (points.length < this.MAX_POINTS) {
        const base = points[0] ?? safePrice;
        const v    = Math.max(base * (1 + (Math.random() - 0.5) * 0.04), 0.0001);
        points.unshift(v);
      }

      points = points.slice(-this.MAX_POINTS);

      exchange_value[p] = [...points];
      current_value[p]  = [...points];
    });

    return { exchange_value, current_value };
  }

  private syncExchangeSide(side: 'from' | 'to', key: string, coin: Coin): void {
    this.exchange_cry.update((current) => ({
      ...current,
      [side]: { [key]: coin },
    }));
  }
}