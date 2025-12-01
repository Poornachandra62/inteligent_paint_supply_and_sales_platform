// Converter to transform Kaggle data to our TypeScript interfaces
import { Product, Shop, Order } from '../types';
import kaggleData from './bengaluruKaggleData.json';

// Color code mapping
const colorCodeMap: { [key: string]: string } = {
  'White': '#FFFFFF',
  'Red': '#FF0000',
  'Oak Brown': '#8B4513',
  'Silver': '#C0C0C0',
  'Light Grey': '#D3D3D3',
  'Beige': '#F5F5DC',
  'Dark Blue': '#00008B',
  'Walnut': '#5C4033',
  'Teal': '#008080',
  'Charcoal': '#36454F',
  'Blue': '#0000FF',
  'Cream': '#FFFDD0',
  'Green': '#008000',
  'Yellow': '#FFFF00',
  'Olive': '#808000',
  'Ivory': '#FFFFF0',
  'Ocean Blue': '#0077BE',
  'Forest Green': '#228B22',
  'Pure White': '#FFFFFF',
  'Cream White': '#F5F5DC',
};

// Get color code with fallback
const getColorCode = (color: string | null): string => {
  if (!color) return '#000000';
  return colorCodeMap[color] || '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
};

// Convert Kaggle products to our Product interface
export const convertKaggleProducts = (): Product[] => {
  const brands = kaggleData.survey_summary.top_brands.map(b => b.name);
  
  return kaggleData.products.map((kaggleProduct, index) => {
    const quality = kaggleProduct['MRP per unit'] > 500 ? 'Premium' : 
                   kaggleProduct['MRP per unit'] > 200 ? 'Standard' : 'Economy';
    
    const finishMap: { [key: string]: 'Matte' | 'Gloss' | 'Satin' | 'Semi-Gloss' } = {
      'Matte': 'Matte',
      'Glossy': 'Gloss',
      'Gloss': 'Gloss',
      'Satin': 'Satin',
      'Semi-Gloss': 'Semi-Gloss',
      'Eggshell': 'Satin'
    };
    
    const texture = finishMap[kaggleProduct.Finish] || 'Matte';
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    return {
      id: kaggleProduct['Product ID'],
      colorName: kaggleProduct.Color || 'Unknown Color',
      colorCode: getColorCode(kaggleProduct.Color),
      manufacturedDate: '2024-01-15',
      expiryDate: '2026-01-15',
      price: kaggleProduct['MRP per unit'],
      quality: quality,
      quantity: Math.floor(Math.random() * 200) + 50,
      texture: texture,
      batch: `B2024-${String(index + 1).padStart(3, '0')}`,
      plant: 'Bengaluru Plant',
      brand: brand
    };
  });
};

// Generate Bengaluru shops based on survey data
export const getBengaluruShops = (): Shop[] => {
  return [
    {
      id: 'BLR001',
      name: 'Asian Paints Showroom - Koramangala',
      address: 'Koramangala 5th Block, Bengaluru, Karnataka',
      phone: '+91-9876543210',
      ownerId: 'owner-BLR001',
      city: 'Bengaluru'
    },
    {
      id: 'BLR002',
      name: 'Berger Paints Exclusive - Indiranagar',
      address: '100 Feet Road, Indiranagar, Bengaluru, Karnataka',
      phone: '+91-9876543211',
      ownerId: 'owner-BLR002',
      city: 'Bengaluru'
    },
    {
      id: 'BLR003',
      name: 'Birla Paints Center - Whitefield',
      address: 'ITPL Main Road, Whitefield, Bengaluru, Karnataka',
      phone: '+91-9876543212',
      ownerId: 'owner-BLR003',
      city: 'Bengaluru'
    },
    {
      id: 'BLR004',
      name: 'Nippon Paints Gallery - Jayanagar',
      address: '4th Block, Jayanagar, Bengaluru, Karnataka',
      phone: '+91-9876543213',
      ownerId: 'owner-BLR004',
      city: 'Bengaluru'
    },
    {
      id: 'BLR005',
      name: 'Paint World - HSR Layout',
      address: 'Sector 1, HSR Layout, Bengaluru, Karnataka',
      phone: '+91-9876543214',
      ownerId: 'owner-BLR005',
      city: 'Bengaluru'
    },
    {
      id: 'BLR006',
      name: 'Color Galaxy - Malleshwaram',
      address: '8th Cross, Malleshwaram, Bengaluru, Karnataka',
      phone: '+91-9876543215',
      ownerId: 'owner-BLR006',
      city: 'Bengaluru'
    }
  ];
};

// Generate sample orders from Kaggle sales data
export const convertKaggleSales = (products: Product[], shops: Shop[]): Order[] => {
  const orders: Order[] = [];
  
  kaggleData.sales.slice(0, 50).forEach((sale, index) => {
    const product = products.find(p => p.id === sale.ProductID) || products[0];
    const shop = shops[Math.floor(Math.random() * shops.length)];
    const quantity = sale['Units Sold'];
    const discount = sale.Discount || 0;
    const subtotal = sale['selling price'];
    const tax = subtotal * 0.18; // 18% GST
    const grandTotal = subtotal + tax;
    
    orders.push({
      id: sale['Sales ID'],
      productsList: [{
        product: product,
        quantity: quantity,
        subtotal: subtotal
      }],
      total: subtotal,
      tax: tax,
      saleTax: tax,
      grandTotal: grandTotal,
      paymentMethod: Math.random() > 0.5 ? 'online' : 'cash',
      customerName: kaggleData.customers[index % kaggleData.customers.length]?.['Customer Name'] || 'Walk-in Customer',
      customerPhone: '+91-9' + Math.floor(Math.random() * 900000000 + 100000000),
      timestamp: sale['Date ID'] + 'T10:00:00Z',
      salespersonId: `SP${Math.floor(Math.random() * 10) + 1}`,
      shopId: shop.id
    });
  });
  
  return orders;
};

// Export survey insights
export const getSurveyInsights = () => {
  return {
    totalResponses: kaggleData.survey_summary.total_responses,
    city: kaggleData.survey_summary.city,
    dateRange: kaggleData.survey_summary.date_range,
    topBrands: kaggleData.survey_summary.top_brands,
    insights: {
      mostPreferredBrand: kaggleData.survey_summary.top_brands[0]?.name || 'Asian Paints',
      competitionLevel: 'High',
      marketShare: {
        'Asian Paints': 27.2,
        'Berger Paints': 24.8,
        'Birla Paints': 20.5,
        'Nippon Paints': 18.4,
        'Others': 9.1
      }
    }
  };
};

