// Shop Owner class for managing shop operations
import { OrderClass } from './Order';
import { SalesPersonClass } from './SalesPerson';

export class ShopOwnerClass {
  id: string;
  username: string;
  password: string;
  name: string;
  mobileNumber: string;
  shopId: string;

  constructor(
    id: string,
    username: string,
    password: string,
    name: string,
    mobileNumber: string,
    shopId: string
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.mobileNumber = mobileNumber;
    this.shopId = shopId;
  }

  // Login method
  login(username: string, password: string): boolean {
    return this.username === username && this.password === password;
  }

  // Add salesperson to shop
  addSalesPerson(salesPerson: SalesPersonClass): boolean {
    // Logic to add salesperson to the shop
    return salesPerson.shopId === this.shopId;
  }

  // Remove salesperson from shop
  removeSalesPerson(salesPersonId: string): boolean {
    // Logic to remove salesperson
    return true;
  }

  // Generate financial report for day/month/year
  generateFinancialReport(
    orders: OrderClass[], 
    period: 'day' | 'month' | 'year',
    date?: Date
  ): {
    period: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    topSellingProducts: Array<{
      productName: string;
      quantitySold: number;
      revenue: number;
    }>;
  } {
    const targetDate = date || new Date();
    let filteredOrders: OrderClass[] = [];

    // Filter orders based on period
    switch (period) {
      case 'day':
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.timestamp);
          return orderDate.toDateString() === targetDate.toDateString();
        });
        break;
      case 'month':
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.timestamp);
          return orderDate.getMonth() === targetDate.getMonth() && 
                 orderDate.getFullYear() === targetDate.getFullYear();
        });
        break;
      case 'year':
        filteredOrders = orders.filter(order => {
          const orderDate = new Date(order.timestamp);
          return orderDate.getFullYear() === targetDate.getFullYear();
        });
        break;
    }

    const totalSales = filteredOrders.reduce((sum, order) => sum + order.getGrandTotal(), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Calculate top selling products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    filteredOrders.forEach(order => {
      order.productsList.forEach(item => {
        const key = item.product.id;
        const existing = productSales.get(key);
        const revenue = item.product.price * item.quantity;
        
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += revenue;
        } else {
          productSales.set(key, {
            name: item.product.colorName,
            quantity: item.quantity,
            revenue: revenue
          });
        }
      });
    });

    const topSellingProducts = Array.from(productSales.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(item => ({
        productName: item.name,
        quantitySold: item.quantity,
        revenue: item.revenue
      }));

    return {
      period: `${period} - ${targetDate.toLocaleDateString()}`,
      totalSales,
      totalOrders,
      averageOrderValue,
      topSellingProducts
    };
  }

  // Get accounting summary
  getAccountingSummary(orders: OrderClass[]): {
    totalRevenue: number;
    totalTax: number;
    netRevenue: number;
    orderCount: number;
  } {
    const totalRevenue = orders.reduce((sum, order) => sum + order.getGrandTotal(), 0);
    const totalTax = orders.reduce((sum, order) => sum + order.saleTax(), 0);
    const netRevenue = orders.reduce((sum, order) => sum + order.getTotal(), 0);
    
    return {
      totalRevenue,
      totalTax,
      netRevenue,
      orderCount: orders.length
    };
  }
}