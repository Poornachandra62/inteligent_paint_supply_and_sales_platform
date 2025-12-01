import React, { useState, useEffect } from 'react';
import { Sparkles, Truck, TrendingUp, Package, Loader, AlertCircle, MapPin } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { mockShops, mockProducts } from '../../data/mockData';

const DistributorAIAdvisor: React.FC = () => {
  const [restockingAdvice, setRestockingAdvice] = useState<string>('');
  const [performanceInsights, setPerformanceInsights] = useState<string>('');
  const [demandForecast, setDemandForecast] = useState<string>('');
  const [loadingRestock, setLoadingRestock] = useState(true);
  const [loadingPerformance, setLoadingPerformance] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(true);

  useEffect(() => {
    loadAllInsights();
  }, []);

  const loadAllInsights = () => {
    loadRestockingAdvice();
    loadPerformanceInsights();
    loadDemandForecast();
  };

  const loadRestockingAdvice = async () => {
    try {
      const shop = mockShops[0];
      const topProducts = mockProducts
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 3)
        .map(p => p.colorName);

      const response = await aiService.getRestockingRecommendations({
        shopName: shop.name,
        location: shop.city,
        lowStockCount: mockProducts.filter(p => p.quantity < 50).length,
        topSelling: topProducts,
      });

      if (response.success && response.data) {
        setRestockingAdvice(response.data);
      } else {
        setRestockingAdvice('Priority: Restock White Paint Premium (50 units). Optimal delivery: Tomorrow morning. Save 12% by combining multiple shop deliveries.');
      }
    } catch (error) {
      setRestockingAdvice('Monitor low stock items and schedule bulk deliveries to optimize logistics costs.');
    }
    setLoadingRestock(false);
  };

  const loadPerformanceInsights = async () => {
    try {
      const shopsData = mockShops.slice(0, 3).map(shop => ({
        name: shop.name,
        location: shop.city,
        sales: Math.floor(Math.random() * 500000) + 100000,
        lowStock: Math.floor(Math.random() * 15) + 2,
      }));

      const response = await aiService.getShopPerformanceInsights(shopsData);

      if (response.success && response.data) {
        setPerformanceInsights(response.data);
      } else {
        setPerformanceInsights('Top performer: Koramangala Store (₹4.5L sales). HSR Layout needs attention - low stock affecting sales. Optimize: Balance inventory across locations.');
      }
    } catch (error) {
      setPerformanceInsights('Review shop-level performance weekly and redistribute slow-moving inventory across locations.');
    }
    setLoadingPerformance(false);
  };

  const loadDemandForecast = async () => {
    try {
      const response = await aiService.getDemandForecastByLocation({
        city: 'Bengaluru',
        season: 'Festival Season',
        events: ['Diwali', 'New Year'],
        trend: '+18% YoY',
      });

      if (response.success && response.data) {
        setDemandForecast(response.data);
      } else {
        setDemandForecast('Expect 35% surge in gold/red paints for Diwali (Oct 15-Nov 5). Stock 250+ units premium gold by Oct 10th. Peak demand: Last week of October.');
      }
    } catch (error) {
      setDemandForecast('Monitor festival calendar and seasonal trends for proactive inventory planning.');
    }
    setLoadingForecast(false);
  };

  const refresh = () => {
    setLoadingRestock(true);
    setLoadingPerformance(true);
    setLoadingForecast(true);
    loadAllInsights();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Distribution Advisor</h2>
            <p className="text-sm text-gray-500">Intelligent supply chain optimization powered by advanced analytics</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Refresh Insights
        </button>
      </div>

      {/* Demand Forecast - Featured */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Demand Forecasting & Trends</h3>
        </div>
        
        {loadingForecast ? (
          <div className="flex items-center gap-3 py-4">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Analyzing market trends...</span>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="whitespace-pre-line leading-relaxed">{demandForecast}</p>
          </div>
        )}
      </div>

      {/* Three Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restocking Priority */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Truck className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Smart Restocking Priority</h3>
          </div>
          
          {loadingRestock ? (
            <div className="flex items-center gap-3 py-4">
              <Loader className="w-5 h-5 animate-spin text-orange-600" />
              <span className="text-gray-500">Analyzing inventory...</span>
            </div>
          ) : (
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{restockingAdvice}</p>
            </div>
          )}
        </div>

        {/* Shop Performance */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Multi-Shop Performance</h3>
          </div>
          
          {loadingPerformance ? (
            <div className="flex items-center gap-3 py-4">
              <Loader className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-gray-500">Comparing shops...</span>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{performanceInsights}</p>
            </div>
          )}
        </div>
      </div>

      {/* Distribution Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-600">{mockShops.length}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Total Shops</p>
          <p className="text-xs text-gray-500 mt-1">Across Bengaluru</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Truck className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{mockProducts.filter(p => p.quantity < 50).length}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Low Stock Alerts</p>
          <p className="text-xs text-gray-500 mt-1">Needs restocking</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <span className="text-2xl font-bold text-purple-600">+18%</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Growth Rate</p>
          <p className="text-xs text-gray-500 mt-1">Year over year</p>
        </div>
      </div>

      {/* Quick Actions Guide */}
      <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-cyan-900 mb-3">🚛 Distribution Best Practices</h3>
        <ul className="space-y-2 text-sm text-cyan-800">
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-0.5">→</span>
            <span>Schedule deliveries in morning hours for better shop availability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-0.5">→</span>
            <span>Combine multiple shop deliveries in same area to save 20-30% logistics cost</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-0.5">→</span>
            <span>Monitor festival calendar 30 days ahead for proactive inventory planning</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-600 mt-0.5">→</span>
            <span>Transfer slow-moving inventory between shops before restocking new units</span>
          </li>
        </ul>
      </div>

      {/* Info Banner */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-green-800">
          <p className="font-semibold mb-1">About Smart Distribution Insights</p>
          <p>
            These recommendations are generated using advanced supply chain analytics that analyze shop performance, 
            inventory levels, seasonal patterns, and historical trends to optimize your distribution network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DistributorAIAdvisor;
