import { mockOrders } from '../data/mockData';

export interface TimeSlotBehavior {
  timeSlot: string;
  hour: number;
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  topProducts: Array<{
    productName: string;
    colorName: string;
    count: number;
  }>;
  customerType: {
    premium: number; // Percentage
    budget: number;
    standard: number;
  };
}

export interface DayOfWeekBehavior {
  day: string;
  dayIndex: number;
  totalOrders: number;
  totalRevenue: number;
  peakHour: number;
  topCategories: string[];
  averageBasketSize: number;
}

export interface SeasonalBehavior {
  month: string;
  monthIndex: number;
  totalOrders: number;
  totalRevenue: number;
  festivalBoost: number; // Percentage increase
  topColors: string[];
}

export interface BehaviorHeatmapData {
  timeSlots: TimeSlotBehavior[];
  daysOfWeek: DayOfWeekBehavior[];
  seasonal: SeasonalBehavior[];
  insights: {
    peakTime: string;
    peakDay: string;
    slowestTime: string;
    slowestDay: string;
    premiumBuyingTime: string;
    budgetBuyingTime: string;
  };
}

// Time slots for analysis
const TIME_SLOTS = [
  { name: 'Early Morning', start: 6, end: 9 },
  { name: 'Morning', start: 9, end: 12 },
  { name: 'Afternoon', start: 12, end: 15 },
  { name: 'Evening', start: 15, end: 18 },
  { name: 'Night', start: 18, end: 21 }
];

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Festival months in India (higher sales expected)
const FESTIVAL_MONTHS = [2, 3, 9, 10]; // March, April, October, November (Holi, Diwali, etc.)

