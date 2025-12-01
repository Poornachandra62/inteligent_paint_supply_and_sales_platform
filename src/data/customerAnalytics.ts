import { Order, Product } from '../types';
import { mockOrders } from './mockData';

// Customer purchase analytics interface
export interface CustomerPurchaseData {
  customerName: string;
  customerPhone: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  firstPurchase: string;
  lastPurchase: string;
  favoriteColors: Array<{
    colorName: string;
    colorCode: string;
    purchases: number;
    totalSpent: number;
  }>;
  favoriteBrands: Array<{
    brandName: string;
    purchases: number;
    totalSpent: number;
  }>;
  preferredShops: Array<{
    shopId: string;
    shopName: string;
    visits: number;
    totalSpent: number;
  }>;
  purchaseFrequency: number; // days between purchases
  customerType: 'VIP' | 'Premium' | 'Regular' | 'New' | 'Dormant';
  paymentPreference: 'cash' | 'online' | 'mixed';
  seasonalTrends: Array<{
    month: string;
    orders: number;
    totalSpent: number;
  }>;
  orderHistory: Order[];
}

// Customer segmentation thresholds
const CUSTOMER_SEGMENTS = {
  VIP: { minSpent: 50000, minOrders: 20 },
  Premium: { minSpent: 25000, minOrders: 10 },
  Regular: { minSpent: 10000, minOrders: 5 },
  New: { maxDays: 90 },
  Dormant: { minDaysSinceLastPurchase: 180 }
};

