import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse, Product, CartItem, PurchaseOrder, Payment, Shipment,
  NotificationMessage, Dashboard, Review, AiAnswer, AgentPlan, MCPToolResult
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080';

  constructor(private readonly http: HttpClient) {}

  products(q?: string): Observable<ApiResponse<Product[]>> {
    const params = q ? `?q=${encodeURIComponent(q)}` : '';
    return this.http.get<ApiResponse<Product[]>>(`${this.baseUrl}/api/catalog/products${params}`);
  }

  productById(id: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.baseUrl}/api/catalog/products/${id}`);
  }

  createProduct(product: Product): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.baseUrl}/api/catalog/products`, product);
  }

  updateProduct(id: string, product: Product): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.baseUrl}/api/catalog/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/api/catalog/products/${id}`);
  }

  cart(customerEmail: string): Observable<ApiResponse<CartItem[]>> {
    return this.http.get<ApiResponse<CartItem[]>>(`${this.baseUrl}/api/cart?customerEmail=${encodeURIComponent(customerEmail)}`);
  }

  addCartItem(customerEmail: string, item: CartItem): Observable<ApiResponse<CartItem[]>> {
    return this.http.post<ApiResponse<CartItem[]>>(`${this.baseUrl}/api/cart/items?customerEmail=${encodeURIComponent(customerEmail)}`, item);
  }

  deleteCartItem(customerEmail: string, productId: string): Observable<ApiResponse<CartItem[]>> {
    return this.http.delete<ApiResponse<CartItem[]>>(`${this.baseUrl}/api/cart/items/${productId}?customerEmail=${encodeURIComponent(customerEmail)}`);
  }

  clearCart(customerEmail: string): Observable<ApiResponse<CartItem[]>> {
    return this.http.delete<ApiResponse<CartItem[]>>(`${this.baseUrl}/api/cart?customerEmail=${encodeURIComponent(customerEmail)}`);
  }

  createOrder(customerEmail: string, items: CartItem[], address?: any): Observable<ApiResponse<PurchaseOrder>> {
    return this.http.post<ApiResponse<PurchaseOrder>>(`${this.baseUrl}/api/orders`, {
      customerEmail, items: items.map(i => ({
        productId: i.productId, productName: i.productName,
        quantity: i.quantity, unitPrice: i.unitPrice
      })), address
    });
  }

  orders(customerEmail: string): Observable<ApiResponse<PurchaseOrder[]>> {
    return this.http.get<ApiResponse<PurchaseOrder[]>>(`${this.baseUrl}/api/orders?customerEmail=${encodeURIComponent(customerEmail)}`);
  }

  pay(orderId: number, customerEmail: string, amount: number): Observable<ApiResponse<Payment>> {
    return this.http.post<ApiResponse<Payment>>(`${this.baseUrl}/api/payments`, {
      orderId, customerEmail, amount, provider: 'demo-card'
    });
  }

  shipments(customerEmail: string): Observable<ApiResponse<Shipment[]>> {
    return this.http.get<ApiResponse<Shipment[]>>(`${this.baseUrl}/api/shipping?customerEmail=${encodeURIComponent(customerEmail)}`);
  }

  deliver(orderId: number): Observable<ApiResponse<Shipment>> {
    return this.http.post<ApiResponse<Shipment>>(`${this.baseUrl}/api/shipping/${orderId}/deliver`, {});
  }

  notifications(customerEmail: string): Observable<ApiResponse<NotificationMessage[]>> {
    return this.http.get<ApiResponse<NotificationMessage[]>>(`${this.baseUrl}/api/notifications?customerEmail=${encodeURIComponent(customerEmail)}`);
  }

  dashboard(): Observable<ApiResponse<Dashboard>> {
    return this.http.get<ApiResponse<Dashboard>>(`${this.baseUrl}/api/analytics/dashboard`);
  }

  askAi(message: string): Observable<ApiResponse<AiAnswer>> {
    return this.http.post<ApiResponse<AiAnswer>>(`${this.baseUrl}/api/ai/chat`, { message });
  }

  analyzeFunnel(message: string): Observable<ApiResponse<AiAnswer>> {
    return this.http.post<ApiResponse<AiAnswer>>(`${this.baseUrl}/api/ai/agent/analyze`, { message });
  }

  getAgentPlan(message: string): Observable<ApiResponse<AgentPlan>> {
    return this.http.post<ApiResponse<AgentPlan>>(`${this.baseUrl}/api/ai/agent/plan`, { message });
  }

  mcpExecute(tool: string, params: any): Observable<ApiResponse<MCPToolResult>> {
    return this.http.post<ApiResponse<MCPToolResult>>(`${this.baseUrl}/api/ai/mcp/execute`, { tool, params });
  }

  ragSearch(query: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/api/ai/rag/search`, { message: query });
  }

  reviews(productId: string): Observable<ApiResponse<Review[]>> {
    return this.http.get<ApiResponse<Review[]>>(`${this.baseUrl}/api/catalog/products/${productId}/reviews`);
  }

  addReview(productId: string, review: Review): Observable<ApiResponse<Review>> {
    return this.http.post<ApiResponse<Review>>(`${this.baseUrl}/api/catalog/products/${productId}/reviews`, review);
  }

  adminUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/api/auth/admin/users`);
  }

  adminUpdateUserRole(userId: number, role: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`${this.baseUrl}/api/auth/admin/users/${userId}/role`, { role });
  }

  adminAllOrders(): Observable<ApiResponse<PurchaseOrder[]>> {
    return this.http.get<ApiResponse<PurchaseOrder[]>>(`${this.baseUrl}/api/orders/admin/all`);
  }
}
