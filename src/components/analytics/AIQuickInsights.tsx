import React, { useState, useEffect } from 'react';
import { Sparkles, Loader, Brain, TrendingUp, ArrowRight } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface AIQuickInsightsProps {
  salesData: any;
  productData: any;
  onViewMore?: () => void;
}

const AIQuickInsights: React.FC<AIQuickInsightsProps> = ({
  salesData,
  productData,
  onViewMore,
}) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuickInsight();
  }, [salesData, productData]);

  const loadQuickInsight = async () => {
    setLoading(true);
    try {
      const response = await aiService.getSmartRecommendation(
        'Provide one key actionable business insight for today',
        {
          revenue: salesData.totalRevenue,
          orders: salesData.totalOrders,
          topProduct: productData.topProducts?.[0]?.name,
        }
      );

      if (response.success && response.data) {
        setInsight(response.data);
      } else {
        setInsight('Analyzing your business data for intelligent recommendations...');
      }
    } catch (error) {
      setInsight('Quick insights available in AI Features tab.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Smart Business Advisor</h3>
            <p className="text-sm text-white/80">Real-time intelligent insights</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 animate-pulse" />
      </div>

      {loading ? (
        <div className="flex items-center gap-3 py-4">
          <Loader className="w-5 h-5 animate-spin" />
          <span className="text-sm">Analyzing your data...</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm leading-relaxed">{insight}</p>
            </div>
          </div>

          {onViewMore && (
            <button
              onClick={onViewMore}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-4 py-2 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              View Complete Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuickInsights;
