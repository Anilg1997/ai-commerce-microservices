import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="admin-sidebar">
        <h2>Admin Panel</h2>
        <a routerLink="/admin">Dashboard</a>
        <a routerLink="/admin/products">Products</a>
        <a routerLink="/admin/orders">Orders</a>
        <a routerLink="/admin/users" routerLinkActive="active">Users</a>
      </div>
      <div class="admin-content">
        <div class="admin-header">
          <h1>Manage Users</h1>
        </div>
        <div class="admin-table">
          <table>
            <thead><tr><th>ID</th><th>Email</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.id }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.fullName }}</td>
                <td><span class="role-badge" [class.admin]="user.role === 'ADMIN'">{{ user.role }}</span></td>
                <td class="actions">
                  <button *ngIf="user.role !== 'ADMIN'" class="btn-promote" (click)="promoteUser(user)">Make Admin</button>
                  <button *ngIf="user.role === 'ADMIN'" class="btn-demote" (click)="demoteUser(user)">Remove Admin</button>
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
    .admin-table { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
    th { color: #666; font-weight: 600; }
    .role-badge { padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: #e3f2fd; color: #1565c0; }
    .role-badge.admin { background: #fff3e0; color: #e65100; }
    .actions { display: flex; gap: 6px; }
    .btn-promote, .btn-demote { padding: 6px 14px; border: none; border-radius: 6px; font-size: 12px; cursor: pointer; }
    .btn-promote { background: #e8f5e9; color: #2e7d32; }
    .btn-demote { background: #ffebee; color: #c62828; }
    @media (max-width: 768px) { .admin-page { grid-template-columns: 1fr; } }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.adminUsers().subscribe(res => this.users = res.data);
  }

  promoteUser(user: any) {
    this.api.adminUpdateUserRole(user.id, 'ADMIN').subscribe({
      next: () => user.role = 'ADMIN'
    });
  }

  demoteUser(user: any) {
    this.api.adminUpdateUserRole(user.id, 'CUSTOMER').subscribe({
      next: () => user.role = 'CUSTOMER'
    });
  }
}
