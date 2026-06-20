import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CartItem } from '../../models/models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-page">
      <div class="cart-items" *ngIf="cartItems.length > 0">
        <h2>My Cart ({{ cartItems.length }} items)</h2>
        <div class="cart-item" *ngFor="let item of cartItems">
          <img [src]="item.imageUrl" [alt]="item.productName">
          <div class="item-details">
            <h3>{{ item.productName }}</h3>
            <div class="item-price">\${{ item.unitPrice }}</div>
          </div>
          <div class="item-quantity">
            <button (click)="updateQty(item, -1)" [disabled]="item.quantity <= 1">−</button>
            <span>{{ item.quantity }}</span>
            <button (click)="updateQty(item, 1)">+</button>
          </div>
          <div class="item-total">\${{ (item.unitPrice * item.quantity) }}</div>
          <button class="btn-remove" (click)="removeItem(item.productId)">🗑</button>
        </div>
        <div class="cart-actions">
          <button class="btn-clear" (click)="clearCart()">Clear Cart</button>
        </div>
      </div>
      <div class="cart-empty" *ngIf="cartItems.length === 0">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a routerLink="/products" class="btn-shop">Continue Shopping</a>
      </div>
      <div class="order-summary" *ngIf="cartItems.length > 0">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Items</span><span>{{ cartItems.length }}</span></div>
        <div class="summary-row"><span>Subtotal</span><span>\${{ subtotal }}</span></div>
        <div class="summary-row"><span>Shipping</span><span>FREE</span></div>
        <div class="summary-row total"><span>Total</span><span>\${{ subtotal }}</span></div>
        <button class="btn-checkout" [routerLink]="['/checkout']">Proceed to Checkout</button>
      </div>
    </div>
  `,
  styles: [`
    .cart-page { display: grid; grid-template-columns: 1fr 340px; gap: 24px; min-height: calc(100vh - 160px); }
    .cart-items h2 { font-size: 22px; margin: 0 0 20px; }
    .cart-item { display: flex; align-items: center; gap: 16px; background: white; padding: 16px; border-radius: 10px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .cart-item img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
    .item-details { flex: 1; }
    .item-details h3 { margin: 0 0 4px; font-size: 15px; }
    .item-price { color: #2874f0; font-weight: 700; font-size: 16px; }
    .item-quantity { display: flex; align-items: center; gap: 8px; }
    .item-quantity button { width: 32px; height: 32px; border: 1px solid #ddd; border-radius: 50%; background: white; cursor: pointer; font-size: 16px; }
    .item-quantity button:disabled { opacity: 0.5; cursor: not-allowed; }
    .item-quantity span { font-weight: 600; min-width: 20px; text-align: center; }
    .item-total { font-weight: 700; font-size: 16px; min-width: 70px; text-align: right; }
    .btn-remove { background: none; border: none; font-size: 18px; cursor: pointer; opacity: 0.6; }
    .btn-remove:hover { opacity: 1; }
    .cart-actions { margin-top: 12px; }
    .btn-clear { padding: 8px 20px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 8px; cursor: pointer; font-size: 13px; }
    .btn-clear:hover { background: #eee; }
    .cart-empty { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 64px; margin-bottom: 16px; }
    .cart-empty h2 { margin: 0 0 8px; }
    .cart-empty p { color: #666; margin-bottom: 24px; }
    .btn-shop { display: inline-block; padding: 12px 32px; background: #2874f0; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; }
    .order-summary { background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); height: fit-content; position: sticky; top: 80px; }
    .order-summary h3 { margin: 0 0 16px; font-size: 18px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #555; }
    .summary-row.total { border-top: 1px solid #eee; margin-top: 8px; padding-top: 12px; font-weight: 700; font-size: 18px; color: #212121; }
    .btn-checkout { width: 100%; padding: 14px; background: #fb641b; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; margin-top: 16px; transition: background 0.2s; text-decoration: none; display: block; text-align: center; }
    .btn-checkout:hover { background: #e55a16; }
    @media (max-width: 768px) { .cart-page { grid-template-columns: 1fr; } }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];

  constructor(private api: ApiService, public auth: AuthService) {}

  get subtotal() { return this.cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0); }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.loadCart();
    }
  }

  loadCart() {
    this.api.cart(this.auth.currentUser()!.email).subscribe({
      next: res => this.cartItems = res.data
    });
  }

  updateQty(item: CartItem, delta: number) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    this.api.addCartItem(this.auth.currentUser()!.email, { ...item, quantity: newQty }).subscribe({
      next: res => this.cartItems = res.data
    });
  }

  removeItem(productId: string) {
    this.api.deleteCartItem(this.auth.currentUser()!.email, productId).subscribe({
      next: res => this.cartItems = res.data
    });
  }

  clearCart() {
    this.api.clearCart(this.auth.currentUser()!.email).subscribe({
      next: () => this.cartItems = []
    });
  }
}
