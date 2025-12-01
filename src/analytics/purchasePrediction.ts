import { Order, Product } from '../types';
import { mockOrders, mockProducts } from '../data/mockData';

export interface ProductAssociation {
  productId: string;
  productName: string;
  colorName: string;
  colorCode: string;
  brand: string;
  coOccurrenceCount: number;
  confidence: number; // Probability (0-1)
  lift: number; // How much more likely than random
  support: number; // How common this association is overall
}

export interface PurchasePrediction {
  currentProduct: Product;
  recommendations: ProductAssociation[];
  totalAnalyzedOrders: number;
  predictionStrength: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak';
}

// Analyze all orders to find product associations (Market Basket Analysis)
export function analyzePurchasePatterns(): Map<string, Map<string, number>> {
  const coOccurrenceMatrix = new Map<string, Map<string, number>>();
  
  // Initialize matrix
  mockProducts.forEach(product => {
    coOccurrenceMatrix.set(product.id, new Map<string, number>());
  });
  
  // Count co-occurrences
  mockOrders.forEach(order => {
    const productIds = order.productsList.map(item => item.product.id);
    
    // For each pair of products in the order
    for (let i = 0; i < productIds.length; i++) {
      for (let j = i + 1; j < productIds.length; j++) {
        const product1 = productIds[i];
        const product2 = productIds[j];
        
        // Increment both directions
        const map1 = coOccurrenceMatrix.get(product1);
        if (map1) {
          map1.set(product2, (map1.get(product2) || 0) + 1);
        }
        
        const map2 = coOccurrenceMatrix.get(product2);
        if (map2) {
          map2.set(product1, (map2.get(product1) || 0) + 1);
        }
      }
    }
  });
  
  return coOccurrenceMatrix;
}

// Calculate support, confidence, and lift for association rules
export function calculateAssociationMetrics(
  productA: string,
  productB: string,
  coOccurrenceMatrix: Map<string, Map<string, number>>
): { confidence: number; lift: number; support: number } {
  const totalOrders = mockOrders.length;
  
  // Count orders containing productA
  const ordersWithA = mockOrders.filter(order =>
    order.productsList.some(item => item.product.id === productA)
  ).length;
  
  // Count orders containing productB
  const ordersWithB = mockOrders.filter(order =>
    order.productsList.some(item => item.product.id === productB)
  ).length;
  
  // Count orders containing both A and B
  const coOccurrence = coOccurrenceMatrix.get(productA)?.get(productB) || 0;
  
  // Calculate metrics
  const support = coOccurrence / totalOrders;
  const confidence = ordersWithA > 0 ? coOccurrence / ordersWithA : 0;
  const expectedCoOccurrence = (ordersWithA * ordersWithB) / totalOrders;
  const lift = expectedCoOccurrence > 0 ? coOccurrence / expectedCoOccurrence : 0;
  
  return { confidence, lift, support };
}

// Predict what customers will buy next based on current product
export function predictNextPurchase(currentProductId: string): PurchasePrediction {
  const currentProduct = mockProducts.find(p => p.id === currentProductId);
  if (!currentProduct) {
    throw new Error('Product not found');
  }
  
  const coOccurrenceMatrix = analyzePurchasePatterns();
  const associations = coOccurrenceMatrix.get(currentProductId);
  
  if (!associations || associations.size === 0) {
    return {
      currentProduct,
      recommendations: [],
      totalAnalyzedOrders: mockOrders.length,
      predictionStrength: 'Weak'
    };
  }
  
  // Build recommendations with metrics
  const recommendations: ProductAssociation[] = [];
  
  associations.forEach((count, productId) => {
    const product = mockProducts.find(p => p.id === productId);
    if (!product) return;
    
    const metrics = calculateAssociationMetrics(
      currentProductId,
      productId,
      coOccurrenceMatrix
    );
    
    // Only include if confidence > 10% (meaningful association)
    if (metrics.confidence > 0.1) {
      recommendations.push({
        productId: product.id,
        productName: product.colorName,
        colorName: product.colorName,
        colorCode: product.colorCode,
        brand: product.brand,
        coOccurrenceCount: count,
        confidence: metrics.confidence,
        lift: metrics.lift,
        support: metrics.support
      });
    }
  });
  
  // Sort by confidence (highest first)
  recommendations.sort((a, b) => b.confidence - a.confidence);
  
  // Determine prediction strength
  let predictionStrength: 'Very Strong' | 'Strong' | 'Moderate' | 'Weak' = 'Weak';
  if (recommendations.length > 0) {
    const maxConfidence = recommendations[0].confidence;
    if (maxConfidence >= 0.7) predictionStrength = 'Very Strong';
    else if (maxConfidence >= 0.5) predictionStrength = 'Strong';
    else if (maxConfidence >= 0.3) predictionStrength = 'Moderate';
  }
  
  return {
    currentProduct,
    recommendations: recommendations.slice(0, 8), // Top 8 recommendations
    totalAnalyzedOrders: mockOrders.length,
    predictionStrength
  };
}

