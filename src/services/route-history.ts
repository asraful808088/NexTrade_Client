import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteHistory {
  private history: string[] = [];

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  getHistory(): string[] {
    return this.history;
  }

  getPrevious(): string | null {
    return this.history.length > 1 ? this.history[this.history.length - 2] : null;
  }

  clear(): void {
    this.history = [];
  }
}