// Analyze time-based customer behavior
export function analyzeTimeBehavior(): TimeSlotBehavior[] {
  const timeSlotData: TimeSlotBehavior[] = TIME_SLOTS.map(slot => ({
    timeSlot: slot.name,
    hour: slot.start,
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    topProducts: [],
    customerType: { premium: 0, budget: 0, standard: 0 }
  }));

  // Categorize orders by time slot
  const slotOrders: Map<string, any[]> = new Map();
  TIME_SLOTS.forEach(slot => slotOrders.set(slot.name, []));

  mockOrders.forEach(order => {
    const orderDate = new Date(order.timestamp);
    // Skip invalid dates
    if (isNaN(orderDate.getTime())) return;
    
    const hour = orderDate.getHours();

    // Find matching time slot
    const slot = TIME_SLOTS.find(s => hour >= s.start && hour < s.end);
    if (slot) {
      const orders = slotOrders.get(slot.name) || [];
      orders.push(order);
      slotOrders.set(slot.name, orders);
    }
  });

  // Analyze each time slot
  slotOrders.forEach((orders, slotName) => {
    const slotIndex = TIME_SLOTS.findIndex(s => s.name === slotName);
    if (slotIndex === -1) return;

    const slot = timeSlotData[slotIndex];
    slot.totalOrders = orders.length;
    slot.totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);
    slot.avgOrderValue = slot.totalOrders > 0 ? slot.totalRevenue / slot.totalOrders : 0;

    // Analyze customer types
    let premiumCount = 0;
    let budgetCount = 0;
    let standardCount = 0;

    orders.forEach(order => {
      if (order.grandTotal > 5000) premiumCount++;
      else if (order.grandTotal < 1500) budgetCount++;
      else standardCount++;
    });

    const total = orders.length;
    slot.customerType = {
      premium: total > 0 ? (premiumCount / total) * 100 : 0,
      budget: total > 0 ? (budgetCount / total) * 100 : 0,
      standard: total > 0 ? (standardCount / total) * 100 : 0
    };

    // Find top products
    const productCounts: Map<string, { colorName: string; count: number }> = new Map();
    orders.forEach(order => {
      order.productsList.forEach(item => {
        const key = item.product.id;
        const existing = productCounts.get(key);
        if (existing) {
          existing.count += item.quantity;
        } else {
          productCounts.set(key, {
            colorName: item.product.colorName,
            count: item.quantity
          });
        }
      });
    });

    slot.topProducts = Array.from(productCounts.entries())
      .map(([id, data]) => ({
        productName: id,
        colorName: data.colorName,
        count: data.count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  });

  return timeSlotData;
}

// Analyze day-of-week patterns
export function analyzeDayOfWeekBehavior(): DayOfWeekBehavior[] {
  const dayData: DayOfWeekBehavior[] = DAYS_OF_WEEK.map((day, index) => ({
    day,
    dayIndex: index,
    totalOrders: 0,
    totalRevenue: 0,
    peakHour: 12,
    topCategories: [],
    averageBasketSize: 0
  }));

  // Group orders by day
  const dayOrders: Map<number, any[]> = new Map();
  DAYS_OF_WEEK.forEach((_, index) => dayOrders.set(index, []));

  mockOrders.forEach(order => {
    const orderDate = new Date(order.timestamp);
    // Skip invalid dates
    if (isNaN(orderDate.getTime())) return;
    
    const dayIndex = orderDate.getDay();
    const orders = dayOrders.get(dayIndex) || [];
    orders.push(order);
    dayOrders.set(dayIndex, orders);
  });

  // Analyze each day
  dayOrders.forEach((orders, dayIndex) => {
    const day = dayData[dayIndex];
    if (!day) return; // Safety check
    day.totalOrders = orders.length;
    day.totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);

    // Calculate average basket size
    const totalItems = orders.reduce((sum, order) => 
      sum + order.productsList.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    day.averageBasketSize = day.totalOrders > 0 ? totalItems / day.totalOrders : 0;

    // Find peak hour
    const hourCounts: Map<number, number> = new Map();
    orders.forEach(order => {
      const orderDate = new Date(order.timestamp);
      if (isNaN(orderDate.getTime())) return; // Skip invalid dates
      const hour = orderDate.getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });

    let maxCount = 0;
    hourCounts.forEach((count, hour) => {
      if (count > maxCount) {
        maxCount = count;
        day.peakHour = hour;
      }
    });

    // Determine top categories (simplified - based on product quality)
    const categoryCount = { premium: 0, standard: 0, economy: 0 };
    orders.forEach(order => {
      order.productsList.forEach(item => {
        const quality = item.product.quality.toLowerCase();
        if (quality === 'premium') categoryCount.premium++;
        else if (quality === 'standard') categoryCount.standard++;
        else categoryCount.economy++;
      });
    });

    day.topCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat.charAt(0).toUpperCase() + cat.slice(1));
  });

  return dayData;
}

// Analyze seasonal/monthly behavior
export function analyzeSeasonalBehavior(): SeasonalBehavior[] {
  const monthData: SeasonalBehavior[] = MONTHS.map((month, index) => ({
    month,
    monthIndex: index,
    totalOrders: 0,
    totalRevenue: 0,
    festivalBoost: 0,
    topColors: []
  }));

  // Group orders by month
  const monthOrders: Map<number, any[]> = new Map();
  MONTHS.forEach((_, index) => monthOrders.set(index, []));

  mockOrders.forEach(order => {
    const orderDate = new Date(order.timestamp);
    // Skip invalid dates
    if (isNaN(orderDate.getTime())) return;
    
    const monthIndex = orderDate.getMonth();
    const orders = monthOrders.get(monthIndex) || [];
    orders.push(order);
    monthOrders.set(monthIndex, orders);
  });

  // Calculate average revenue (for festival boost calculation)
  const totalRevenue = Array.from(monthOrders.values())
    .reduce((sum, orders) => sum + orders.reduce((orderSum, order) => orderSum + order.grandTotal, 0), 0);
  const avgMonthlyRevenue = totalRevenue / 12;

  // Analyze each month
  monthOrders.forEach((orders, monthIndex) => {
    const month = monthData[monthIndex];
    if (!month) return; // Safety check
    month.totalOrders = orders.length;
    month.totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);

    // Calculate festival boost
    if (FESTIVAL_MONTHS.includes(monthIndex)) {
      month.festivalBoost = avgMonthlyRevenue > 0 
        ? ((month.totalRevenue - avgMonthlyRevenue) / avgMonthlyRevenue) * 100 
        : 0;
    }

    // Find top colors
    const colorCounts: Map<string, number> = new Map();
    orders.forEach(order => {
      order.productsList.forEach(item => {
        const color = item.product.colorName;
        colorCounts.set(color, (colorCounts.get(color) || 0) + item.quantity);
      });
    });

    month.topColors = Array.from(colorCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
  });

  return monthData;
}

// Generate comprehensive behavior heatmap
export function generateBehaviorHeatmap(): BehaviorHeatmapData {
  const timeSlots = analyzeTimeBehavior();
  const daysOfWeek = analyzeDayOfWeekBehavior();
  const seasonal = analyzeSeasonalBehavior();

  // Find peak and slowest times
  const sortedByRevenue = [...timeSlots].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const peakTime = sortedByRevenue[0]?.timeSlot || 'Unknown';
  const slowestTime = sortedByRevenue[sortedByRevenue.length - 1]?.timeSlot || 'Unknown';

  // Find peak and slowest days
  const sortedDaysByRevenue = [...daysOfWeek].sort((a, b) => b.totalRevenue - a.totalRevenue);
  const peakDay = sortedDaysByRevenue[0]?.day || 'Unknown';
  const slowestDay = sortedDaysByRevenue[sortedDaysByRevenue.length - 1]?.day || 'Unknown';

  // Find premium and budget buying times
  const sortedByPremium = [...timeSlots].sort((a, b) => b.customerType.premium - a.customerType.premium);
  const premiumBuyingTime = sortedByPremium[0]?.timeSlot || 'Unknown';

  const sortedByBudget = [...timeSlots].sort((a, b) => b.customerType.budget - a.customerType.budget);
  const budgetBuyingTime = sortedByBudget[0]?.timeSlot || 'Unknown';

  return {
    timeSlots,
    daysOfWeek,
    seasonal,
    insights: {
      peakTime,
      peakDay,
      slowestTime,
      slowestDay,
      premiumBuyingTime,
      budgetBuyingTime
    }
  };
}

// Get heatmap intensity for visualization (0-100)
export function getHeatmapIntensity(value: number, maxValue: number): number {
  if (maxValue === 0) return 0;
  return Math.min(100, (value / maxValue) * 100);
}

// Get color based on intensity
export function getHeatmapColor(intensity: number): string {
  if (intensity >= 80) return 'bg-red-500';
  if (intensity >= 60) return 'bg-orange-500';
  if (intensity >= 40) return 'bg-yellow-500';
  if (intensity >= 20) return 'bg-green-500';
  return 'bg-blue-300';
}
