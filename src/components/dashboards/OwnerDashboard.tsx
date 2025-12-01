import React, { useState } from 'react';
import { 
  BarChart3, 
  IndianRupee, 
  Package, 
  TrendingUp, 
  Users,
  FileText,
  Brain
} from 'lucide-react';
import { mockOrders, mockProducts } from '../../data/mockData';
import SalesChart from '../charts/SalesChart';
import InventoryChart from '../charts/InventoryChart';
import Dashboard3D from '../charts/Dashboard3D';
import CustomerAnalyticsTab from '../navigation/CustomerAnalyticsTab';
import { getCustomerSummary } from '../../data/customerAnalytics';
import { ColorPsychologyAdvisor } from '../smart-features/ColorPsychologyAdvisor';
import { SmartPurchasePrediction } from '../smart-features/SmartPurchasePrediction';
import { CustomerBehaviorHeatmap } from '../smart-features/CustomerBehaviorHeatmap';
import SmartInsightsPanel from '../analytics/SmartInsightsPanel';
import AIQuickInsights from '../analytics/AIQuickInsights';
import AIChatAssistant from '../shared/AIChatAssistant';
import ColorPhotoMatch from '../shared/ColorPhotoMatch';

const OwnerDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'customers' | 'ai-features'>('overview');

  // Analytics data
  const totalSales = mockOrders.reduce((sum, order) => sum + order.grandTotal, 0);
  const totalOrders = mockOrders.length;
  const averageOrder = totalSales / totalOrders;
  const lowStockProducts = mockProducts.filter(p => p.quantity < 100);
  const customerSummary = getCustomerSummary();

  const statsCards = [
    {
      name: 'Total Sales',
      value: `₹${totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: '+12.3%',
      changeType: 'increase' as const,
      icon: IndianRupee,
      color: 'bg-green-500'
    },
    {
      name: 'Orders',
      value: totalOrders.toString(),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      name: 'Average Order',
      value: `₹${averageOrder.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      change: '+3.1%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      name: 'Low Stock Items',
      value: lowStockProducts.length.toString(),
      change: '-2 items',
      changeType: 'decrease' as const,
      icon: Package,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen -m-6">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Owner Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Complete business performance overview</p>
              </div>
            </div>
          </div>
          {activeTab === 'overview' && (
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as 'day' | 'month' | 'year')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="day">Today</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <BarChart3 className="w-4 h-4" />
            Business Overview
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`${
              activeTab === 'customers'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Users className="w-4 h-4" />
            Customer Analytics ({customerSummary.totalCustomers})
          </button>
          <button
            onClick={() => setActiveTab('ai-features')}
            className={`${
              activeTab === 'ai-features'
                ? 'border-purple-500 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
          >
            <Brain className="w-4 h-4" />
            🤖 AI Features
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat) => (
              <div key={stat.name} className="bg-white/80 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/30 hover:bg-white/90 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 hover-lift">
                <div className={`p-3 rounded-lg ${stat.color} inline-block mb-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.name}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

      {/* AI Quick Insights Widget */}
      <AIQuickInsights
        salesData={{
          totalRevenue: totalSales,
          totalOrders: totalOrders,
          avgOrderValue: averageOrder,
        }}
        productData={{
          topProducts: mockProducts
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 3)
            .map(p => ({ name: p.colorName })),
        }}
        onViewMore={() => setActiveTab('ai-features')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Sales Chart */}
        <SalesChart 
          type="area" 
          title="Monthly Sales Trends" 
          height={280}
        />

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {mockOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">₹{order.grandTotal.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{order.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Dashboard */}
      <Dashboard3D 
        title="Business Performance Overview"
        data={{
          sales: totalSales,
          growth: 12.5,
          orders: totalOrders,
          profit: totalSales * 0.15
        }}
      />

      {/* Advanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart 
          type="pie" 
          title="Sales by Color Category" 
          height={350}
        />
        <InventoryChart 
          type="bar" 
          title="Inventory Status by Category" 
          height={350}
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Package className="h-5 w-5 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-orange-900">Low Stock Alert</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.colorName}</p>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{product.quantity}</p>
                    <p className="text-xs text-gray-500">units left</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      )}

      {/* Customer Analytics Tab */}
      {activeTab === 'customers' && (
        <CustomerAnalyticsTab />
      )}

      {/* AI Features Tab */}
      {activeTab === 'ai-features' && (
        <div className="p-6 space-y-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              🤖 AI-Powered Smart Features
            </h2>
            <p className="text-gray-600 text-lg">Industry-first intelligence powered by 10,000+ real transactions</p>
          </div>

          {/* NEW: Smart Insights Panel - Real-time AI Analysis */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
            <SmartInsightsPanel 
              salesData={{
                totalRevenue: totalSales,
                totalOrders: totalOrders,
                avgOrderValue: averageOrder,
                growthRate: 12.3,
              }}
              productData={{
                topProducts: mockProducts
                  .sort((a, b) => b.quantity - a.quantity)
                  .slice(0, 5)
                  .map(p => ({ name: p.colorName, category: p.quality })),
              }}
              customerData={{
                totalCustomers: customerSummary.totalCustomers,
                repeatRate: 45,
                avgFrequency: 28,
                topSegment: 'Premium Buyers',
              }}
              inventoryData={{
                lowStockCount: lowStockProducts.length,
                overStockCount: mockProducts.filter(p => p.quantity > 300).length,
                turnoverRate: 45,
                slowMoving: mockProducts
                  .filter(p => p.quantity > 200)
                  .slice(0, 3)
                  .map(p => p.colorName),
              }}
            />
          </div>

          {/* Feature 1: Color Psychology Advisor */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-purple-900 mb-2">🎨 Color Psychology Advisor</h3>
              <p className="text-gray-600">Scientific color recommendations based on room type, mood, and seasonal intelligence</p>
            </div>
            <ColorPsychologyAdvisor />
          </div>

          {/* Feature 2: Smart Purchase Prediction */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-blue-900 mb-2">🧠 Smart Purchase Prediction Engine</h3>
              <p className="text-gray-600">Advanced analytics analyzing 10K+ transactions with pattern recognition</p>
            </div>
            <SmartPurchasePrediction />
          </div>

          {/* Feature 3: Customer Behavior Heatmap */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-pink-100">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-pink-900 mb-2">📊 Customer Behavior Heatmap</h3>
              <p className="text-gray-600">Visual intelligence showing when customers buy what - with festival insights</p>
            </div>
            <CustomerBehaviorHeatmap />
          </div>
        </div>
      )}

      {/* Universal AI Features - Available on all tabs */}
      <AIChatAssistant role="owner" businessData={{ totalSales, totalOrders, averageOrder }} />
      <ColorPhotoMatch role="owner" />
    </div>
  );
};

export default OwnerDashboard;