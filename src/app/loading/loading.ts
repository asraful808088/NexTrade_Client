import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, throwError } from 'rxjs';
import { catchError, switchMap, takeUntil, timeout } from 'rxjs/operators';
import { Api } from '../../services/api';
import { CryptoService } from '../../services/crypto.service';
import { Users } from '../../services/users.service';

@Component({
  selector: 'app-loading',
  imports: [],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading implements OnInit, OnDestroy {
  list = signal<any>(['Initializing…', 'Loading assets…', 'Almost ready…', 'Welcome back!']);
  activeindex = signal<number>(0);
  timerTrack: any;

  private destroy$ = new Subject<void>();

  constructor(
    private api: Api,
    private user: Users,
    private router: Router,
    private crypto: CryptoService,
  ) {}

  ngOnInit() {
    this.timerTrack = setInterval(() => {
      if (this.activeindex() === this.list().length - 1) {
        this.activeindex.set(0);
      } else {
        this.activeindex.set(this.activeindex() + 1);
      }
    }, 500);

    setTimeout(() => {
      this.initializeAuth();
    }, 500);
  }

  private initializeAuth(): void {
    const token = this.api.getToken();

    if (!token || token.trim() === '') {
      this.redirectToAuth();
      return;
    }

    this.api
      .checkAuth()
      .pipe(
        timeout(10000),
        switchMap((authRes: any) => {
          if (!authRes?.user) {
            throw new Error('Invalid auth response - no user data');
          }

          this.user.addUserData(authRes.user);

          return this.api.getCryptoProt();
        }),
        switchMap((portfolioRes: any) => {
          if (!portfolioRes?.data?.portfolio) {
            throw new Error('No portfolio data found');
          }

          this.crypto.portfolioDataInject(portfolioRes.data.portfolio, portfolioRes.data.compare);

          if (this.crypto.dataFetch()) {
            this.router.navigate(['/dashboard']);

            return throwError(() => new Error('Data already fetched'));
          }

          return this.api.getCryptoRecords();
        }),
        timeout(10000),
        catchError((err: any) => {
          if (err?.message === 'Data already fetched' || err?.name === 'TimeoutError') {
            return throwError(() => null);
          }

          return throwError(() => err);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (historyRes: any) => {
          if (historyRes?.data) {
            this.crypto.historyRecordsInjector(historyRes.data.reverse());
          }

          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          if (err === null) {
            return;
          }

          this.redirectToAuth();
        },
      });
  }

  private redirectToAuth(): void {
    clearInterval(this.timerTrack);
    this.router.navigate(['/auth']);
  }

  ngOnDestroy(): void {
    clearInterval(this.timerTrack);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
