import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Dashboard, EventRecord } from '../../../models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="admin-sidebar">
        <h2>Admin Panel</h2>
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Dashboard</a>
        <a routerLink="/admin/products" routerLinkActive="active">Products</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/admin/users" routerLinkActive="active">Users</a>
      </div>
      <div class="admin-content">
        <h1>Admin Dashboard</h1>
        <div class="admin-metrics">
          <div class="metric-card users"><strong>{{ data?.registeredUsers || 0 }}</strong><span>Registered Users</span></div>
          <div class="metric-card cart"><strong>{{ data?.cartAdds || 0 }}</strong><span>Cart Adds</span></div>
          <div class="metric-card orders"><strong>{{ data?.orders || 0 }}</strong><span>Orders</span></div>
          <div class="metric-card payments"><strong>{{ data?.payments || 0 }}</strong><span>Payments</span></div>
          <div class="metric-card shipped"><strong>{{ data?.shipments || 0 }}</strong><span>Shipped</span></div>
          <div class="metric-card delivered"><strong>{{ data?.deliveries || 0 }}</strong><span>Delivered</span></div>
        </div>
        <div class="admin-charts">
          <div class="chart-card">
            <h3>Funnel Overview</h3>
            <div class="funnel">
              <div class="funnel-bar" style="width:100%">Users: {{ data?.registeredUsers || 0 }}</div>
              <div class="funnel-bar" style="width:{{ funnelPct('cart') }}%">Cart: {{ data?.cartAdds || 0 }}</div>
              <div class="funnel-bar" style="width:{{ funnelPct('orders') }}%">Orders: {{ data?.orders || 0 }}</div>
              <div class="funnel-bar" style="width:{{ funnelPct('payments') }}%">Payments: {{ data?.payments || 0 }}</div>
              <div class="funnel-bar" style="width:{{ funnelPct('deliveries') }}%">Delivered: {{ data?.deliveries || 0 }}</div>
            </div>
          </div>
          <div class="chart-card">
            <h3>Conversion Rates</h3>
            <div class="conversion-metrics">
              <div class="conv-item"><span>User → Cart</span><strong>{{ convRate(data?.registeredUsers, data?.cartAdds) }}%</strong></div>
              <div class="conv-item"><span>Cart → Order</span><strong>{{ convRate(data?.cartAdds, data?.orders) }}%</strong></div>
              <div class="conv-item"><span>Order → Payment</span><strong>{{ convRate(data?.orders, data?.payments) }}%</strong></div>
              <div class="conv-item"><span>Payment → Delivered</span><strong>{{ convRate(data?.payments, data?.deliveries) }}%</strong></div>
            </div>
          </div>
        </div>
        <div class="admin-table">
          <h3>Recent Events</h3>
          <table>
            <thead><tr><th>Type</th><th>Actor</th><th>Payload</th><th>Time</th></tr></thead>
            <tbody>
              <tr *ngFor="let ev of (data?.recentEvents || []).slice(0, 20)">
                <td><span class="event-badge">{{ ev.type }}</span></td>
                <td>{{ ev.actor }}</td>
                <td class="payload">{{ ev.payload }}</td>
                <td>{{ ev.occurredAt | date:'short' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { display: grid; grid-template-columns: 220px 1fr; gap: 24px; min-height: calc(100vh - 160px); }
    .admin-sidebar { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); height: fit-content; position: sticky; top: 80px; }
    .admin-sidebar h2 { font-size: 18px; margin: 0 0 16px; color: #212121; }
    .admin-sidebar a { display: block; padding: 10px 14px; text-decoration: none; color: #555; border-radius: 8px; margin-bottom: 4px; font-size: 14px; }
    .admin-sidebar a:hover, .admin-sidebar a.active { background: #e3f2fd; color: #2874f0; font-weight: 600; }
    .admin-content h1 { font-size: 24px; margin: 0 0 20px; }
    .admin-metrics { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 24px; }
    .metric-card { background: white; border-radius: 10px; padding: 16px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .metric-card strong { display: block; font-size: 28px; margin-bottom: 4px; }
    .metric-card span { font-size: 12px; color: #666; }
    .metric-card.users { border-left: 4px solid #1565c0; }
    .metric-card.cart { border-left: 4px solid #f9a825; }
    .metric-card.orders { border-left: 4px solid #e65100; }
    .metric-card.payments { border-left: 4px solid #2e7d32; }
    .metric-card.shipped { border-left: 4px solid #7b1fa2; }
    .metric-card.delivered { border-left: 4px solid #00838f; }
    .admin-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .chart-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .chart-card h3 { margin: 0 0 16px; font-size: 16px; }
    .funnel { display: flex; flex-direction: column; gap: 8px; }
    .funnel-bar { background: #2874f0; color: white; padding: 10px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; white-space: nowrap; transition: width 0.5s; }
    .conversion-metrics { display: flex; flex-direction: column; gap: 12px; }
    .conv-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f5f7fa; border-radius: 8px; }
    .conv-item strong { font-size: 20px; color: #2874f0; }
    .admin-table { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .admin-table h3 { margin: 0 0 16px; font-size: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    th { color: #666; font-weight: 600; }
    .event-badge { background: #e3f2fd; color: #1565c0; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .payload { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #888; }
    @media (max-width: 768px) { .admin-page { grid-template-columns: 1fr; } .admin-metrics { grid-template-columns: repeat(2, 1fr); } .admin-charts { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
  data: Dashboard | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.dashboard().subscribe({
      next: res => this.data = res.data
    });
  }

  funnelPct(type: string): number {
    if (!this.data) return 0;
    const base = this.data.registeredUsers || 1;
    switch(type) {
      case 'cart': return (this.data.cartAdds / base) * 100;
      case 'orders': return (this.data.orders / base) * 100;
      case 'payments': return (this.data.payments / base) * 100;
      case 'deliveries': return (this.data.deliveries / base) * 100;
      default: return 0;
    }
  }

  convRate(a: number, b: number): number {
    if (!a || !b) return 0;
    return Math.round((b / a) * 100);
  }
}
