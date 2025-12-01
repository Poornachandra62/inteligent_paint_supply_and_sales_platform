// SalesPerson class matching Java specification exactly
import { OrderClass } from './Order';
import { ProductClass } from './Product';

export class SalesPersonClass {
  empId: string;
  username: string;
  password: string;
  name: string;
  mobileNumber: string;
  shopId: string;
  id: string;

  constructor(
    empId: string,
    username: string,
    password: string,
    name: string,
    mobileNumber: string,
    shopId: string,
    id: string
  ) {
    this.empId = empId;
    this.username = username;
    this.password = password;
    this.name = name;
    this.mobileNumber = mobileNumber;
    this.shopId = shopId;
    this.id = id;
  }

  // Login method as specified in Java
  login(username: string, password: string): boolean {
    return this.username === username && this.password === password;
  }

  // CreateBill method as specified in Java
  createBill(order: OrderClass): string {
    // Generate bill/receipt
    const billId = `BILL-${Date.now()}`;
    
    // Process the order and generate receipt
    const receipt = {
      billId,
      orderId: order.id,
      salespersonId: this.empId,
      salespersonName: this.name,
      shopId: this.shopId,
      items: order.productsList,
      subtotal: order.getTotal(),
      tax: order.saleTax(),
      total: order.getTotal() + order.saleTax(),
      timestamp: new Date().toISOString(),
      paymentMethod: order.paymentMethod
    };

    return JSON.stringify(receipt, null, 2);
  }

  // Search inventory by color and brand
  searchInventory(products: ProductClass[], searchTerm: string): ProductClass[] {
    return products.filter(product => 
      product.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Add product to inventory
  addProductToInventory(products: ProductClass[], newProduct: ProductClass): ProductClass[] {
    return [...products, newProduct];
  }

  // Update product quantity
  updateProductQuantity(products: ProductClass[], productId: string, newQuantity: number): ProductClass[] {
    return products.map(product => 
      product.id === productId 
        ? { ...product, quantity: newQuantity }
        : product
    );
  }
}