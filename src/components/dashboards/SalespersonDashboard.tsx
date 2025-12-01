import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Package, 
  Brain
} from 'lucide-react';
import POSSystem from '../pos/POSSystem';
import InventoryManager from '../inventory/InventoryManager';
import SalesChart from '../charts/SalesChart';
import InventoryChart from '../charts/InventoryChart';
import SalesAIAssistant from '../salesperson/SalesAIAssistant';
import AIChatAssistant from '../shared/AIChatAssistant';
import ColorPhotoMatch from '../shared/ColorPhotoMatch';

const SalespersonDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'inventory' | 'ai-assistant'>('pos');

  const tabs = [
    {
      id: 'pos',
      name: 'Point of Sale',
      icon: ShoppingCart,
      description: 'Process customer orders and generate receipts'
    },
    {
      id: 'inventory',
      name: 'Inventory Management',
      icon: Package,
      description: 'Search and manage product inventory'
    },
    {
      id: 'ai-assistant',
      name: '🤖 AI Sales Assistant',
      icon: Brain,
      description: 'Smart recommendations and sales coaching'
    }
  ];

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen p-6 -m-6">
      <div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Point of Sale & Inventory Management</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'pos' | 'inventory' | 'ai-assistant')}
              className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className={`mr-2 h-5 w-5 ${
                activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              }`} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Quick Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart 
            type="line" 
            title="Daily Sales Performance" 
            height={250}
          />
          <InventoryChart 
            type="pie" 
            title="Inventory by Quality" 
            height={250}
          />
        </div>

        {/* Main Content */}
        {activeTab === 'ai-assistant' ? (
          <SalesAIAssistant />
        ) : (
          <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/30 p-6 hover:bg-white/90 transition-all duration-300">
            {activeTab === 'pos' && <POSSystem />}
            {activeTab === 'inventory' && <InventoryManager />}
          </div>
        )}
      </div>

      {/* Universal AI Features - Available on all tabs */}
      <AIChatAssistant role="salesperson" businessData={{}} />
      <ColorPhotoMatch role="salesperson" />
    </div>
  );
};

export default SalespersonDashboard;