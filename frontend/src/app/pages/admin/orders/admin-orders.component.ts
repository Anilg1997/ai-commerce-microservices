import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { PurchaseOrder } from '../../../models/models';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="admin-sidebar">
        <h2>Admin Panel</h2>
        <a routerLink="/admin">Dashboard</a>
        <a routerLink="/admin/products">Products</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/admin/users" routerLinkActive="active">Users</a>
      </div>
      <div class="admin-content">
        <div class="admin-header">
          <h1>Manage Orders</h1>
          <div class="order-filters">
            <select [(ngModel)]="statusFilter" (change)="filterOrders()">
              <option value="">All Status</option>
              <option value="CREATED">Created</option>
              <option value="PAID">Paid</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
            </select>
          </div>
        </div>
        <div class="admin-table">
          <table>
            <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let o of filteredOrders">
                <td>#{{ o.id }}</td>
                <td>{{ o.customerEmail }}</td>
                <td>{{ o.items.length }}</td>
                <td>\${{ o.total }}</td>
                <td><span class="status-badge" [class]="o.status.toLowerCase()">{{ o.status }}</span></td>
                <td>{{ o.createdAt | date:'short' }}</td>
                <td class="actions">
                  <button *ngIf="o.status === 'CREATED'" (click)="updateStatus(o, 'PAID')" class="btn-paid">Mark Paid</button>
                  <button *ngIf="o.status === 'PAID'" (click)="updateStatus(o, 'SHIPPED')" class="btn-ship">Mark Shipped</button>
                  <button *ngIf="o.status === 'SHIPPED'" (click)="updateStatus(o, 'DELIVERED')" class="btn-deliver">Mark Delivered</button>
                </td>
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
    .admin-sidebar h2 { font-size: 18px; margin: 0 0 16px; }
    .admin-sidebar a { display: block; padding: 10px 14px; text-decoration: none; color: #555; border-radius: 8px; margin-bottom: 4px; font-size: 14px; }
    .admin-sidebar a:hover, .admin-sidebar a.active { background: #e3f2fd; color: #2874f0; font-weight: 600; }
    .admin-content h1 { font-size: 24px; margin: 0; }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .order-filters select { padding: 10px 14px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    .admin-table { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    th { color: #666; font-weight: 600; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .status-badge.created { background: #e3f2fd; color: #1565c0; }
    .status-badge.paid { background: #e8f5e9; color: #2e7d32; }
    .status-badge.shipped { background: #fff3e0; color: #e65100; }
    .status-badge.delivered { background: #f3e5f5; color: #7b1fa2; }
    .actions { display: flex; gap: 4px; flex-wrap: wrap; }
    .btn-paid, .btn-ship, .btn-deliver { padding: 5px 12px; border: none; border-radius: 6px; font-size: 11px; cursor: pointer; }
    .btn-paid { background: #e8f5e9; color: #2e7d32; }
    .btn-ship { background: #fff3e0; color: #e65100; }
    .btn-deliver { background: #f3e5f5; color: #7b1fa2; }
    @media (max-width: 768px) { .admin-page { grid-template-columns: 1fr; } }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  filteredOrders: PurchaseOrder[] = [];
  statusFilter = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.adminAllOrders().subscribe({
      next: res => {
        this.orders = res.data;
        this.filteredOrders = [...this.orders];
      }
    });
  }

  filterOrders() {
    if (!this.statusFilter) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    }
  }

  updateStatus(order: PurchaseOrder, newStatus: string) {
    if (newStatus === 'PAID') {
      this.api.pay(order.id, order.customerEmail, order.total).subscribe({
        next: () => setTimeout(() => this.ngOnInit(), 500)
      });
    } else if (newStatus === 'DELIVERED') {
      this.api.deliver(order.id).subscribe({ next: () => this.ngOnInit() });
    } else {
      this.ngOnInit();
    }
  }
}
