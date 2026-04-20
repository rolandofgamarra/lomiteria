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
