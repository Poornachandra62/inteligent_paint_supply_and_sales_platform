// Order class matching Java specification exactly with ArrayList<Product>
import { ProductClass } from './Product';

export interface OrderItem {
  product: ProductClass;
  quantity: number;
}

export class OrderClass {
  id: string;
  productsList: OrderItem[]; // This represents ArrayList<Product> from Java
  customerName?: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'online';
  timestamp: string;
  salespersonId: string;
  shopId: string;

  constructor(
    id: string,
    salespersonId: string,
    shopId: string,
    paymentMethod: 'cash' | 'online' = 'cash',
    customerName?: string,
    customerPhone?: string
  ) {
    this.id = id;
    this.productsList = []; // Initialize as empty ArrayList equivalent
    this.salespersonId = salespersonId;
    this.shopId = shopId;
    this.paymentMethod = paymentMethod;
    this.customerName = customerName;
    this.customerPhone = customerPhone;
    this.timestamp = new Date().toISOString();
  }

  // Add product method as specified in Java
  addProduct(product: ProductClass, quantity: number = 1): void {
    const existingItem = this.productsList.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.productsList.push({
        product: product,
        quantity: quantity
      });
    }
  }

  // Remove product from order
  removeProduct(productId: string): void {
    this.productsList = this.productsList.filter(item => item.product.id !== productId);
  }

  // Update product quantity in order
  updateProductQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeProduct(productId);
      return;
    }

    const item = this.productsList.find(item => item.product.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  }

  // Get total method as specified in Java
  getTotal(): number {
    return this.productsList.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  }

  // Sales tax method as specified in Java
  saleTax(): number {
    return this.getTotal() * 0.10; // 10% tax
  }

  // Get grand total including tax
  getGrandTotal(): number {
    return this.getTotal() + this.saleTax();
  }

  // Get total items count
  getTotalItems(): number {
    return this.productsList.reduce((total, item) => total + item.quantity, 0);
  }

  // Clear all products from order
  clearOrder(): void {
    this.productsList = [];
  }

  // Check if order is empty
  isEmpty(): boolean {
    return this.productsList.length === 0;
  }

  // Get order summary
  getOrderSummary(): {
    itemCount: number;
    subtotal: number;
    tax: number;
    total: number;
  } {
    return {
      itemCount: this.getTotalItems(),
      subtotal: this.getTotal(),
      tax: this.saleTax(),
      total: this.getGrandTotal()
    };
  }
}