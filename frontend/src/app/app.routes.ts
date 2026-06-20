import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { AiAssistantComponent } from './pages/ai-assistant/ai-assistant.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './pages/admin/products/admin-products.component';
import { AdminOrdersComponent } from './pages/admin/orders/admin-orders.component';
import { AdminUsersComponent } from './pages/admin/users/admin-users.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  { path: 'ai-assistant', component: AiAssistantComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/users', component: AdminUsersComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: '**', redirectTo: '' }
];