// Predict for multiple products (shopping cart)
export function predictForCart(productIds: string[]): ProductAssociation[] {
  if (productIds.length === 0) return [];
  
  const allRecommendations = new Map<string, ProductAssociation>();
  
  // Get predictions for each product in cart
  productIds.forEach(productId => {
    const prediction = predictNextPurchase(productId);
    
    // Aggregate recommendations
    prediction.recommendations.forEach(rec => {
      if (!productIds.includes(rec.productId)) { // Don't recommend what's already in cart
        const existing = allRecommendations.get(rec.productId);
        
        if (existing) {
          // Increase confidence if multiple products suggest this
          existing.confidence = Math.min(
            1.0,
            existing.confidence + rec.confidence * 0.3
          );
          existing.coOccurrenceCount += rec.coOccurrenceCount;
        } else {
          allRecommendations.set(rec.productId, { ...rec });
        }
      }
    });
  });
  
  // Sort by aggregated confidence
  return Array.from(allRecommendations.values())
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 6);
}

// Get frequently bought together bundles
export function getFrequentBundles(minSupport: number = 0.05): Array<{
  products: Product[];
  frequency: number;
  totalRevenue: number;
}> {
  const bundles = new Map<string, { productIds: string[]; count: number }>();
  
  // Find product pairs that appear together frequently
  mockOrders.forEach(order => {
    if (order.productsList.length >= 2) {
      const productIds = order.productsList.map(item => item.product.id).sort();
      
      // Create combinations of 2 products
      for (let i = 0; i < productIds.length; i++) {
        for (let j = i + 1; j < productIds.length; j++) {
          const bundleKey = `${productIds[i]}_${productIds[j]}`;
          const existing = bundles.get(bundleKey);
          
          if (existing) {
            existing.count++;
          } else {
            bundles.set(bundleKey, {
              productIds: [productIds[i], productIds[j]],
              count: 1
            });
          }
        }
      }
    }
  });
  
  // Filter by minimum support
  const minCount = mockOrders.length * minSupport;
  const frequentBundles: Array<{
    products: Product[];
    frequency: number;
    totalRevenue: number;
  }> = [];
  
  bundles.forEach((bundle, key) => {
    if (bundle.count >= minCount) {
      const products = bundle.productIds
        .map(id => mockProducts.find(p => p.id === id))
        .filter(p => p !== undefined) as Product[];
      
      if (products.length === 2) {
        const totalRevenue = products.reduce((sum, p) => sum + p.price, 0);
        
        frequentBundles.push({
          products,
          frequency: bundle.count,
          totalRevenue
        });
      }
    }
  });
  
  // Sort by frequency
  return frequentBundles.sort((a, b) => b.frequency - a.frequency).slice(0, 10);
}

// Get top products by brand affinity
export function getBrandAffinityRecommendations(currentBrand: string): Product[] {
  // Find customers who bought this brand
  const brandCustomers = new Set<string>();
  
  mockOrders.forEach(order => {
    const hasBrand = order.productsList.some(item => item.product.brand === currentBrand);
    if (hasBrand && order.customerName) {
      brandCustomers.add(order.customerName);
    }
  });
  
  // Find what else these customers bought
  const otherProducts = new Map<string, number>();
  
  mockOrders.forEach(order => {
    if (order.customerName && brandCustomers.has(order.customerName)) {
      order.productsList.forEach(item => {
        if (item.product.brand !== currentBrand) {
          const count = otherProducts.get(item.product.id) || 0;
          otherProducts.set(item.product.id, count + 1);
        }
      });
    }
  });
  
  // Get top products
  return Array.from(otherProducts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([productId]) => mockProducts.find(p => p.id === productId))
    .filter(p => p !== undefined) as Product[];
}

// Get insights summary
export function getPredictionInsights(): {
  totalPatterns: number;
  strongAssociations: number;
  averageConfidence: number;
  topBundle: { products: Product[]; frequency: number } | null;
} {
  const coOccurrenceMatrix = analyzePurchasePatterns();
  let totalPatterns = 0;
  let strongAssociations = 0;
  let totalConfidence = 0;
  let confidenceCount = 0;
  
  coOccurrenceMatrix.forEach((associations, productId) => {
    associations.forEach((count, associatedId) => {
      totalPatterns++;
      const metrics = calculateAssociationMetrics(productId, associatedId, coOccurrenceMatrix);
      
      if (metrics.confidence > 0.5) {
        strongAssociations++;
      }
      
      if (metrics.confidence > 0.1) {
        totalConfidence += metrics.confidence;
        confidenceCount++;
      }
    });
  });
  
  const bundles = getFrequentBundles(0.05);
  
  return {
    totalPatterns: totalPatterns / 2, // Divide by 2 because we count each pair twice
    strongAssociations: strongAssociations / 2,
    averageConfidence: confidenceCount > 0 ? totalConfidence / confidenceCount : 0,
    topBundle: bundles.length > 0 ? bundles[0] : null
  };
}
