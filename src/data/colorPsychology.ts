import { Product } from '../types';

export interface ColorPsychologyData {
  roomType: string;
  icon: string;
  recommendedColors: {
    colorName: string;
    colorCode: string;
    psychologyFacts: string[];
    moodImpact: string;
    bestFor: string[];
    season: string[];
    scientificBacking: string;
  }[];
}

export const colorPsychologyDatabase: ColorPsychologyData[] = [
  {
    roomType: 'Bedroom',
    icon: '🛏️',
    recommendedColors: [
      {
        colorName: 'Lavender',
        colorCode: '#E6E6FA',
        psychologyFacts: [
          'Reduces stress levels by 40%',
          'Promotes relaxation and calm',
          'Improves sleep quality significantly',
          'Associated with peace and tranquility'
        ],
        moodImpact: 'Calming & Peaceful',
        bestFor: ['Stress relief', 'Better sleep', 'Meditation spaces', 'Relaxation'],
        season: ['All seasons', 'Especially calming in summer'],
        scientificBacking: 'Studies show lavender reduces cortisol (stress hormone) levels'
      },
      {
        colorName: 'Light Blue',
        colorCode: '#ADD8E6',
        psychologyFacts: [
          'Lowers blood pressure naturally',
          'Creates sense of tranquility',
          'Reduces anxiety by 30%',
          'Promotes restful sleep'
        ],
        moodImpact: 'Serene & Restful',
        bestFor: ['Deep sleep', 'Relaxation', 'Focus', 'Peace of mind'],
        season: ['Summer', 'Monsoon'],
        scientificBacking: 'Blue light wavelengths slow heart rate and reduce blood pressure'
      },
      {
        colorName: 'Soft Green',
        colorCode: '#90EE90',
        psychologyFacts: [
          'Connects with nature and growth',
          'Refreshes the mind',
          'Balances emotions',
          'Easiest color on the eyes'
        ],
        moodImpact: 'Refreshing & Balanced',
        bestFor: ['Harmony', 'Renewal', 'Balance', 'Eye comfort'],
        season: ['Spring', 'Monsoon', 'All seasons'],
        scientificBacking: 'Green is processed by the eye with minimal strain'
      }
    ]
  },
  {
    roomType: 'Living Room',
    icon: '🛋️',
    recommendedColors: [
      {
        colorName: 'Warm Beige',
        colorCode: '#F5F5DC',
        psychologyFacts: [
          'Creates welcoming atmosphere',
          'Encourages conversation and bonding',
          'Feels cozy and inviting',
          'Neutral backdrop for decor'
        ],
        moodImpact: 'Warm & Inviting',
        bestFor: ['Social gatherings', 'Family time', 'Comfort', 'Entertaining'],
        season: ['Winter', 'Festival season'],
        scientificBacking: 'Warm neutrals increase feelings of comfort and safety'
      },
      {
        colorName: 'Light Grey',
        colorCode: '#D3D3D3',
        psychologyFacts: [
          'Modern and sophisticated',
          'Versatile neutral backdrop',
          'Promotes clarity and calm',
          'Makes space feel larger'
        ],
        moodImpact: 'Elegant & Modern',
        bestFor: ['Contemporary style', 'Versatility', 'Elegance', 'Spaciousness'],
        season: ['All seasons', 'Trending year-round'],
        scientificBacking: 'Grey reduces visual stimulation, promoting focus'
      },
      {
        colorName: 'Terracotta',
        colorCode: '#E2725B',
        psychologyFacts: [
          'Earthy and grounding',
          'Creates energetic ambiance',
          'Encourages lively conversation',
          'Traditional Indian aesthetic'
        ],
        moodImpact: 'Energetic & Grounded',
        bestFor: ['Cultural gatherings', 'Festive occasions', 'Warmth', 'Energy'],
        season: ['Festival season', 'Winter'],
        scientificBacking: 'Warm colors increase heart rate and energy levels'
      }
    ]
  },
  {
    roomType: 'Kitchen',
    icon: '🍳',
    recommendedColors: [
      {
        colorName: 'Yellow',
        colorCode: '#FFD700',
        psychologyFacts: [
          'Increases appetite by 15%',
          'Creates cheerful atmosphere',
          'Stimulates conversation and activity',
          'Energizes morning routines'
        ],
        moodImpact: 'Energetic & Cheerful',
        bestFor: ['Morning energy', 'Family meals', 'Happiness', 'Activity'],
        season: ['Winter', 'Monsoon (brightens dark days)'],
        scientificBacking: 'Yellow stimulates the nervous system, increasing appetite'
      },
      {
        colorName: 'White',
        colorCode: '#FFFFFF',
        psychologyFacts: [
          'Signifies cleanliness and hygiene',
          'Makes space feel 30% larger',
          'Reflects light beautifully',
          'Classic and timeless'
        ],
        moodImpact: 'Clean & Spacious',
        bestFor: ['Hygiene perception', 'Brightness', 'Simplicity', 'Small spaces'],
        season: ['All seasons', 'Essential for kitchens'],
        scientificBacking: 'White reflects 80% of light, creating bright, clean environment'
      },
      {
        colorName: 'Sage Green',
        colorCode: '#9CAF88',
        psychologyFacts: [
          'Fresh and natural feel',
          'Reduces stress while cooking',
          'Associated with health and vitality',
          'Trending modern kitchen color'
        ],
        moodImpact: 'Fresh & Healthy',
        bestFor: ['Healthy eating', 'Calm cooking', 'Modern style', 'Nature connection'],
        season: ['Spring', 'Summer', 'All seasons'],
        scientificBacking: 'Green tones promote healthy eating choices'
      }
    ]
  },
  {
    roomType: 'Office/Study',
    icon: '💼',
    recommendedColors: [
      {
        colorName: 'Blue',
        colorCode: '#4169E1',
        psychologyFacts: [
          'Enhances productivity by 25%',
          'Improves focus and concentration',
          'Stimulates mental clarity',
          'Most preferred color for workspaces'
        ],
        moodImpact: 'Focused & Productive',
        bestFor: ['Work efficiency', 'Deep thinking', 'Creativity', 'Problem-solving'],
        season: ['All seasons', 'Peak productivity color'],
        scientificBacking: 'Blue increases cognitive performance and analytical thinking'
      },
      {
        colorName: 'Green',
        colorCode: '#228B22',
        psychologyFacts: [
          'Reduces eye strain by 40%',
          'Increases creativity',
          'Promotes balance and harmony',
          'Refreshes during long work hours'
        ],
        moodImpact: 'Balanced & Creative',
        bestFor: ['Long work hours', 'Innovation', 'Concentration', 'Eye comfort'],
        season: ['All seasons', 'Especially good for extended screen time'],
        scientificBacking: 'Green wavelengths require minimal eye adjustment'
      },
      {
        colorName: 'Light Yellow',
        colorCode: '#FFFFE0',
        psychologyFacts: [
          'Boosts optimism and positivity',
          'Encourages creative thinking',
          'Increases motivation',
          'Prevents afternoon energy slumps'
        ],
        moodImpact: 'Optimistic & Motivated',
        bestFor: ['Creative work', 'Brainstorming', 'Motivation', 'Energy'],
        season: ['Winter', 'Monsoon'],
        scientificBacking: 'Yellow stimulates the left brain (logic) and right brain (creativity)'
      }
    ]
  },
  {
    roomType: 'Bathroom',
    icon: '🚿',
    recommendedColors: [
      {
        colorName: 'Aqua Blue',
        colorCode: '#7FFFD4',
        psychologyFacts: [
          'Creates spa-like atmosphere',
          'Feels fresh and clean',
          'Associated with water and purity',
          'Promotes relaxation during baths'
        ],
        moodImpact: 'Fresh & Rejuvenating',
        bestFor: ['Relaxation', 'Cleanliness', 'Serenity', 'Spa feeling'],
        season: ['Summer', 'Hot climate'],
        scientificBacking: 'Blue-green tones mimic natural water, triggering calm response'
      },
      {
        colorName: 'White',
        colorCode: '#FFFFFF',
        psychologyFacts: [
          'Maximizes light reflection',
          'Makes small bathrooms feel 40% larger',
          'Timeless and hygienic',
          'Universal bathroom choice'
        ],
        moodImpact: 'Pure & Spacious',
        bestFor: ['Brightness', 'Cleanliness', 'Simplicity', 'Small spaces'],
        season: ['All seasons', 'Bathroom standard'],
        scientificBacking: 'White creates perception of cleanliness and sterility'
      },
      {
        colorName: 'Soft Pink',
        colorCode: '#FFB6C1',
        psychologyFacts: [
          'Gentle and soothing',
          'Creates calming effect',
          'Associated with self-care',
          'Flattering in mirror lighting'
        ],
        moodImpact: 'Soothing & Gentle',
        bestFor: ['Self-care', 'Relaxation', 'Gentle ambiance', 'Calming'],
        season: ['All seasons'],
        scientificBacking: 'Pink reduces aggression and promotes tranquility'
      }
    ]
  },
  {
    roomType: 'Dining Room',
    icon: '🍽️',
    recommendedColors: [
      {
        colorName: 'Red',
        colorCode: '#DC143C',
        psychologyFacts: [
          'Increases appetite significantly',
          'Creates energetic dining atmosphere',
          'Encourages conversation',
          'Associated with passion and warmth'
        ],
        moodImpact: 'Stimulating & Social',
        bestFor: ['Dinner parties', 'Social eating', 'Appetite', 'Energy'],
        season: ['Festival season', 'Winter'],
        scientificBacking: 'Red increases metabolism and stimulates hunger'
      },
      {
        colorName: 'Orange',
        colorCode: '#FF8C00',
        psychologyFacts: [
          'Promotes happiness and enthusiasm',
          'Encourages social interaction',
          'Creates warm, inviting space',
          'Stimulates appetite moderately'
        ],
        moodImpact: 'Warm & Social',
        bestFor: ['Family meals', 'Social gatherings', 'Warmth', 'Joy'],
        season: ['Festival season', 'Autumn'],
        scientificBacking: 'Orange combines red\'s energy with yellow\'s happiness'
      }
    ]
  },
  {
    roomType: 'Children\'s Room',
    icon: '🎨',
    recommendedColors: [
      {
        colorName: 'Sky Blue',
        colorCode: '#87CEEB',
        psychologyFacts: [
          'Calms hyperactive children',
          'Promotes peaceful sleep',
          'Encourages creativity',
          'Gender-neutral option'
        ],
        moodImpact: 'Calming & Creative',
        bestFor: ['Better sleep', 'Calm play', 'Focus', 'Study'],
        season: ['All seasons'],
        scientificBacking: 'Blue reduces behavioral issues in children by 20%'
      },
      {
        colorName: 'Soft Yellow',
        colorCode: '#FFFACD',
        psychologyFacts: [
          'Boosts energy and happiness',
          'Stimulates learning and memory',
          'Creates cheerful environment',
          'Promotes optimism'
        ],
        moodImpact: 'Happy & Energetic',
        bestFor: ['Play time', 'Learning', 'Creativity', 'Happiness'],
        season: ['All seasons', 'Especially winter'],
        scientificBacking: 'Yellow enhances concentration and memory in young minds'
      },
      {
        colorName: 'Mint Green',
        colorCode: '#98FF98',
        psychologyFacts: [
          'Balances energy levels',
          'Promotes growth and learning',
          'Reduces anxiety',
          'Fresh and modern'
        ],
        moodImpact: 'Balanced & Fresh',
        bestFor: ['Study corner', 'Calm play', 'Balance', 'Growth'],
        season: ['Spring', 'Summer', 'All seasons'],
        scientificBacking: 'Green promotes concentration and reduces test anxiety'
      }
    ]
  }
];

