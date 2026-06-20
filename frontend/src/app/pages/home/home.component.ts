import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product, Category } from '../../models/models';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <section class="hero-banner">
      <div class="hero-content">
        <h1>AI-Powered <span class="highlight">E-Commerce</span> Platform</h1>
        <p>Experience the future of shopping with RAG-powered AI assistant, real-time analytics, and intelligent recommendations</p>
        <div class="hero-actions">
          <a routerLink="/products" class="btn-primary">Shop Now</a>
          <a routerLink="/ai-assistant" class="btn-secondary">Ask AI Assistant</a>
        </div>
      </div>
      <div class="hero-stats">
        <div class="stat"><strong>{{ featuredProducts.length }}</strong><span>Products</span></div>
        <div class="stat"><strong>24/7</strong><span>AI Support</span></div>
        <div class="stat"><strong>Smart</strong><span>Recommendations</span></div>
      </div>
    </section>

    <section class="categories-section">
      <h2>Shop by Category</h2>
      <div class="categories-grid">
        <a *ngFor="let cat of categories" [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="category-card">
          <img [src]="cat.imageUrl" [alt]="cat.name">
          <span>{{ cat.name }}</span>
        </a>
      </div>
    </section>

    <section class="featured-section">
      <div class="section-header">
        <h2>Featured Products</h2>
        <a routerLink="/products" class="view-all">View All →</a>
      </div>
      <div class="product-grid">
        <app-product-card *ngFor="let p of featuredProducts" [product]="p"></app-product-card>
      </div>
    </section>

    <section class="features-section">
      <div class="feature-card">
        <div class="feature-icon">🤖</div>
        <h3>AI Shopping Assistant</h3>
        <p>RAG-powered LLM helps you find products, compare options, and get personalized recommendations</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Real-Time Processing</h3>
        <p>Event-driven architecture with Kafka ensures instant order processing and live updates</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔒</div>
        <h3>Secure & Scalable</h3>
        <p>Microservices with JWT auth, PostgreSQL, MongoDB, Redis — production-ready architecture</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Smart Analytics</h3>
        <p>Real-time dashboard with funnel analysis, event tracking, and AI-powered insights</p>
      </div>
    </section>
  `,
  styles: [`
    .hero-banner {
      background: linear-gradient(135deg, #1a237e 0%, #2874f0 50%, #0d47a1 100%);
      color: white;
      padding: 60px 40px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    .hero-content h1 { font-size: 42px; margin: 0 0 16px; line-height: 1.2; }
    .highlight { color: #ffd54f; }
    .hero-content p { font-size: 16px; opacity: 0.9; max-width: 500px; margin-bottom: 24px; }
    .hero-actions { display: flex; gap: 12px; }
    .btn-primary, .btn-secondary {
      padding: 12px 28px; border-radius: 8px; text-decoration: none;
      font-weight: 600; font-size: 15px; transition: all 0.2s;
    }
    .btn-primary { background: #fb641b; color: white; }
    .btn-primary:hover { background: #e55a16; }
    .btn-secondary { background: rgba(255,255,255,0.15); color: white; }
    .btn-secondary:hover { background: rgba(255,255,255,0.25); }
    .hero-stats { display: flex; gap: 24px; }
    .stat { text-align: center; }
    .stat strong { display: block; font-size: 32px; }
    .stat span { font-size: 13px; opacity: 0.8; }
    .categories-section { margin-bottom: 40px; }
    .categories-section h2 { font-size: 24px; margin-bottom: 20px; }
    .categories-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .category-card {
      background: white; border-radius: 12px; overflow: hidden; text-decoration: none;
      color: inherit; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .category-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
    .category-card img { width: 100%; height: 160px; object-fit: cover; }
    .category-card span { display: block; padding: 12px 16px; font-weight: 600; font-size: 15px; }
    .featured-section { margin-bottom: 40px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-header h2 { font-size: 24px; margin: 0; }
    .view-all { color: #2874f0; text-decoration: none; font-weight: 600; }
    .view-all:hover { text-decoration: underline; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
    .features-section { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 20px; }
    .feature-card {
      background: white; border-radius: 12px; padding: 28px 20px;
      text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.08); border: 1px solid #f0f0f0;
      transition: transform 0.2s;
    }
    .feature-card:hover { transform: translateY(-2px); }
    .feature-icon { font-size: 40px; margin-bottom: 12px; }
    .feature-card h3 { font-size: 16px; margin: 0 0 8px; }
    .feature-card p { font-size: 13px; color: #666; line-height: 1.5; margin: 0; }
    @media (max-width: 768px) {
      .hero-banner { flex-direction: column; text-align: center; padding: 40px 20px; }
      .hero-content h1 { font-size: 28px; }
      .hero-actions { justify-content: center; }
      .hero-stats { margin-top: 20px; }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
      .features-section { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  categories: Category[] = [
    { name: 'Electronics', slug: 'electronics', imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80' },
    { name: 'Laptops', slug: 'laptops', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80' },
    { name: 'Accessories', slug: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
    { name: 'Books', slug: 'books', imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.products().subscribe({
      next: res => this.featuredProducts = res.data.slice(0, 8),
      error: () => this.featuredProducts = this.demoProducts()
    });
  }

  private demoProducts(): Product[] {
    return [
      { id: 'd1', name: 'AI Starter Laptop', description: 'Developer laptop for AI demos', price: 899, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=400&q=80', category: 'Laptops', rating: 4.5, reviewCount: 128 },
      { id: 'd2', name: 'Kafka Event Kit', description: 'Learning bundle for event-driven workflows', price: 149, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80', category: 'Books', rating: 4.8, reviewCount: 89 },
      { id: 'd3', name: 'Wireless Headphones', description: 'Premium noise-cancelling headphones', price: 299, stock: 25, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80', category: 'Electronics', rating: 4.3, reviewCount: 256 },
      { id: 'd4', name: 'Smart Watch Pro', description: 'Health tracking smartwatch', price: 199, stock: 18, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80', category: 'Electronics', rating: 4.6, reviewCount: 312 },
    ];
  }
}
