import React, { useState, useEffect } from 'react';
import { TrendingUp, Clock, Calendar, Sun, Moon, Zap, BarChart3, Activity } from 'lucide-react';
import { 
  generateBehaviorHeatmap, 
  getHeatmapIntensity,
  getHeatmapColor,
  BehaviorHeatmapData 
} from '../../analytics/behaviorAnalytics';

export const CustomerBehaviorHeatmap: React.FC = () => {
  const [heatmapData, setHeatmapData] = useState<BehaviorHeatmapData | null>(null);
  const [view, setView] = useState<'time' | 'day' | 'seasonal'>('time');

  useEffect(() => {
    const data = generateBehaviorHeatmap();
    setHeatmapData(data);
  }, []);

  if (!heatmapData) {
    return <div>Loading...</div>;
  }

  const maxTimeRevenue = Math.max(...heatmapData.timeSlots.map(t => t.totalRevenue));
  const maxDayRevenue = Math.max(...heatmapData.daysOfWeek.map(d => d.totalRevenue));
  const maxMonthRevenue = Math.max(...heatmapData.seasonal.map(s => s.totalRevenue));

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Activity className="w-12 h-12 text-blue-600 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Customer Behavior Heatmap
          </h1>
          <BarChart3 className="w-12 h-12 text-purple-600 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg">
          Visual intelligence showing <span className="font-bold text-blue-600">WHEN</span> customers buy <span className="font-bold text-purple-600">WHAT</span>
        </p>
      </div>

      {/* Key Insights Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <h3 className="font-bold text-green-900 text-lg">Peak Performance</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Best Time:</span> {heatmapData.insights.peakTime}
            </p>
            <p className="text-sm text-green-800">
              <span className="font-semibold">Best Day:</span> {heatmapData.insights.peakDay}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-8 h-8 text-purple-600" />
            <h3 className="font-bold text-purple-900 text-lg">Customer Segments</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Premium Buyers:</span> {heatmapData.insights.premiumBuyingTime}
            </p>
            <p className="text-sm text-purple-800">
              <span className="font-semibold">Budget Buyers:</span> {heatmapData.insights.budgetBuyingTime}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-8 h-8 text-orange-600" />
            <h3 className="font-bold text-orange-900 text-lg">Opportunity</h3>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Slow Time:</span> {heatmapData.insights.slowestTime}
            </p>
            <p className="text-sm text-orange-800">
              <span className="font-semibold">Slow Day:</span> {heatmapData.insights.slowestDay}
            </p>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setView('time')}
          className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
            view === 'time'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Clock className="inline w-5 h-5 mr-2" />
          Time of Day
        </button>
        <button
          onClick={() => setView('day')}
          className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
            view === 'day'
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Calendar className="inline w-5 h-5 mr-2" />
          Day of Week
        </button>
        <button
          onClick={() => setView('seasonal')}
          className={`px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
            view === 'seasonal'
              ? 'bg-pink-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Sun className="inline w-5 h-5 mr-2" />
          Monthly Trends
        </button>
      </div>

      {/* TIME OF DAY HEATMAP */}
      {view === 'time' && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-blue-900">
            <Clock className="w-7 h-7 text-blue-600" />
            Time-Based Purchase Patterns
          </h2>

          <div className="grid gap-6">
            {heatmapData.timeSlots.map((slot) => {
              const intensity = getHeatmapIntensity(slot.totalRevenue, maxTimeRevenue);
              const colorClass = getHeatmapColor(intensity);

              return (
                <div 
                  key={slot.timeSlot}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Header Bar */}
                  <div className={`${colorClass} text-white p-4 flex items-center justify-between`}>
                    <div className="flex items-center gap-3">
                      {slot.hour < 12 ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                      <div>
                        <h3 className="text-xl font-bold">{slot.timeSlot}</h3>
                        <p className="text-sm opacity-90">{slot.hour}:00 - {slot.hour + 3}:00</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{(slot.totalRevenue / 1000).toFixed(1)}K</p>
                      <p className="text-sm opacity-90">{slot.totalOrders} orders</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 bg-gray-50">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Average Order Value */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">Avg Order Value</p>
                        <p className="text-3xl font-bold text-blue-600">₹{Math.round(slot.avgOrderValue)}</p>
                      </div>

                      {/* Customer Type Distribution */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">Customer Types</p>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${slot.customerType.premium}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-700">{Math.round(slot.customerType.premium)}% Premium</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${slot.customerType.standard}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-700">{Math.round(slot.customerType.standard)}% Standard</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${slot.customerType.budget}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-700">{Math.round(slot.customerType.budget)}% Budget</span>
                          </div>
                        </div>
                      </div>

                      {/* Top Products */}
                      <div>
                        <p className="text-sm font-semibold text-gray-600 mb-2">Top Sellers</p>
                        <div className="space-y-1">
                          {slot.topProducts.slice(0, 3).map((product, idx) => (
                            <div key={idx} className="text-sm text-gray-700">
                              {idx + 1}. {product.colorName} ({product.count}×)
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY OF WEEK HEATMAP */}
      {view === 'day' && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-purple-900">
            <Calendar className="w-7 h-7 text-purple-600" />
            Weekly Purchase Patterns
          </h2>

          <div className="grid md:grid-cols-7 gap-4">
            {heatmapData.daysOfWeek.map((day) => {
              const intensity = getHeatmapIntensity(day.totalRevenue, maxDayRevenue);
              const colorClass = getHeatmapColor(intensity);

              return (
                <div 
                  key={day.day}
                  className="border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all transform hover:scale-105"
                >
                  <div className={`${colorClass} text-white p-4 text-center`}>
                    <p className="font-bold text-lg">{day.day.slice(0, 3)}</p>
                    <p className="text-2xl font-bold mt-2">₹{(day.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="space-y-2 text-center">
                      <div>
                        <p className="text-xs text-gray-600">Orders</p>
                        <p className="text-lg font-bold text-purple-600">{day.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Peak Hour</p>
                        <p className="text-sm font-semibold text-gray-800">{day.peakHour}:00</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Basket Size</p>
                        <p className="text-sm font-semibold text-gray-800">{day.averageBasketSize.toFixed(1)} items</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Top Category</p>
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">
                          {day.topCategories[0] || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weekly Insights */}
          <div className="mt-8 bg-purple-50 p-6 rounded-xl border-2 border-purple-200">
            <h3 className="font-bold text-purple-900 mb-3 text-lg">📊 Weekly Insights</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Weekend vs Weekday</p>
                <p className="text-lg font-bold text-purple-600">
                  Weekends: {Math.round(
                    ((heatmapData.daysOfWeek[0].totalRevenue + heatmapData.daysOfWeek[6].totalRevenue) /
                    heatmapData.daysOfWeek.reduce((sum, d) => sum + d.totalRevenue, 0)) * 100
                  )}% of revenue
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Busiest Day</p>
                <p className="text-lg font-bold text-green-600">
                  {heatmapData.daysOfWeek.sort((a, b) => b.totalOrders - a.totalOrders)[0].day}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEASONAL/MONTHLY HEATMAP */}
      {view === 'seasonal' && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-pink-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-pink-900">
            <Sun className="w-7 h-7 text-pink-600" />
            Monthly & Seasonal Trends
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {heatmapData.seasonal.map((month) => {
              const intensity = getHeatmapIntensity(month.totalRevenue, maxMonthRevenue);
              const colorClass = getHeatmapColor(intensity);
              const isFestival = month.festivalBoost > 0;

              return (
                <div 
                  key={month.month}
                  className={`border-2 rounded-xl overflow-hidden hover:shadow-lg transition-all ${
                    isFestival ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200'
                  }`}
                >
                  <div className={`${colorClass} text-white p-4 text-center relative`}>
                    {isFestival && (
                      <div className="absolute top-2 right-2">
                        <span className="text-2xl">🎉</span>
                      </div>
                    )}
                    <p className="font-bold text-lg">{month.month}</p>
                    <p className="text-2xl font-bold mt-2">₹{(month.totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="p-4 bg-gray-50">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-600">Total Orders</p>
                        <p className="text-lg font-bold text-pink-600">{month.totalOrders}</p>
                      </div>

                      {isFestival && (
                        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                          <p className="text-xs text-yellow-800 font-semibold">Festival Boost</p>
                          <p className="text-lg font-bold text-yellow-600">+{Math.round(month.festivalBoost)}%</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-gray-600 mb-2">Top Colors</p>
                        <div className="flex flex-wrap gap-1">
                          {month.topColors.slice(0, 3).map((color, idx) => (
                            <span key={idx} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seasonal Insights */}
          <div className="mt-8 bg-pink-50 p-6 rounded-xl border-2 border-pink-200">
            <h3 className="font-bold text-pink-900 mb-3 text-lg">🌟 Seasonal Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Festival Impact</p>
                <p className="text-lg font-bold text-pink-600">
                  {Math.round(
                    heatmapData.seasonal.filter(m => m.festivalBoost > 0).reduce((sum, m) => sum + m.festivalBoost, 0) /
                    heatmapData.seasonal.filter(m => m.festivalBoost > 0).length || 1
                  )}% Average Boost
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Best Month</p>
                <p className="text-lg font-bold text-green-600">
                  {heatmapData.seasonal.sort((a, b) => b.totalRevenue - a.totalRevenue)[0].month}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Growth Opportunity</p>
                <p className="text-lg font-bold text-orange-600">
                  {heatmapData.seasonal.sort((a, b) => a.totalRevenue - b.totalRevenue)[0].month}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How to Use This Data */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-blue-600" />
          How to Use This Intelligence
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">⏰</div>
            <h4 className="font-bold text-lg mb-2">Staffing Optimization</h4>
            <p className="text-sm text-gray-700">
              Schedule more staff during {heatmapData.insights.peakTime} and {heatmapData.insights.peakDay} to handle peak traffic.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">📢</div>
            <h4 className="font-bold text-lg mb-2">Targeted Marketing</h4>
            <p className="text-sm text-gray-700">
              Run promotions during {heatmapData.insights.slowestTime} on {heatmapData.insights.slowestDay} to boost slow periods.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-lg mb-2">Inventory Planning</h4>
            <p className="text-sm text-gray-700">
              Stock premium products for {heatmapData.insights.premiumBuyingTime} and budget options for {heatmapData.insights.budgetBuyingTime}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