// Seasonal recommendations for Bengaluru
export const seasonalColorRecommendations = {
  summer: {
    name: 'Summer Collection',
    months: ['March', 'April', 'May'],
    colors: ['Light Blue', 'Aqua Blue', 'Mint Green', 'White', 'Lavender'],
    reason: 'Cool colors reduce perceived temperature by 2-3°C'
  },
  monsoon: {
    name: 'Monsoon Collection',
    months: ['June', 'July', 'August', 'September'],
    colors: ['Yellow', 'Soft Yellow', 'Orange', 'Warm Beige'],
    reason: 'Bright colors compensate for cloudy days and low light'
  },
  winter: {
    name: 'Winter Collection',
    months: ['December', 'January', 'February'],
    colors: ['Terracotta', 'Red', 'Warm Beige', 'Orange'],
    reason: 'Warm colors increase perceived temperature and coziness'
  },
  festival: {
    name: 'Festival Season',
    festivals: ['Diwali', 'Holi', 'Ganesh Chaturthi'],
    colors: ['Gold', 'Red', 'Orange', 'Yellow', 'Bright colors'],
    reason: 'Vibrant colors enhance festive atmosphere and cultural celebrations'
  }
};

// Match psychology recommendations to actual inventory
export function matchToInventory(
  psychologyColor: { colorName: string; colorCode: string },
  inventory: Product[]
): Product[] {
  const colorName = psychologyColor.colorName.toLowerCase();
  
  // Find exact or close matches
  const matches = inventory.filter(product => {
    const productColor = product.colorName.toLowerCase();
    
    // Exact match
    if (productColor.includes(colorName)) return true;
    
    // Color similarity based on RGB distance
    const distance = colorDistance(product.colorCode, psychologyColor.colorCode);
    return distance < 80; // Threshold for similar colors
  });
  
  // Sort by relevance (exact matches first, then by price quality)
  return matches
    .sort((a, b) => {
      const aExact = a.colorName.toLowerCase().includes(colorName) ? 1 : 0;
      const bExact = b.colorName.toLowerCase().includes(colorName) ? 1 : 0;
      if (aExact !== bExact) return bExact - aExact;
      
      // Then by quality
      const qualityOrder = { Premium: 3, Standard: 2, Economy: 1 };
      return qualityOrder[b.quality] - qualityOrder[a.quality];
    })
    .slice(0, 6); // Return top 6 matches
}

// Calculate color distance (RGB Euclidean distance)
function colorDistance(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
    Math.pow(rgb1.g - rgb2.g, 2) +
    Math.pow(rgb1.b - rgb2.b, 2)
  );
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Get current season for Bengaluru
export function getCurrentSeason(): string {
  const month = new Date().getMonth(); // 0-11
  
  if (month >= 2 && month <= 4) return 'summer'; // Mar-May
  if (month >= 5 && month <= 8) return 'monsoon'; // Jun-Sep
  if (month >= 11 || month <= 1) return 'winter'; // Dec-Feb
  
  return 'all'; // Oct-Nov transition
}

// Get seasonal color suggestions
export function getSeasonalSuggestions(): string[] {
  const season = getCurrentSeason();
  
  switch (season) {
    case 'summer':
      return seasonalColorRecommendations.summer.colors;
    case 'monsoon':
      return seasonalColorRecommendations.monsoon.colors;
    case 'winter':
      return seasonalColorRecommendations.winter.colors;
    default:
      return ['White', 'Light Grey', 'Beige']; // Neutral all-season
  }
}
