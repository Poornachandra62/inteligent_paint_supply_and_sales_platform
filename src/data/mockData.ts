import { Product, Order, Shop } from '../types';
import { indianCities, cityShops } from './cityData';
import { convertKaggleProducts, getBengaluruShops, convertKaggleSales } from './kaggleDataConverter';

// Generate city-specific products
const generateCityProducts = (): Product[] => {
  const products: Product[] = [];
  let productId = 1;

  indianCities.forEach(city => {
    // Add popular colors for each city
    city.popularColors.forEach((colorName, index) => {
      const qualities: ('Premium' | 'Standard' | 'Economy')[] = ['Premium', 'Standard', 'Economy'];
      const textures: ('Matte' | 'Gloss' | 'Satin' | 'Semi-Gloss')[] = ['Matte', 'Gloss', 'Satin', 'Semi-Gloss'];
      const brands = ['Asian Paints', 'Berger Paints', 'Nerolac', 'Dulux', 'Kansai'];
      
      qualities.forEach(quality => {
        const priceRange = city.priceRange[quality.toLowerCase() as keyof typeof city.priceRange];
        const price = Math.floor(Math.random() * (priceRange.max - priceRange.min) + priceRange.min);
        
        products.push({
          id: `P${String(productId).padStart(3, '0')}`,
          colorName: colorName,
          colorCode: getColorCode(colorName),
          manufacturedDate: '2024-01-15',
          expiryDate: '2026-01-15',
          price: price,
          quality: quality,
          quantity: Math.floor(Math.random() * 200) + 50,
          texture: textures[Math.floor(Math.random() * textures.length)],
          batch: `B2024-${String(productId).padStart(3, '0')}`,
          plant: `${city.name} Plant`,
          brand: brands[Math.floor(Math.random() * brands.length)]
        });
        productId++;
      });
    });
  });
  
  return products;
};

// Helper function to get color codes
const getColorCode = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Ocean Blue': '#0077BE',
    'Forest Green': '#228B22',
    'Pure White': '#FFFFFF',
    'Cream White': '#F5F5DC',
    'Light Grey': '#D3D3D3',
    'Cool Blue': '#87CEEB',
    'Mint Green': '#98FB98',
    'Ice White': '#F0F8FF',
    'Cool White': '#F8F8FF',
    'Sea Blue': '#006994',
    'Palm Green': '#32CD32',
    'Coral Pink': '#FF7F50',
    'Sandy Beige': '#F5F5DC',
    'Marine Blue': '#003f7f',
    'Monsoon Grey': '#708090',
    'Urban White': '#FAFAFA',
    'Metro Silver': '#C0C0C0',
    'Coastal Green': '#2E8B57',
    'Desert Beige': '#EDC9AF',
    'Royal Blue': '#4169E1',
    'Pearl White': '#F8F6F0',
    'Sandstone Brown': '#D2B48C',
    'Royal Purple': '#663399',
    'Sunset Orange': '#FF6B35'
  };
  return colorMap[colorName] || '#000000';
};

// Use real Kaggle data for Bengaluru
export const mockProducts: Product[] = convertKaggleProducts();

// Generate city-specific shops
const generateCityShops = (): Shop[] => {
  const shops: Shop[] = [];
  
  Object.entries(cityShops).forEach(([cityId, cityShopList]) => {
    const city = indianCities.find(c => c.id === cityId);
    if (!city) return;
    
    cityShopList.forEach((shop, index) => {
      shops.push({
        id: shop.id,
        name: shop.name,
        address: `${shop.area}, ${city.name}, ${city.state}`,
        phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        ownerId: `owner-${shop.id}`,
        city: city.name
      });
    });
  });
  
  return shops;
};

// Use real Bengaluru shops based on Kaggle survey data
export const mockShops: Shop[] = getBengaluruShops();

// Update original mock products (keeping for backward compatibility)
export const originalMockProducts: Product[] = [
  {
    id: 'P001',
    colorName: 'Ocean Blue',
    colorCode: '#0077BE',
    manufacturedDate: '2024-01-15',
    expiryDate: '2026-01-15',
    price: 3799.99,
    quality: 'Premium',
    quantity: 150,
    texture: 'Matte',
    batch: 'B2024-001',
    plant: 'Plant A',
    brand: 'AquaShield'
  },
  {
    id: 'P002',
    colorName: 'Sunset Orange',
    colorCode: '#FF6B35',
    manufacturedDate: '2024-02-01',
    expiryDate: '2026-02-01',
    price: 3499.50,
    quality: 'Standard',
    quantity: 200,
    texture: 'Gloss',
    batch: 'B2024-002',
    plant: 'Plant B',
    brand: 'ColorMax'
  },
  {
    id: 'P003',
    colorName: 'Forest Green',
    colorCode: '#228B22',
    manufacturedDate: '2024-01-20',
    expiryDate: '2026-01-20',
    price: 4025.75,
    quality: 'Premium',
    quantity: 120,
    texture: 'Satin',
    batch: 'B2024-003',
    plant: 'Plant A',
    brand: 'NaturePaint'
  },
  {
    id: 'P004',
    colorName: 'Pure White',
    colorCode: '#FFFFFF',
    manufacturedDate: '2024-02-10',
    expiryDate: '2026-02-10',
    price: 2899.00,
    quality: 'Economy',
    quantity: 300,
    texture: 'Matte',
    batch: 'B2024-004',
    plant: 'Plant C',
    brand: 'BasicCoat'
  },
  {
    id: 'P005',
    colorName: 'Royal Purple',
    colorCode: '#663399',
    manufacturedDate: '2024-01-25',
    expiryDate: '2026-01-25',
    price: 4315.25,
    quality: 'Premium',
    quantity: 80,
    texture: 'Semi-Gloss',
    batch: 'B2024-005',
    plant: 'Plant A',
    brand: 'LuxuryTone'
  }
];

// Use real Kaggle sales data for orders
export const mockOrders: Order[] = convertKaggleSales(mockProducts, mockShops);