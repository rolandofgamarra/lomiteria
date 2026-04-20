export type UserRole = "ADMIN" | "CASHIER" | "WAITER";

export type SessionUser = {
  id: number;
  username: string;
  role: UserRole;
};

export type Session = {
  token: string;
  user: SessionUser;
};

export type Overview = {
  revenue: number;
  activeOrders: number;
  occupiedTables: number;
  totalProducts: number;
};

export type RevenuePoint = {
  label: string;
  amount: number;
};

export type TopProduct = {
  name: string;
  quantity: number | null;
};

export type ActiveOrderItem = {
  id: number;
  quantity: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
};

export type ActiveOrder = {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  table: {
    id: number;
    number: number;
    status: string;
  };
  items: ActiveOrderItem[];
};
