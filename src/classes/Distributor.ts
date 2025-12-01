// Distributor class for managing multiple shops and predictions
import { ShopOwnerClass } from './ShopOwner';
import { ProductClass } from './Product';
import { OrderClass } from './Order';

export interface CityPrediction {
  city: string;
  month: string;
  year: number;
  colorPredictions: Array<{
    colorName: string;
    colorCode: string;
    predictedQuantity: number;
    confidence: number;
    trend: string;
  }>;
}

export class DistributorClass {
  id: string;
  username: string;
  password: string;
  name: string;
  mobileNumber: string;
  managedShopIds: string[];

  constructor(
    id: string,
    username: string,
    password: string,
    name: string,
    mobileNumber: string,
    managedShopIds: string[] = []
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.mobileNumber = mobileNumber;
    this.managedShopIds = managedShopIds;
  }

  // Login method
  login(username: string, password: string): boolean {
    return this.username === username && this.password === password;
  }

  // Add shop owner
  addShopOwner(shopOwner: ShopOwnerClass): boolean {
    if (!this.managedShopIds.includes(shopOwner.shopId)) {
      this.managedShopIds.push(shopOwner.shopId);
      return true;
    }
    return false;
  }

  // Remove shop owner
  removeShopOwner(shopId: string): boolean {
    const index = this.managedShopIds.indexOf(shopId);
    if (index > -1) {
      this.managedShopIds.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get inventory summary for each shop
  getInventorySummaryForShops(
    shopInventories: Map<string, ProductClass[]>
  ): Map<string, {
    totalProducts: number;
    lowStockItems: number;
    totalValue: number;
    topColors: Array<{ colorName: string; quantity: number }>;
  }> {
    const summaries = new Map();

    this.managedShopIds.forEach(shopId => {
      const inventory = shopInventories.get(shopId) || [];
      
      const totalProducts = inventory.length;
      const lowStockItems = inventory.filter(product => product.quantity < 50).length;
      const totalValue = inventory.reduce((sum, product) => sum + (product.price * product.quantity), 0);
      
      // Get top colors by quantity
      const colorQuantities = new Map<string, number>();
      inventory.forEach(product => {
        const existing = colorQuantities.get(product.colorName) || 0;
        colorQuantities.set(product.colorName, existing + product.quantity);
      });
      
      const topColors = Array.from(colorQuantities.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([colorName, quantity]) => ({ colorName, quantity }));

      summaries.set(shopId, {
        totalProducts,
        lowStockItems,
        totalValue,
        topColors
      });
    });

    return summaries;
  }

  // Predict monthly sales for each city by color
  predictMonthlySalesByCity(
    historicalOrders: OrderClass[],
    targetMonth: number,
    targetYear: number
  ): CityPrediction[] {
    // Mock prediction algorithm - in real implementation, this would use ML
    const cityData = new Map<string, Map<string, { total: number; trend: number }>>();
    
    // Analyze historical data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const recentOrders = historicalOrders.filter(order => 
      new Date(order.timestamp) >= sixMonthsAgo
    );

    // Group by city and color
    recentOrders.forEach(order => {
      // Mock city assignment based on shopId
      const city = this.getCityFromShopId(order.shopId);
      
      if (!cityData.has(city)) {
        cityData.set(city, new Map());
      }
      
      const cityColors = cityData.get(city)!;
      
      order.productsList.forEach(item => {
        const colorName = item.product.colorName;
        const existing = cityColors.get(colorName) || { total: 0, trend: 0 };
        
        cityColors.set(colorName, {
          total: existing.total + item.quantity,
          trend: existing.trend + (item.quantity * 0.1) // Simple trend calculation
        });
      });
    });

    // Generate predictions
    const predictions: CityPrediction[] = [];
    
    cityData.forEach((colors, city) => {
      const colorPredictions = Array.from(colors.entries()).map(([colorName, data]) => {
        // Simple prediction: historical average + trend
        const baseQuantity = data.total / 6; // Average per month
        const trendAdjustment = data.trend;
        const predictedQuantity = Math.round(baseQuantity + trendAdjustment);
        
        // Mock confidence calculation
        const confidence = Math.min(95, Math.max(60, 80 + (data.total / 100)));
        
        // Mock trend string
        const trendPercentage = ((trendAdjustment / baseQuantity) * 100).toFixed(1);
        const trend = trendAdjustment > 0 ? `+${trendPercentage}%` : `${trendPercentage}%`;
        
        return {
          colorName,
          colorCode: this.getColorCode(colorName), // Mock color code
          predictedQuantity: Math.max(0, predictedQuantity),
          confidence,
          trend
        };
      }).sort((a, b) => b.predictedQuantity - a.predictedQuantity);

      predictions.push({
        city,
        month: new Date(targetYear, targetMonth - 1).toLocaleString('default', { month: 'long' }),
        year: targetYear,
        colorPredictions
      });
    });

    return predictions;
  }

  // Helper method to get city from shop ID (mock implementation)
  private getCityFromShopId(shopId: string): string {
    const cityMap: { [key: string]: string } = {
      'shop1': 'Downtown',
      'shop2': 'Uptown',
      'shop3': 'Midtown',
      'shop4': 'Eastside'
    };
    return cityMap[shopId] || 'Unknown City';
  }

  // Helper method to get color code (mock implementation)
  private getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'Ocean Blue': '#0077BE',
      'Sunset Orange': '#FF6B35',
      'Forest Green': '#228B22',
      'Pure White': '#FFFFFF',
      'Royal Purple': '#663399'
    };
    return colorMap[colorName] || '#000000';
  }

  // Get overall business analytics
  getBusinessAnalytics(allOrders: OrderClass[]): {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    topPerformingShops: Array<{ shopId: string; revenue: number; orders: number }>;
    monthlyGrowth: number;
  } {
    const shopPerformance = new Map<string, { revenue: number; orders: number }>();
    
    allOrders.forEach(order => {
      const existing = shopPerformance.get(order.shopId) || { revenue: 0, orders: 0 };
      shopPerformance.set(order.shopId, {
        revenue: existing.revenue + order.getGrandTotal(),
        orders: existing.orders + 1
      });
    });

    const totalRevenue = allOrders.reduce((sum, order) => sum + order.getGrandTotal(), 0);
    const totalOrders = allOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const topPerformingShops = Array.from(shopPerformance.entries())
      .map(([shopId, data]) => ({ shopId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Mock monthly growth calculation
    const monthlyGrowth = 12.5; // Mock 12.5% growth

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      topPerformingShops,
      monthlyGrowth
    };
  }
}