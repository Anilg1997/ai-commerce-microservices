import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/models';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/products', product.id]" class="product-card">
      <div class="card-image">
        <img [src]="product.imageUrl" [alt]="product.name">
        <span class="card-discount" *ngIf="product.rating && product.rating >= 4.5">Top Rated</span>
      </div>
      <div class="card-body">
        <h3>{{ product.name }}</h3>
        <div class="card-rating" *ngIf="product.rating">
          <span class="stars">&#9733; {{ product.rating }}</span>
          <span class="reviews">({{ product.reviewCount || 0 }})</span>
        </div>
        <div class="card-price">\${{ product.price }}</div>
        <p class="card-desc">{{ product.description }}</p>
        <div class="card-stock" [class.low]="product.stock < 10">
          {{ product.stock > 0 ? (product.stock + ' left') : 'Out of stock' }}
        </div>
      </div>
    </a>
  `,
  styles: [`
    .product-card {
      display: block; background: white; border-radius: 10px; overflow: hidden; text-decoration: none;
      color: inherit; box-shadow: 0 1px 3px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s;
    }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.12); }
    .card-image { position: relative; }
    .card-image img { width: 100%; aspect-ratio: 1; object-fit: cover; }
    .card-discount {
      position: absolute; top: 8px; left: 8px; background: #388e3c; color: white;
      padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;
    }
    .card-body { padding: 12px 14px 14px; }
    .card-body h3 { margin: 0 0 6px; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .card-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
    .stars { color: #f9a825; font-size: 13px; font-weight: 700; }
    .reviews { color: #878787; font-size: 12px; }
    .card-price { font-size: 18px; font-weight: 700; color: #212121; margin-bottom: 4px; }
    .card-desc { font-size: 12px; color: #878787; margin: 0 0 8px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-stock { font-size: 12px; color: #388e3c; font-weight: 600; }
    .card-stock.low { color: #d32f2f; }
  `]
})
export class ProductCardComponent {
  @Input() product!: Product;
}
