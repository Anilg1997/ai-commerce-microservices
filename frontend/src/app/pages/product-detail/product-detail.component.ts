import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Product, Review } from '../../models/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="detail-container" *ngIf="product">
      <div class="product-detail">
        <div class="product-image">
          <img [src]="product.imageUrl" [alt]="product.name">
        </div>
        <div class="product-info">
          <div class="breadcrumb">
            <a routerLink="/">Home</a> / <a routerLink="/products">Products</a> / <span>{{ product.name }}</span>
          </div>
          <h1>{{ product.name }}</h1>
          <div class="rating-row">
            <span class="stars">&#9733; {{ product.rating || 4.5 }}</span>
            <span class="review-count">{{ product.reviewCount || 0 }} reviews</span>
          </div>
          <div class="price-section">
            <span class="price">\${{ product.price }}</span>
            <span class="stock" [class.low]="product.stock < 10">{{ product.stock > 0 ? (product.stock + ' in stock') : 'Out of stock' }}</span>
          </div>
          <p class="description">{{ product.description }}</p>
          <div class="features" *ngIf="product.features">
            <h3>Features</h3>
            <ul>
              <li *ngFor="let f of product.features">{{ f }}</li>
            </ul>
          </div>
          <div class="actions">
            <button class="btn-add-cart" (click)="addToCart()" [disabled]="product.stock === 0">Add to Cart</button>
            <button class="btn-buy" (click)="buyNow()" [disabled]="product.stock === 0">Buy Now</button>
          </div>
        </div>
      </div>
      <div class="reviews-section">
        <h2>Customer Reviews</h2>
        <div class="review-form" *ngIf="auth.isLoggedIn()">
          <h3>Write a Review</h3>
          <div class="rating-select">
            <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.active]="s <= newReview.rating" (click)="newReview.rating = s">&#9733;</span>
          </div>
          <textarea [(ngModel)]="newReview.comment" placeholder="Share your experience..."></textarea>
          <button (click)="submitReview()">Submit Review</button>
        </div>
        <div class="review" *ngFor="let r of reviews">
          <div class="review-header">
            <strong>{{ r.userName }}</strong>
            <span class="stars">&#9733; {{ r.rating }}</span>
          </div>
          <p>{{ r.comment }}</p>
          <small>{{ r.createdAt | date }}</small>
        </div>
        <div *ngIf="reviews.length === 0" class="no-reviews">No reviews yet.</div>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 1100px; margin: 0 auto; padding: 20px 0; }
    .product-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .product-image img { width: 100%; border-radius: 8px; max-height: 400px; object-fit: cover; }
    .breadcrumb { font-size: 13px; color: #666; margin-bottom: 12px; }
    .breadcrumb a { color: #2874f0; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    h1 { font-size: 28px; margin: 0 0 12px; }
    .rating-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .stars { color: #f9a825; font-weight: 700; }
    .review-count { color: #666; font-size: 14px; }
    .price-section { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
    .price { font-size: 32px; font-weight: 700; color: #212121; }
    .stock { font-size: 14px; color: #388e3c; font-weight: 600; }
    .stock.low { color: #d32f2f; }
    .description { color: #555; line-height: 1.6; margin-bottom: 16px; }
    .features { margin-bottom: 20px; }
    .features h3 { font-size: 16px; margin: 0 0 8px; }
    .features ul { margin: 0; padding-left: 20px; }
    .features li { margin-bottom: 6px; color: #555; font-size: 14px; }
    .actions { display: flex; gap: 12px; }
    .btn-add-cart, .btn-buy { padding: 14px 32px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-add-cart { background: #ff9f00; color: white; }
    .btn-add-cart:hover { background: #e68f00; }
    .btn-buy { background: #fb641b; color: white; }
    .btn-buy:hover { background: #e55a16; }
    .btn-add-cart:disabled, .btn-buy:disabled { background: #ccc; cursor: not-allowed; }
    .reviews-section { margin-top: 30px; background: white; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .reviews-section h2 { margin: 0 0 20px; }
    .review-form { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .review-form h3 { margin: 0 0 12px; font-size: 16px; }
    .rating-select { margin-bottom: 12px; }
    .star { font-size: 24px; cursor: pointer; color: #ddd; transition: color 0.2s; }
    .star.active { color: #f9a825; }
    .review-form textarea { width: 100%; min-height: 80px; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 12px; }
    .review-form button { padding: 10px 24px; background: #2874f0; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .review-form button:hover { background: #1a5fc7; }
    .review { padding: 16px 0; border-bottom: 1px solid #f0f0f0; }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .review-header strong { font-size: 14px; }
    .review p { margin: 0 0 4px; color: #333; font-size: 14px; }
    .review small { color: #999; }
    .no-reviews { text-align: center; color: #999; padding: 40px; }
    @media (max-width: 768px) {
      .product-detail { grid-template-columns: 1fr; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] = [];
  newReview: Review = { productId: '', userId: '', userName: '', rating: 5, comment: '', createdAt: '' };

  constructor(
    private route: ActivatedRoute, private api: ApiService,
    public auth: AuthService, private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.productById(id).subscribe({
      next: res => {
        this.product = res.data;
        this.newReview.productId = id;
        this.newReview.userName = this.auth.currentUser()?.fullName || 'Anonymous';
      }
    });
  }

  addToCart() {
    if (!this.auth.isLoggedIn()) { this.router.navigate(['/auth']); return; }
    if (this.product) {
      this.api.addCartItem(this.auth.currentUser()!.email, {
        productId: this.product.id!, productName: this.product.name,
        unitPrice: this.product.price, quantity: 1, imageUrl: this.product.imageUrl
      }).subscribe({ next: () => this.router.navigate(['/cart']) });
    }
  }

  buyNow() {
    this.addToCart();
  }

  submitReview() {
    this.api.addReview(this.newReview.productId, this.newReview).subscribe({
      next: res => {
        this.reviews = [res.data, ...this.reviews];
        this.newReview.comment = '';
      }
    });
  }
}
