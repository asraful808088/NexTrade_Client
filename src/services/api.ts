// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class Api {
  public baseUrl = 'https://nex-server-iota.vercel.app';
  
  apiKey = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router,
  ) {
   
  }

  private saveToken(token: string, rememberMe: boolean = true): void {
    const cookieExpiry = rememberMe ? 2 : 0.003; 
    localStorage.setItem('token', token);
    this.cookieService.set('token', token, {
      expires: cookieExpiry,
      path: '/',
      secure: true,
      sameSite: 'None',
    });
  }

  getToken(): string | null {

    const localToken = localStorage.getItem('token');
    if (localToken && localToken.trim() !== '') return localToken;

    const cookieToken = this.cookieService.get('token');
    if (cookieToken && cookieToken.trim() !== '') return cookieToken;

    return null;
  }

  private clearToken(): void {
    localStorage.removeItem('token');
    this.cookieService.delete('token', '/');
  }

  private getAuthHeaders(): { [key: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }



  userLogin(user: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/users/login`, user, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          if (res?.success && res?.token) {
            this.saveToken(res.token, user?.rem ?? true);
          }
        }),
      );
  }

  userCreate(user: any): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/api/users/create`, user, { withCredentials: true })
      .pipe(
        tap((res: any) => {
          if (res?.success && res?.token) {
            this.saveToken(res.token, true);
          }
        }),
      );
  }

  userLogout(): void {
    try {
      this.clearToken();
      this.apiKey.set(null);
      this.router.navigate(['/auth']);
    } catch (error) {}
  }

  checkAuth(): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.get(`${this.baseUrl}/api/users/checkauth`, {
      headers: {
        Authorization: `Bearer ${token}`,
        NeedKey: 'false',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
  }



  getApiKey(): void {
    const token = this.getToken();
    if (!token) return;

    if (this.apiKey() == null) {
      this.http
        .get(`${this.baseUrl}/api/users/getApiKey`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .subscribe({
          next: (res: any) => {
            if (res?.apiKey) this.apiKey.set(res.apiKey);
          },
          error: () => this.userLogout(),
        });
    }
  }



  getCryptoRecords(): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.get(`${this.baseUrl}/api/crypto/getRecords`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCryptoProt(): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.get(`${this.baseUrl}/api/crypto/getCryptoInfo`, {
      headers: this.getAuthHeaders(),
    });
  }

  submitToBuy(payload: any): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.post(`${this.baseUrl}/api/crypto/cryptoBuy`, payload, {
      withCredentials: true,
      headers: this.getAuthHeaders(),
    });
  }

  submitToSell(payload: any): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.post(`${this.baseUrl}/api/crypto/cryptoSell`, payload, {
      withCredentials: true,
      headers: this.getAuthHeaders(),
    });
  }

  toConvert(payload: any): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.post(`${this.baseUrl}/api/crypto/cryptoConvert`, payload, {
      withCredentials: true,
      headers: this.getAuthHeaders(),
    });
  }

  sendCrypto(payload: any): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.post(`${this.baseUrl}/api/crypto/send`, payload, {
      withCredentials: true,
      headers: this.getAuthHeaders(),
    });
  }

  recevCrypto(): Observable<any> {
    const token = this.getToken();
    if (!token) return EMPTY;

    return this.http.get(`${this.baseUrl}/api/crypto/receive`, {
      withCredentials: true,
      headers: this.getAuthHeaders(),
    });
  }

  getRecord(): Observable<any>{
      const token = this.getToken();
    if (!token) return EMPTY;
    return this.http.get(`${this.baseUrl}/api/crypto/getRecords`, {
      withCredentials: true,
      headers: this.getAuthHeaders(),
    });
  }
}