import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { PurchaseOrder, Shipment, NotificationMessage } from '../../models/models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-page">
      <div class="orders-section">
        <h2>My Orders</h2>
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <div>
              <strong>Order #{{ order.id }}</strong>
              <span class="order-status" [class]="order.status.toLowerCase()">{{ order.status }}</span>
            </div>
            <span class="order-date">{{ order.createdAt | date:'medium' }}</span>
          </div>
          <div class="order-items">
            <div class="order-item" *ngFor="let item of order.items">
              <span>{{ item.productName }}</span>
              <span>{{ item.quantity }} x \${{ item.unitPrice }}</span>
            </div>
          </div>
          <div class="order-footer">
            <strong>Total: \${{ order.total }}</strong>
            <button *ngIf="order.status !== 'PAID'" (click)="payOrder(order)">Pay Now</button>
          </div>
        </div>
        <div class="empty-state" *ngIf="orders.length === 0">
          <p>No orders yet. <a routerLink="/products">Start shopping</a></p>
        </div>
      </div>
      <div class="side-section">
        <div class="shipments-panel">
          <h2>Shipments</h2>
          <div class="shipment-card" *ngFor="let s of shipments">
            <strong>Order #{{ s.orderId }}</strong>
            <span [class]="s.status.toLowerCase()">{{ s.status }}</span>
            <small>Tracking: {{ s.trackingNumber }}</small>
            <button *ngIf="s.status !== 'DELIVERED'" (click)="markDelivered(s.orderId)">Mark Delivered</button>
          </div>
          <div class="empty-state" *ngIf="shipments.length === 0"><p>No shipments yet.</p></div>
        </div>
        <div class="notifications-panel" style="margin-top:16px;">
          <h2>Notifications</h2>
          <div class="notification" *ngFor="let n of notifications">
            <strong>{{ n.subject }}</strong>
            <small>{{ n.body }}</small>
            <span class="notif-time">{{ n.createdAt | date:'short' }}</span>
          </div>
          <div class="empty-state" *ngIf="notifications.length === 0"><p>No notifications.</p></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .orders-page { display: grid; grid-template-columns: 1fr 340px; gap: 24px; min-height: calc(100vh - 160px); }
    .orders-section h2 { font-size: 22px; margin: 0 0 20px; }
    .order-card { background: white; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .order-header div { display: flex; align-items: center; gap: 12px; }
    .order-status { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .order-status.created { background: #e3f2fd; color: #1565c0; }
    .order-status.paid { background: #e8f5e9; color: #2e7d32; }
    .order-status.shipped { background: #fff3e0; color: #e65100; }
    .order-status.delivered { background: #f3e5f5; color: #7b1fa2; }
    .order-date { font-size: 12px; color: #999; }
    .order-item { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #555; }
    .order-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f0f0f0; margin-top: 8px; }
    .order-footer button { padding: 8px 20px; background: #fb641b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .side-section { display: flex; flex-direction: column; }
    .shipments-panel, .notifications-panel { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .shipments-panel h2, .notifications-panel h2 { font-size: 18px; margin: 0 0 16px; }
    .shipment-card { padding: 10px 0; border-bottom: 1px solid #f0f0f0; display: flex; flex-direction: column; gap: 4px; }
    .shipment-card small { color: #999; font-size: 12px; }
    .shipment-card button { align-self: flex-start; padding: 6px 14px; background: #2874f0; color: white; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; margin-top: 4px; }
    .created, .CREATED { color: #1565c0; }
    .shipped, .SHIPPED { color: #e65100; }
    .delivered, .DELIVERED { color: #2e7d32; }
    .notification { padding: 8px 0; border-bottom: 1px solid #f5f5f5; font-size: 13px; }
    .notification strong { display: block; }
    .notification small { color: #666; display: block; }
    .notif-time { font-size: 11px; color: #999; }
    .empty-state { text-align: center; padding: 40px; color: #999; }
    @media (max-width: 768px) { .orders-page { grid-template-columns: 1fr; } }
  `]
})
export class OrdersComponent implements OnInit {
  orders: PurchaseOrder[] = [];
  shipments: Shipment[] = [];
  notifications: NotificationMessage[] = [];

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loadData();
    }
  }

  loadData() {
    const email = this.auth.currentUser()!.email;
    this.api.orders(email).subscribe(res => this.orders = res.data);
    this.api.shipments(email).subscribe(res => this.shipments = res.data);
    this.api.notifications(email).subscribe(res => this.notifications = res.data);
  }

  payOrder(order: PurchaseOrder) {
    this.api.pay(order.id, order.customerEmail, order.total).subscribe({
      next: () => setTimeout(() => this.loadData(), 1000)
    });
  }

  markDelivered(orderId: number) {
    this.api.deliver(orderId).subscribe({ next: () => this.loadData() });
  }
}
