import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/models';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="products-layout">
      <aside class="filters">
        <h3>Filters</h3>
        <div class="filter-section">
          <label>Search</label>
          <input [(ngModel)]="searchQuery" (input)="filterProducts()" placeholder="Search products...">
        </div>
        <div class="filter-section">
          <label>Category</label>
          <select [(ngModel)]="selectedCategory" (change)="filterProducts()">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="filter-section">
          <label>Price Range</label>
          <div class="price-range">
            <input [(ngModel)]="minPrice" (input)="filterProducts()" type="number" placeholder="Min">
            <span>—</span>
            <input [(ngModel)]="maxPrice" (input)="filterProducts()" type="number" placeholder="Max">
          </div>
        </div>
        <div class="filter-section">
          <label>Sort By</label>
          <select [(ngModel)]="sortBy" (change)="filterProducts()">
            <option value="name">Name</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <button class="btn-clear" (click)="clearFilters()">Clear Filters</button>
      </aside>
      <div class="products-content">
        <div class="products-header">
          <h2>{{ filteredProducts.length }} Products Found</h2>
        </div>
        <div class="product-grid">
          <app-product-card *ngFor="let p of filteredProducts" [product]="p"></app-product-card>
        </div>
        <div class="no-results" *ngIf="filteredProducts.length === 0">
          <p>No products found. Try different filters.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-layout { display: grid; grid-template-columns: 260px 1fr; gap: 24px; min-height: calc(100vh - 160px); }
    .filters { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); height: fit-content; position: sticky; top: 80px; }
    .filters h3 { margin: 0 0 16px; font-size: 18px; }
    .filter-section { margin-bottom: 16px; }
    .filter-section label { display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 6px; }
    .filter-section input, .filter-section select {
      width: 100%; padding: 10px 12px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 13px;
    }
    .price-range { display: flex; gap: 8px; align-items: center; }
    .price-range span { color: #666; }
    .btn-clear { width: 100%; padding: 10px; background: #f5f5f5; border: 1px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; }
    .btn-clear:hover { background: #eee; }
    .products-content { min-height: 400px; }
    .products-header { margin-bottom: 20px; }
    .products-header h2 { font-size: 20px; margin: 0; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .no-results { text-align: center; padding: 60px 20px; color: #666; }
    @media (max-width: 768px) {
      .products-layout { grid-template-columns: 1fr; }
      .filters { position: static; }
    }
  `]
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy = 'name';
  categories: string[] = [];

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.api.products().subscribe({
      next: res => {
        this.allProducts = res.data;
        this.extractCategories();
        this.route.queryParams.subscribe(params => {
          if (params['category']) {
            this.selectedCategory = params['category'];
          }
          this.filterProducts();
        });
      },
      error: () => {
        this.allProducts = this.demoProducts();
        this.extractCategories();
        this.filterProducts();
      }
    });
  }

  private extractCategories() {
    const cats = new Set(this.allProducts.map(p => p.category || 'Uncategorized'));
    this.categories = Array.from(cats).sort();
  }

  filterProducts() {
    let filtered = [...this.allProducts];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }
    if (this.minPrice !== null) {
      filtered = filtered.filter(p => p.price >= this.minPrice!);
    }
    if (this.maxPrice !== null) {
      filtered = filtered.filter(p => p.price <= this.maxPrice!);
    }
    switch (this.sortBy) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'rating': filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    this.filteredProducts = filtered;
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'name';
    this.filterProducts();
  }

  private demoProducts(): Product[] {
    return [
      { id: 'd1', name: 'AI Starter Laptop', description: 'Developer laptop for AI demos', price: 899, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80', category: 'Laptops', rating: 4.5, reviewCount: 128 },
      { id: 'd2', name: 'Kafka Event Kit', description: 'Learning bundle for event-driven workflows', price: 149, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', category: 'Books', rating: 4.8, reviewCount: 89 },
      { id: 'd3', name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 299, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', category: 'Electronics', rating: 4.3, reviewCount: 256 },
      { id: 'd4', name: 'Smart Watch Pro', description: 'Health tracking smartwatch', price: 199, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80', category: 'Electronics', rating: 4.6, reviewCount: 312 },
      { id: 'd5', name: 'USB-C Hub 7-in-1', description: 'Multi-port adapter for laptops', price: 49, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1625723044791-5b272a5c0d8b?auto=format&fit=crop&w=400&q=80', category: 'Accessories', rating: 4.2, reviewCount: 543 },
      { id: 'd6', name: 'Mechanical Keyboard', description: 'RGB mechanical keyboard for developers', price: 159, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80', category: 'Accessories', rating: 4.7, reviewCount: 189 },
    ];
  }
}
