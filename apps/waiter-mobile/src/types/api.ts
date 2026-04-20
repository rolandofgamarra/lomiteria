export interface Product {
  id: number;
  name: string;
  price: number;
  isAvailable?: boolean;
}

export interface CatalogCategory {
  id: number;
  name: string;
  products: Product[];
}

export interface TableRecord {
  id: number;
  number: number;
  status: string;
  capacity?: number;
}

export interface ProductExtra {
  id: number;
  name: string;
  price: number;
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
  isHalfAndHalf?: boolean;
  extras?: number[];
  notes?: string;
}

export interface CreateOrderRequest {
  tableId: number;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderResponse {
  id: number;
  status: string;
  totalAmount: number;
  tableId: number;
  waiterId: number;
}

export interface OrderHistoryItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  notes?: string | null;
  product: Product;
  extras?: {
    id: number;
    productExtra: ProductExtra;
  }[];
}

export interface OrderHistoryRecord {
  id: number;
  tableId: number;
  waiterId: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  table?: TableRecord;
  waiter?: {
    id: number;
    username: string;
    role: string;
  };
  items: OrderHistoryItem[];
}
