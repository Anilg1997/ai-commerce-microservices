import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartItem, Address } from '../../models/models';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="checkout-page">
      <div class="checkout-form">
        <h2>Checkout</h2>
        <div class="address-section">
          <h3>Shipping Address</h3>
          <div class="form-row">
            <input [(ngModel)]="address.street" placeholder="Street Address">
          </div>
          <div class="form-row group">
            <input [(ngModel)]="address.city" placeholder="City">
            <input [(ngModel)]="address.state" placeholder="State">
            <input [(ngModel)]="address.zip" placeholder="ZIP Code">
          </div>
          <div class="form-row">
            <input [(ngModel)]="address.phone" placeholder="Phone Number">
          </div>
        </div>
        <div class="order-items">
          <h3>Order Items</h3>
          <div class="checkout-item" *ngFor="let item of cartItems">
            <img [src]="item.imageUrl" [alt]="item.productName">
            <span>{{ item.productName }}</span>
            <span>{{ item.quantity }} x \${{ item.unitPrice }}</span>
            <span class="item-amount">\${{ item.unitPrice * item.quantity }}</span>
          </div>
        </div>
      </div>
      <div class="checkout-summary">
        <h3>Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>\${{ subtotal }}</span></div>
        <div class="summary-row"><span>Shipping</span><span>FREE</span></div>
        <div class="summary-row total"><span>Total</span><span>\${{ subtotal }}</span></div>
        <button class="btn-place-order" (click)="placeOrder()" [disabled]="placing">
          {{ placing ? 'Processing...' : 'Place Order' }}
        </button>
        <p class="order-status" *ngIf="orderStatus">{{ orderStatus }}</p>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { display: grid; grid-template-columns: 1fr 360px; gap: 24px; min-height: calc(100vh - 160px); }
    .checkout-form h2 { font-size: 22px; margin: 0 0 20px; }
    .address-section, .order-items { background: white; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .address-section h3, .order-items h3 { margin: 0 0 16px; font-size: 16px; }
    .form-row { margin-bottom: 12px; }
    .form-row input { width: 100%; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    .form-row.group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
    .checkout-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .checkout-item img { width: 50px; height: 50px; object-fit: cover; border-radius: 6px; }
    .checkout-item span { flex: 1; font-size: 14px; }
    .checkout-item .item-amount { font-weight: 700; text-align: right; min-width: 70px; }
    .checkout-summary { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); height: fit-content; position: sticky; top: 80px; }
    .checkout-summary h3 { margin: 0 0 16px; font-size: 18px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #555; }
    .summary-row.total { border-top: 1px solid #eee; margin-top: 8px; padding-top: 12px; font-weight: 700; font-size: 18px; color: #212121; }
    .btn-place-order { width: 100%; padding: 14px; background: #fb641b; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 16px; }
    .btn-place-order:hover { background: #e55a16; }
    .btn-place-order:disabled { background: #ccc; cursor: not-allowed; }
    .order-status { margin-top: 12px; text-align: center; font-size: 14px; color: #388e3c; }
    @media (max-width: 768px) { .checkout-page { grid-template-columns: 1fr; } .form-row.group { grid-template-columns: 1fr; } }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  address: Address = { street: '123 Main St', city: 'Bangalore', state: 'KA', zip: '560001', phone: '+91-9876543210' };
  placing = false;
  orderStatus = '';

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}

  get subtotal() { return this.cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0); }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.api.cart(this.auth.currentUser()!.email).subscribe({
        next: res => this.cartItems = res.data
      });
    }
  }

  placeOrder() {
    if (this.cartItems.length === 0) return;
    this.placing = true;
    this.api.createOrder(this.auth.currentUser()!.email, this.cartItems, this.address).subscribe({
      next: res => {
        this.orderStatus = `Order #${res.data.id} created! Redirecting to payment...`;
        this.api.clearCart(this.auth.currentUser()!.email).subscribe();
        setTimeout(() => {
          this.api.pay(res.data.id, res.data.customerEmail, res.data.total).subscribe({
            next: () => {
              this.orderStatus = 'Payment successful! Redirecting to orders...';
              setTimeout(() => this.router.navigate(['/orders']), 1000);
            }
          });
        }, 500);
      },
      error: () => {
        this.orderStatus = 'Order failed. Make sure services are running.';
        this.placing = false;
      }
    });
  }
}
