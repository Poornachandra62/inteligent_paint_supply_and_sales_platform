import React, { useState } from 'react';
import { 
  Building, 
  TrendingUp, 
  MapPin, 
  BarChart3,
  Store,
  Package,
  Users,
  Filter,
  Calendar,
  Brain
} from 'lucide-react';
import { mockShops, mockProducts, mockOrders } from '../../data/mockData';
import { indianCities, marketInsights } from '../../data/cityData';
import CityAnalyticsChart from '../charts/CityAnalyticsChart';
import SalesChart from '../charts/SalesChart';
import Dashboard3D from '../charts/Dashboard3D';
import DistributorAIAdvisor from '../distributor/DistributorAIAdvisor';
import AIChatAssistant from '../shared/AIChatAssistant';
import ColorPhotoMatch from '../shared/ColorPhotoMatch';

const DistributorDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'analytics' | 'ai-advisor'>('analytics');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate city-based predictions
  const generateCityPredictions = () => {
    return indianCities.map(city => {
      const popularColor = city.popularColors[0];
      const baseQuantity = Math.floor(Math.random() * 300) + 200;
      const trendPercentage = Math.floor(Math.random() * 25) + 5;
      
      return {
        city: city.name,
        color: popularColor,
        predictedSales: baseQuantity,
        trend: `+${trendPercentage}%`,
        marketSize: city.marketSize,
        growth: marketInsights[city.id as keyof typeof marketInsights]?.growthRate || '10%'
      };
    });
  };

  const cityPredictions = generateCityPredictions();

  // Filter shops by selected city (Bengaluru only)
  const filteredShops = mockShops.filter(shop => shop.city === 'Bengaluru');

  const shopStats = filteredShops.map(shop => ({
    ...shop,
    totalSales: Math.floor(Math.random() * 500000) + 100000,
    ordersCount: Math.floor(Math.random() * 50) + 10,
    lowStock: Math.floor(Math.random() * 15) + 2
  }));

  const getColorCode = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Red': '#ef4444',
      'Blue': '#3b82f6',
      'Green': '#10b981',
      'Yellow': '#f59e0b',
      'Purple': '#8b5cf6',
      'Orange': '#f97316',
      'Pink': '#ec4899',
      'Black': '#1f2937',
      'White': '#f9fafb',
      'Gray': '#6b7280'
    };
    return colorMap[color] || '#6b7280';
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-green-50 min-h-screen p-6 -m-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Distributor Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Bengaluru Paint Market Analytics & Predictions</p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setActiveView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeView === 'analytics'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setActiveView('ai-advisor')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeView === 'ai-advisor'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              🤖 AI Advisor
            </button>
          </div>
        </div>
        
        {/* City and Time Filters */}
        <div className="flex items-center space-x-4">
          <div className="border border-green-300 bg-green-50 rounded-lg px-4 py-2 flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-semibold">Bengaluru</span>
          </div>
          
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({length: 12}, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2024, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* AI Advisor View */}
      {activeView === 'ai-advisor' ? (
        <DistributorAIAdvisor />
      ) : (
        <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Shops in Bengaluru
              </p>
              <p className="text-3xl font-bold text-gray-900">{filteredShops.length}</p>
            </div>
            <Store className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Products</p>
              <p className="text-3xl font-bold text-gray-900">{mockProducts.length}</p>
            </div>
            <Package className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cities Covered</p>
              <p className="text-3xl font-bold text-gray-900">{indianCities.length}</p>
              <p className="text-xs text-gray-500 mt-1">BLR, CHN, MUM, HYD</p>
            </div>
            <MapPin className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* City Market Overview */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">City Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {indianCities.map((city) => (
            <div key={city.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{city.name}</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {city.state}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Size:</span>
                  <span className="font-medium">{city.marketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className="font-medium text-green-600">
                    {marketInsights[city.id as keyof typeof marketInsights]?.growthRate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competition:</span>
                  <span className={`font-medium ${
                    city.competitorDensity === 'High' ? 'text-red-600' : 
                    city.competitorDensity === 'Medium' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {city.competitorDensity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3D Analytics Dashboard */}
      <Dashboard3D 
        title="Bengaluru Performance Analytics"
        data={{
          sales: 11900000, // Total Bengaluru sales
          growth: 12.8,
          orders: 1850,
          profit: 1785000
        }}
      />

      {/* Advanced City Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CityAnalyticsChart 
          type="composed" 
          title="City Performance vs Predictions" 
          height={350}
        />
        <CityAnalyticsChart 
          type="scatter" 
          title="Market Size vs Sales Analysis" 
          height={350}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Performance */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 p-6 hover:bg-white/90 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Shop Performance {selectedCity !== 'all' && `- ${selectedCity}`}
            </h3>
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {shopStats.map((shop) => (
              <div key={shop.id} className="border border-white/30 rounded-xl p-4 bg-white/50 backdrop-blur hover:bg-white/70 hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{shop.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Sales: ₹{shop.totalSales.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{shop.city} • {shop.address.split(',')[0]}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Orders: {shop.ordersCount}</span>
                  <span className={`font-medium ${shop.lowStock > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    Low Stock: {shop.lowStock} items
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Predictions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 p-6 hover:bg-white/90 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} Sales Predictions
            </h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {cityPredictions.map((prediction, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-900">{prediction.city}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">{prediction.trend}</span>
                    <p className="text-xs text-gray-500">{prediction.growth} growth</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Top Color: {prediction.color}</span>
                  <span className="font-medium text-gray-900">{prediction.predictedSales} units</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Market Size: {prediction.marketSize}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Color Trends and Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CityAnalyticsChart 
          type="trend" 
          title="Color Popularity Trends" 
          height={350}
        />
        <CityAnalyticsChart 
          type="prediction" 
          title="Next Month Sales Predictions" 
          height={350}
        />
      </div>

      {/* Popular Products in Bengaluru */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Popular Paint Colors in Bengaluru</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-white">
            <h4 className="font-medium text-gray-900 mb-3">🏆 Top Selling Colors</h4>
            <div className="space-y-2">
              {indianCities[0].popularColors.slice(0, 5).map((color, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorCode(color) }}
                    ></div>
                    <span className="text-gray-700">{color}</span>
                  </div>
                  <span className="text-gray-500">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-white">
            <h4 className="font-medium text-gray-900 mb-3">☀️ Summer Favorites</h4>
            <div className="space-y-2">
              {indianCities[0].seasonalDemand.summer.map((color, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorCode(color) }}
                    ></div>
                    <span className="text-gray-700">{color}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-white">
            <h4 className="font-medium text-gray-900 mb-3">🎉 Festival Collection</h4>
            <div className="space-y-2">
              {indianCities[0].seasonalDemand.festival.map((color, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: getColorCode(color) }}
                    ></div>
                    <span className="text-gray-700">{color}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Universal AI Features - Available on all views */}
      <AIChatAssistant role="distributor" businessData={{ totalShops: mockShops.length }} />
      <ColorPhotoMatch role="distributor" />
    </div>
  );
};

export default DistributorDashboard;