// Analyze customer purchase patterns
export const analyzeCustomerPurchases = (): CustomerPurchaseData[] => {
  // Group orders by customer
  const customerGroups: { [key: string]: Order[] } = {};
  
  mockOrders.forEach(order => {
    const customerKey = order.customerName || 'Walk-in Customer';
    if (!customerGroups[customerKey]) {
      customerGroups[customerKey] = [];
    }
    customerGroups[customerKey].push(order);
  });

  // Analyze each customer
  const customerAnalytics: CustomerPurchaseData[] = [];

  Object.entries(customerGroups).forEach(([customerName, orders]) => {
    if (orders.length === 0) return;

    // Basic metrics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.grandTotal, 0);
    const averageOrderValue = totalSpent / totalOrders;

    // Date analysis
    const orderDates = orders
      .map(order => new Date(order.timestamp))
      .filter(date => !isNaN(date.getTime())) // Filter out invalid dates
      .sort();
    
    const firstPurchase = orderDates.length > 0 ? orderDates[0].toISOString() : new Date().toISOString();
    const lastPurchase = orderDates.length > 0 ? orderDates[orderDates.length - 1].toISOString() : new Date().toISOString();
    
    // Purchase frequency (average days between orders)
    let purchaseFrequency = 0;
    if (orderDates.length > 1) {
      const totalDays = (orderDates[orderDates.length - 1].getTime() - orderDates[0].getTime()) / (1000 * 60 * 60 * 24);
      purchaseFrequency = totalDays / (orderDates.length - 1);
    }

    // Color preferences
    const colorMap: { [key: string]: { purchases: number; totalSpent: number; colorCode: string } } = {};
    orders.forEach(order => {
      order.productsList.forEach(item => {
        const colorName = item.product.colorName;
        const colorCode = item.product.colorCode;
        if (!colorMap[colorName]) {
          colorMap[colorName] = { purchases: 0, totalSpent: 0, colorCode };
        }
        colorMap[colorName].purchases += item.quantity;
        colorMap[colorName].totalSpent += item.subtotal;
      });
    });

    const favoriteColors = Object.entries(colorMap)
      .map(([colorName, data]) => ({
        colorName,
        colorCode: data.colorCode,
        purchases: data.purchases,
        totalSpent: data.totalSpent
      }))
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 5);

    // Brand preferences
    const brandMap: { [key: string]: { purchases: number; totalSpent: number } } = {};
    orders.forEach(order => {
      order.productsList.forEach(item => {
        const brandName = item.product.brand;
        if (!brandMap[brandName]) {
          brandMap[brandName] = { purchases: 0, totalSpent: 0 };
        }
        brandMap[brandName].purchases += item.quantity;
        brandMap[brandName].totalSpent += item.subtotal;
      });
    });

    const favoriteBrands = Object.entries(brandMap)
      .map(([brandName, data]) => ({
        brandName,
        purchases: data.purchases,
        totalSpent: data.totalSpent
      }))
      .sort((a, b) => b.purchases - a.purchases)
      .slice(0, 3);

    // Shop preferences (need to get shop names)
    const shopMap: { [key: string]: { visits: number; totalSpent: number; shopName: string } } = {};
    orders.forEach(order => {
      const shopId = order.shopId;
      if (!shopMap[shopId]) {
        // You can enhance this to get actual shop names from mockShops
        shopMap[shopId] = { visits: 0, totalSpent: 0, shopName: `Shop ${shopId}` };
      }
      shopMap[shopId].visits += 1;
      shopMap[shopId].totalSpent += order.grandTotal;
    });

    const preferredShops = Object.entries(shopMap)
      .map(([shopId, data]) => ({
        shopId,
        shopName: data.shopName,
        visits: data.visits,
        totalSpent: data.totalSpent
      }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 3);

    // Customer type classification
    let customerType: 'VIP' | 'Premium' | 'Regular' | 'New' | 'Dormant' = 'New';
    const daysSinceLastPurchase = (Date.now() - new Date(lastPurchase).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastPurchase > CUSTOMER_SEGMENTS.Dormant.minDaysSinceLastPurchase) {
      customerType = 'Dormant';
    } else if (totalSpent >= CUSTOMER_SEGMENTS.VIP.minSpent && totalOrders >= CUSTOMER_SEGMENTS.VIP.minOrders) {
      customerType = 'VIP';
    } else if (totalSpent >= CUSTOMER_SEGMENTS.Premium.minSpent && totalOrders >= CUSTOMER_SEGMENTS.Premium.minOrders) {
      customerType = 'Premium';
    } else if (totalSpent >= CUSTOMER_SEGMENTS.Regular.minSpent && totalOrders >= CUSTOMER_SEGMENTS.Regular.minOrders) {
      customerType = 'Regular';
    }

    // Payment preference
    const cashPayments = orders.filter(order => order.paymentMethod === 'cash').length;
    const onlinePayments = orders.filter(order => order.paymentMethod === 'online').length;
    let paymentPreference: 'cash' | 'online' | 'mixed' = 'mixed';
    
    if (cashPayments > onlinePayments * 2) {
      paymentPreference = 'cash';
    } else if (onlinePayments > cashPayments * 2) {
      paymentPreference = 'online';
    }

    // Seasonal trends (monthly analysis)
    const monthlyData: { [key: string]: { orders: number; totalSpent: number } } = {};
    orders.forEach(order => {
      const orderDate = new Date(order.timestamp);
      // Skip invalid dates
      if (isNaN(orderDate.getTime())) return;
      
      const month = orderDate.toLocaleString('default', { month: 'long' });
      if (!monthlyData[month]) {
        monthlyData[month] = { orders: 0, totalSpent: 0 };
      }
      monthlyData[month].orders += 1;
      monthlyData[month].totalSpent += order.grandTotal;
    });

    const seasonalTrends = Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        orders: data.orders,
        totalSpent: data.totalSpent
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    customerAnalytics.push({
      customerName,
      customerPhone: orders[0].customerPhone || '',
      totalOrders,
      totalSpent,
      averageOrderValue,
      firstPurchase,
      lastPurchase,
      favoriteColors,
      favoriteBrands,
      preferredShops,
      purchaseFrequency,
      customerType,
      paymentPreference,
      seasonalTrends,
      orderHistory: orders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    });
  });

  // Sort by total spent (VIP customers first)
  return customerAnalytics.sort((a, b) => b.totalSpent - a.totalSpent);
};

// Get customer summary statistics
export const getCustomerSummary = () => {
  const customers = analyzeCustomerPurchases();
  
  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.customerType === 'VIP').length;
  const premiumCustomers = customers.filter(c => c.customerType === 'Premium').length;
  const regularCustomers = customers.filter(c => c.customerType === 'Regular').length;
  const newCustomers = customers.filter(c => c.customerType === 'New').length;
  const dormantCustomers = customers.filter(c => c.customerType === 'Dormant').length;

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageCustomerValue = totalRevenue / totalCustomers;
  const topCustomer = customers[0];

  return {
    totalCustomers,
    customerSegmentation: {
      vip: vipCustomers,
      premium: premiumCustomers,
      regular: regularCustomers,
      new: newCustomers,
      dormant: dormantCustomers
    },
    totalRevenue,
    averageCustomerValue,
    topCustomer: topCustomer ? {
      name: topCustomer.customerName,
      totalSpent: topCustomer.totalSpent,
      totalOrders: topCustomer.totalOrders
    } : null,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0)
  };
};
