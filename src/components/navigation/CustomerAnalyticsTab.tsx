import React, { useState } from 'react';
import { Users, BarChart3, TrendingUp } from 'lucide-react';
import CustomerPurchaseHistoryDashboard from '../analytics/CustomerPurchaseHistoryDashboard';
import CustomerPurchaseChart from '../charts/CustomerPurchaseChart';
import { analyzeCustomerPurchases } from '../../data/customerAnalytics';

const CustomerAnalyticsTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');
  const customers = analyzeCustomerPurchases();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Users className="w-4 h-4" />
              Customer Overview
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics Charts
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <CustomerPurchaseHistoryDashboard />
        )}
        {activeTab === 'charts' && (
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                Customer Purchase Analytics
              </h1>
              <p className="text-gray-600">Visual insights into customer purchase patterns and trends</p>
            </div>
            <CustomerPurchaseChart customers={customers} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerAnalyticsTab;
