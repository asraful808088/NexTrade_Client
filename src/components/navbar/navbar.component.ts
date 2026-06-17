import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Router } from '@angular/router';
import { Users } from '../../services/users.service';
import { CryptoService } from '../../services/crypto.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  menuOpen = signal(false);
  scrolled = signal(false);
profileOpen = signal(false);
  notifyActive = signal(false);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }
  constructor(private api:Api,private router:Router,public users:Users,public crypto:CryptoService){

  }
  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 10);
  }

  navLinks = [
    { label: 'Dashboard', path: '/dashboard', exact: true },
    { label: 'Convert',   path: '/convert' },
    { label: 'Wallet',    path: '/wallet' },
    { label: 'Services',      path: '/services' }
  ];
  get username(){
   
    return this?.users?.userData()?.fristname
  }


  get lastname(){

    
   
    return this?.users?.userData()?.lastname
  }
  logout():void{
    this.api.userLogout()
    this.router.navigate(['/'])
  }

  getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
  































































}
