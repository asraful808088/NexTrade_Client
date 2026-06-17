import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { Api } from '../services/api';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private api: Api,
    private router: Router,
    private location: Location,
  ) {}

  canActivate(): Observable<boolean> | boolean {
    const token = this.api.getToken(); 
    
    if (!token || token.trim() === '') {
      this.router.navigate(['/']);
      return false;
    }

    return this.api.checkAuth().pipe(
      map((res: any) => {
        if (res?.user) {
          this.api.getApiKey();
          return true;
        } else {
          this.router.navigate(['/']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      }),
    );
  }
}