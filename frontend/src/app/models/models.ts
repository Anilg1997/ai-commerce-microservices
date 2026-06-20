export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  fullName: string;
  role: string;
}

export interface User {
  id?: number;
  email: string;
  fullName: string;
  role: string;
  createdAt?: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
}

export interface CartItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: number;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export interface Payment {
  id: number;
  orderId: number;
  customerEmail: string;
  amount: number;
  provider: string;
  status: string;
  paidAt: string;
}

export interface Shipment {
  id: number;
  orderId: number;
  customerEmail: string;
  status: string;
  trackingNumber: string;
  address: string;
  updatedAt: string;
}

export interface NotificationMessage {
  id: number;
  subject: string;
  body: string;
  channel: string;
  status: string;
  createdAt: string;
}

export interface EventRecord {
  eventId: string;
  type: string;
  actor: string;
  payload: string;
  occurredAt: string;
}

export interface Dashboard {
  registeredUsers: number;
  cartAdds: number;
  orders: number;
  payments: number;
  shipments: number;
  deliveries: number;
  recentEvents: EventRecord[];
}

export interface Review {
  id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Category {
  id?: string;
  name: string;
  slug: string;
  imageUrl: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface AiQuestion {
  message: string;
}

export interface AiAnswer {
  answer: string;
  retrievedContext: string;
}

export interface AgentPlan {
  agent: string;
  steps: string[];
}

export interface MCPToolResult {
  tool: string;
  result: string;
  status: string;
}
