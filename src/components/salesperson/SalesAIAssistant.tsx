import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Zap, Loader, Target, DollarSign } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { mockProducts } from '../../data/mockData';

const SalesAIAssistant: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string>('');
  const [coaching, setCoaching] = useState<string>('');
  const [loadingRec, setLoadingRec] = useState(true);
  const [loadingCoach, setLoadingCoach] = useState(true);

  // Mock sales data
  const salesTarget = 15000;
  const currentSales = 8200;
  const percentage = Math.round((currentSales / salesTarget) * 100);
  const timeOfDay = new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening';

  useEffect(() => {
    loadRecommendations();
    loadCoaching();
  }, []);

  const loadRecommendations = async () => {
    try {
      const topProducts = mockProducts.slice(0, 3).map(p => p.colorName);
      
      const response = await aiService.getSmartProductRecommendations({
        currentProduct: topProducts[0],
        customerType: 'Walk-in',
        season: 'Current',
      });

      if (response.success && response.data) {
        setRecommendations(response.data);
      } else {
        setRecommendations('💡 Recommend complementary products like primers, rollers, and brushes to increase order value.');
      }
    } catch (error) {
      setRecommendations('💡 Focus on premium products and seasonal colors for better margins.');
    }
    setLoadingRec(false);
  };

  const loadCoaching = async () => {
    try {
      const response = await aiService.getDailySalesCoaching({
        target: salesTarget,
        current: currentSales,
        percentage: percentage,
        timeOfDay: timeOfDay,
      });

      if (response.success && response.data) {
        setCoaching(response.data);
      } else {
        setCoaching(`You're ${percentage}% to target! Focus on upselling and bundle offers to boost average order value.`);
      }
    } catch (error) {
      setCoaching('Keep pushing! Every customer interaction is an opportunity. Focus on value, not just price.');
    }
    setLoadingCoach(false);
  };

  const refresh = () => {
    setLoadingRec(true);
    setLoadingCoach(true);
    loadRecommendations();
    loadCoaching();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Sales Assistant</h2>
            <p className="text-sm text-gray-500">Real-time recommendations powered by intelligent analytics</p>
          </div>
        </div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Sales Progress Card */}
      <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6" />
            <h3 className="text-lg font-bold">Today's Target</h3>
          </div>
          <DollarSign className="w-6 h-6 opacity-75" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-bold">₹{currentSales.toLocaleString()}</span>
            <span className="text-lg opacity-90">/ ₹{salesTarget.toLocaleString()}</span>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="font-semibold">{percentage}% Complete</span>
            <span className="opacity-90">₹{(salesTarget - currentSales).toLocaleString()} to go</span>
          </div>
        </div>
      </div>

      {/* AI Coach */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Zap className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Your AI Sales Coach</h3>
        </div>
        
        {loadingCoach ? (
          <div className="flex items-center gap-3 py-4">
            <Loader className="w-5 h-5 animate-spin text-orange-600" />
            <span className="text-gray-500">Analyzing your performance...</span>
          </div>
        ) : (
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{coaching}</p>
          </div>
        )}
      </div>

      {/* Smart Recommendations */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Smart Product Recommendations</h3>
        </div>
        
        {loadingRec ? (
          <div className="flex items-center gap-3 py-4">
            <Loader className="w-5 h-5 animate-spin text-green-600" />
            <span className="text-gray-500">Generating recommendations...</span>
          </div>
        ) : (
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{recommendations}</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
        <h3 className="text-lg font-bold text-purple-900 mb-3">💡 Quick Sales Tips</h3>
        <ul className="space-y-2 text-sm text-purple-800">
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">→</span>
            <span>Always suggest complementary products (primer, brushes, rollers)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">→</span>
            <span>Highlight seasonal colors and festival collections</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">→</span>
            <span>Bundle offers increase average order value by 25-30%</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-600 mt-0.5">→</span>
            <span>Premium products have better margins - educate on quality benefits</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SalesAIAssistant;
