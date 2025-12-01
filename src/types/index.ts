// Core Product class matching Java specification
export interface Product {
  id: string;
  colorName: string;
  colorCode: string;
  manufacturedDate: string;
  expiryDate: string;
  price: number;
  quality: 'Premium' | 'Standard' | 'Economy';
  quantity: number;
  texture: 'Matte' | 'Gloss' | 'Satin' | 'Semi-Gloss';
  batch: string;
  plant: string;
  brand: string;
}

// User base class
export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  mobileNumber: string;
  role: 'owner' | 'salesperson' | 'distributor';
}

// SalesPerson class matching Java specification
export interface SalesPerson extends User {
  empId: string;
  shopId: string;
  role: 'salesperson';
}

// Shop Owner class
export interface ShopOwner extends User {
  shopId: string;
  role: 'owner';
}

// Distributor class
export interface Distributor extends User {
  role: 'distributor';
  managedShops: string[];
}

// Order class matching Java specification with ArrayList<Product>
export interface OrderItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  productsList: OrderItem[]; // This represents ArrayList<Product> from Java
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'online';
  timestamp: string;
  salespersonId: string;
  shopId: string;
  
  // Methods that would be in Java Order class
  total: number;
  saleTax: number;
  grandTotal: number;
}

// Shop class
export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  ownerId: string;
  city: string;
}

// Sales Report for Owner
export interface SalesReport {
  period: 'day' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  topProducts: Array<{
    product: Product;
    quantitySold: number;
    revenue: number;
  }>;
}

// City Sales Prediction for Distributor
export interface CityPrediction {
  city: string;
  month: string;
  year: number;
  colorPredictions: Array<{
    colorName: string;
    predictedQuantity: number;
    confidence: number;
  }>;
}

// Customer transaction (no UI, just receipt)
export interface CustomerTransaction {
  orderId: string;
  receipt: Receipt;
}

export interface Receipt {
  orderId: string;
  shopName: string;
  shopAddress: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'online';
  timestamp: string;
  salespersonName: string;
}