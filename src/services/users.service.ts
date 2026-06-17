import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Users {
  userData = signal<any | null>(null);

  record = signal<any>([]);

  constructor() {}
  addUserData(usersInfo: any): void {
    this.userData.set(usersInfo);
  }
  removeUserData(): void {
    this.userData.set(null);
  }
  getUserData(): any {
    return this.userData();
  }
}
