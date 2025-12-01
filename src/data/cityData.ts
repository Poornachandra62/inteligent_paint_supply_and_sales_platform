// City-specific data for Indian paint business
export interface CityInfo {
  id: string;
  name: string;
  state: string;
  population: number;
  marketSize: string;
  averageIncome: string;
  weatherPattern: string;
  popularColors: string[];
  seasonalDemand: {
    summer: string[];
    monsoon: string[];
    winter: string[];
    festival: string[];
  };
  competitorDensity: 'High' | 'Medium' | 'Low';
  priceRange: {
    economy: { min: number; max: number };
    standard: { min: number; max: number };
    premium: { min: number; max: number };
  };
}

// BENGALURU ONLY - Based on real Kaggle survey data
export const indianCities: CityInfo[] = [
  {
    id: 'bengaluru',
    name: 'Bengaluru',
    state: 'Karnataka',
    population: 12500000,
    marketSize: '₹2,500 Cr',
    averageIncome: '₹8.5 LPA',
    weatherPattern: 'Pleasant year-round',
    popularColors: ['White', 'Light Grey', 'Beige', 'Ocean Blue', 'Forest Green'],
    seasonalDemand: {
      summer: ['Cool Blue', 'Mint Green', 'Ice White'],
      monsoon: ['Waterproof White', 'Anti-fungal Green', 'Moisture Resistant Blue'],
      winter: ['Warm Beige', 'Cozy Brown', 'Elegant Grey'],
      festival: ['Royal Gold', 'Festival Red', 'Prosperity Green', 'Divine Yellow']
    },
    competitorDensity: 'High',
    priceRange: {
      economy: { min: 100, max: 300 },
      standard: { min: 300, max: 800 },
      premium: { min: 800, max: 2000 }
    }
  }
];

// City-specific shop data - BENGALURU ONLY
export const cityShops = {
  bengaluru: [
    { id: 'BLR001', name: 'Asian Paints Showroom', area: 'Koramangala', type: 'Premium' },
    { id: 'BLR002', name: 'Berger Paints Exclusive', area: 'Indiranagar', type: 'Premium' },
    { id: 'BLR003', name: 'Birla Paints Center', area: 'Whitefield', type: 'Standard' },
    { id: 'BLR004', name: 'Nippon Paints Gallery', area: 'Jayanagar', type: 'Premium' },
    { id: 'BLR005', name: 'Paint World', area: 'HSR Layout', type: 'Standard' },
    { id: 'BLR006', name: 'Color Galaxy', area: 'Malleshwaram', type: 'Economy' }
  ]
};

// Market insights - BENGALURU ONLY (Based on Kaggle survey data)
export const marketInsights = {
  bengaluru: {
    growthRate: '12%',
    topBrands: ['Asian Paints', 'Berger Paints', 'Birla Paints', 'Nippon Paints'],
    marketTrends: ['Eco-friendly paints', 'Durability focus', 'Wide color variety', 'Value for money'],
    challenges: ['High competition', 'Premium pricing pressure', 'Brand loyalty'],
    opportunities: ['IT sector growth', 'Premium housing demand', 'Eco-conscious consumers'],
    surveyInsights: {
      totalResponses: 1000,
      preferredFactors: ['Price', 'Durability', 'Brand Reputation', 'Eco-friendliness', 'Color Variety'],
      brandPreferences: {
        'Asian Paints': 272,
        'Berger Paints': 248,
        'Birla Paints': 205,
        'Nippon Paints': 184
      }
    }
  }
};