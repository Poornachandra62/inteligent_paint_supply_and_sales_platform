import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, Package, AlertCircle, Loader } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface SmartInsightsPanelProps {
  salesData: any;
  productData: any;
  customerData: any;
  inventoryData: any;
}

interface InsightCard {
  title: string;
  content: string;
  icon: React.ReactNode;
  loading: boolean;
  error?: string;
}

const SmartInsightsPanel: React.FC<SmartInsightsPanelProps> = ({
  salesData,
  productData,
  customerData,
  inventoryData,
}) => {
  const [insights, setInsights] = useState<InsightCard[]>([
    {
      title: 'Business Intelligence',
      content: '',
      icon: <TrendingUp className="w-5 h-5" />,
      loading: true,
    },
    {
      title: 'Customer Insights',
      content: '',
      icon: <Users className="w-5 h-5" />,
      loading: true,
    },
    {
      title: 'Inventory Optimization',
      content: '',
      icon: <Package className="w-5 h-5" />,
      loading: true,
    },
  ]);

  const [predictiveAnalysis, setPredictiveAnalysis] = useState<string>('');
  const [loadingPrediction, setLoadingPrediction] = useState(true);

  useEffect(() => {
    loadAllInsights();
  }, [salesData, productData, customerData, inventoryData]);

  const loadAllInsights = async () => {
    // Load Business Insights
    loadBusinessInsights();
    
    // Load Customer Insights
    loadCustomerInsights();
    
    // Load Inventory Insights
    loadInventoryInsights();
    
    // Load Predictive Analysis
    loadPredictiveAnalysis();
  };

  const loadBusinessInsights = async () => {
    try {
      const response = await aiService.getBusinessInsights(salesData, productData);
      
      if (response.success && response.data) {
        setInsights(prev => prev.map((insight, idx) => 
          idx === 0 
            ? { ...insight, content: response.data!, loading: false }
            : insight
        ));
      } else {
        setInsights(prev => prev.map((insight, idx) => 
          idx === 0 
            ? { ...insight, content: 'Unable to generate insights at this time.', loading: false, error: response.error }
            : insight
        ));
      }
    } catch (error) {
      setInsights(prev => prev.map((insight, idx) => 
        idx === 0 
          ? { ...insight, content: 'Error loading insights.', loading: false }
          : insight
      ));
    }
  };

  const loadCustomerInsights = async () => {
    try {
      const response = await aiService.getCustomerSegmentInsights(customerData);
      
      if (response.success && response.data) {
        setInsights(prev => prev.map((insight, idx) => 
          idx === 1 
            ? { ...insight, content: response.data!, loading: false }
            : insight
        ));
      } else {
        setInsights(prev => prev.map((insight, idx) => 
          idx === 1 
            ? { ...insight, content: 'Unable to generate customer insights.', loading: false }
            : insight
        ));
      }
    } catch (error) {
      setInsights(prev => prev.map((insight, idx) => 
        idx === 1 
          ? { ...insight, content: 'Error loading insights.', loading: false }
          : insight
      ));
    }
  };

  const loadInventoryInsights = async () => {
    try {
      const response = await aiService.getInventoryRecommendations(inventoryData);
      
      if (response.success && response.data) {
        setInsights(prev => prev.map((insight, idx) => 
          idx === 2 
            ? { ...insight, content: response.data!, loading: false }
            : insight
        ));
      } else {
        setInsights(prev => prev.map((insight, idx) => 
          idx === 2 
            ? { ...insight, content: 'Unable to generate inventory insights.', loading: false }
            : insight
        ));
      }
    } catch (error) {
      setInsights(prev => prev.map((insight, idx) => 
        idx === 2 
          ? { ...insight, content: 'Error loading insights.', loading: false }
          : insight
      ));
    }
  };

  const loadPredictiveAnalysis = async () => {
    try {
      const historicalData = {
        last30Days: salesData.totalRevenue,
        growthRate: salesData.growthRate || 0,
        topCategory: productData.topProducts?.[0]?.category || 'General',
        peakDay: 'Saturday',
      };

      const response = await aiService.getPredictiveAnalysis(historicalData);
      
      if (response.success && response.data) {
        setPredictiveAnalysis(response.data);
      } else {
        setPredictiveAnalysis('Unable to generate predictive analysis at this time.');
      }
      setLoadingPrediction(false);
    } catch (error) {
      setPredictiveAnalysis('Error loading predictive analysis.');
      setLoadingPrediction(false);
    }
  };

  const refreshInsights = () => {
    setInsights(prev => prev.map(insight => ({ ...insight, loading: true })));
    setLoadingPrediction(true);
    loadAllInsights();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Business Advisor</h2>
            <p className="text-sm text-gray-500">Real-time intelligent insights powered by advanced analytics</p>
          </div>
        </div>
        <button
          onClick={refreshInsights}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Refresh Insights
        </button>
      </div>

      {/* Predictive Analysis - Featured Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6" />
          <h3 className="text-xl font-bold">Predictive Analysis & Forecasting</h3>
        </div>
        
        {loadingPrediction ? (
          <div className="flex items-center gap-3 py-4">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Analyzing trends and generating forecast...</span>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="whitespace-pre-line text-white/95 leading-relaxed">
              {predictiveAnalysis}
            </p>
          </div>
        )}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                {insight.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{insight.title}</h3>
            </div>
            
            {insight.loading ? (
              <div className="flex items-center gap-3 py-4">
                <Loader className="w-5 h-5 animate-spin text-purple-600" />
                <span className="text-gray-500 text-sm">Analyzing data...</span>
              </div>
            ) : insight.error ? (
              <div className="flex items-start gap-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{insight.content}</p>
              </div>
            ) : (
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {insight.content}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">About Smart Insights</p>
          <p>
            These insights are generated in real-time using advanced analytics algorithms that analyze your business data,
            market trends, and industry patterns to provide actionable recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartInsightsPanel;
