import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsCardComponent } from '../../components/alerts-card/alerts-card.component';
import { AllocationCardComponent } from '../../components/allocation-card/allocation-card.component';
import { ChartCardComponent } from '../../components/chart-card/chart-card.component';
import { EarnCardComponent } from '../../components/earn-card/earn-card.component';
import { HeatmapCardComponent } from '../../components/heatmap-card/heatmap-card.component';
import { MoversCardComponent } from '../../components/movers-card/movers-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import { TransactionsCardComponent } from '../../components/transactions-card/transactions-card.component';
import { DashboardService } from '../../services/dashboard.service';
import { Users } from '../../services/users.service';
import { Api } from '../../services/api';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent {
  private svc = inject(DashboardService);
    
  bodyExp: string = `{
  "email": "client@email.com",
  "pass": "client_password"
}
`;

 responseExp: string = `{
  "status": "success",
  "message": "Payment successful",
  "transaction_id": "TXN123456789",
  "amount": 500,
  "currency": "USD"
}
`;
  constructor(
    private users: Users,
    private router: Router,
    public api:Api
  ) {
 if (!(users.userData()) ) {
      this.router.navigate(['/']);
    }
    
  }

  ngOnInit() {
     
  }
  stats = this.svc.getStats();
  movers = this.svc.getMarketMovers();
  transactions = this.svc.getTransactions();
  earnPools = this.svc.getEarnPools();
  alerts = this.svc.getPriceAlerts();
  heatmap = this.svc.getHeatmap();
  allocation = this.svc.getAllocation();
  btcPrice = this.svc.btcPrice;

  today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  toggleAlert(id: string): void {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) alert.active = !alert.active;
  }
}
