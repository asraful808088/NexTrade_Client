import { Routes } from '@angular/router';
import { AuthGuard } from '../services/auth-guard';
import { ConvertComponent } from './convert/convert.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Loading } from './loading/loading';
import { ServicesComponent } from './services/services.component';
import { Splash } from './splash/splash';
import { WalletComponent } from './wallet/wallet.component';

export const routes: Routes = [
  { path: '', component: Loading },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'convert', component: ConvertComponent, canActivate: [AuthGuard] },
  { path: 'wallet', component: WalletComponent, canActivate: [AuthGuard] },
  { path: 'services', component: ServicesComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: Splash },
];
