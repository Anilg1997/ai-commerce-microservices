import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { Product } from '../../../models/models';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="admin-sidebar">
        <h2>Admin Panel</h2>
        <a routerLink="/admin">Dashboard</a>
        <a routerLink="/admin/products" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Products</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Orders</a>
        <a routerLink="/admin/users" routerLinkActive="active">Users</a>
      </div>
      <div class="admin-content">
        <div class="admin-header">
          <h1>Manage Products</h1>
          <button class="btn-add" (click)="showForm = !showForm; editProduct = null">
            {{ showForm ? 'Cancel' : '+ Add Product' }}
          </button>
        </div>
        <div class="product-form" *ngIf="showForm">
          <h3>{{ editProduct ? 'Edit Product' : 'New Product' }}</h3>
          <div class="form-grid">
            <input [(ngModel)]="formProduct.name" placeholder="Product Name">
            <input [(ngModel)]="formProduct.category" placeholder="Category">
            <input [(ngModel)]="formProduct.price" type="number" placeholder="Price">
            <input [(ngModel)]="formProduct.stock" type="number" placeholder="Stock">
            <input [(ngModel)]="formProduct.imageUrl" placeholder="Image URL">
            <input [(ngModel)]="formProduct.rating" type="number" placeholder="Rating (1-5)">
            <textarea [(ngModel)]="formProduct.description" placeholder="Description" class="full-width"></textarea>
            <button (click)="saveProduct()">{{ editProduct ? 'Update' : 'Create' }}</button>
          </div>
        </div>
        <div class="admin-table">
          <table>
            <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td><img [src]="p.imageUrl" class="thumb"></td>
                <td>{{ p.name }}</td>
                <td>{{ p.category || '—' }}</td>
                <td>\${{ p.price }}</td>
                <td><span [class.low]="p.stock < 10">{{ p.stock }}</span></td>
                <td>{{ p.rating || '—' }}</td>
                <td class="actions">
                  <button class="btn-edit" (click)="editProd(p)">Edit</button>
                  <button class="btn-del" (click)="deleteProd(p)">Delete</button>
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
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn-add { padding: 10px 20px; background: #2874f0; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-add:hover { background: #1a5fc7; }
    .product-form { background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
    .product-form h3 { margin: 0 0 16px; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .form-grid input, .form-grid textarea { padding: 10px 12px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 14px; }
    .form-grid textarea.full-width { grid-column: 1 / -1; min-height: 60px; }
    .form-grid button { grid-column: 1 / -1; padding: 12px; background: #fb641b; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .admin-table { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    th { color: #666; font-weight: 600; }
    .thumb { width: 50px; height: 50px; object-fit: cover; border-radius: 6px; }
    .low { color: #d32f2f; font-weight: 700; }
    .actions { display: flex; gap: 6px; }
    .btn-edit, .btn-del { padding: 6px 14px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .btn-edit { background: #e3f2fd; color: #1565c0; }
    .btn-del { background: #ffebee; color: #c62828; }
    @media (max-width: 768px) { .admin-page { grid-template-columns: 1fr; } .form-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  showForm = false;
  editProduct: Product | null = null;
  formProduct: Product = { name: '', description: '', price: 0, stock: 0, imageUrl: '', category: '', rating: 4.5 };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.products().subscribe(res => this.products = res.data);
  }

  editProd(p: Product) {
    this.editProduct = p;
    this.formProduct = { ...p };
    this.showForm = true;
  }

  saveProduct() {
    if (this.editProduct && this.editProduct.id) {
      this.api.updateProduct(this.editProduct.id, this.formProduct).subscribe({
        next: res => {
          const idx = this.products.findIndex(p => p.id === this.editProduct!.id);
          if (idx >= 0) this.products[idx] = res.data;
          this.showForm = false;
          this.editProduct = null;
        }
      });
    } else {
      this.api.createProduct(this.formProduct).subscribe({
        next: res => {
          this.products = [res.data, ...this.products];
          this.showForm = false;
        }
      });
    }
    this.formProduct = { name: '', description: '', price: 0, stock: 0, imageUrl: '', category: '', rating: 4.5 };
  }

  deleteProd(p: Product) {
    if (p.id && confirm(`Delete ${p.name}?`)) {
      this.api.deleteProduct(p.id).subscribe({
        next: () => this.products = this.products.filter(x => x.id !== p.id)
      });
    }
  }
}
