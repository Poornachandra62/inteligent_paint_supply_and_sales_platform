import React from 'react';
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface Dashboard3DProps {
  title?: string;
  data?: {
    sales: number;
    growth: number;
    orders: number;
    profit: number;
  };
}

const Dashboard3D: React.FC<Dashboard3DProps> = ({ 
  title = "3D Analytics Dashboard",
  data = { sales: 2500000, growth: 12.5, orders: 450, profit: 375000 }
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl p-8 border border-white/50">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{title}</h3>
      
      {/* 3D-style Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Sales Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
          <div className="relative bg-white rounded-lg p-4 shadow-lg transform group-hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">₹{(data.sales / 100000).toFixed(1)}L</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+{data.growth}%</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 rounded-lg transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
          <div className="relative bg-white rounded-lg p-4 shadow-lg transform group-hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{data.orders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+8.2%</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Profit Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg transform rotate-1 group-hover:rotate-2 transition-transform"></div>
          <div className="relative bg-white rounded-lg p-4 shadow-lg transform group-hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit</p>
                <p className="text-2xl font-bold text-gray-900">₹{(data.profit / 1000).toFixed(0)}K</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+15.3%</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        </div>

        {/* Growth Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg transform -rotate-1 group-hover:-rotate-2 transition-transform"></div>
          <div className="relative bg-white rounded-lg p-4 shadow-lg transform group-hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-gray-900">{data.growth}%</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">+2.1%</span>
              <span className="text-gray-500 text-sm ml-1">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Bengaluru Area Sales</h4>
          <div className="space-y-3">
            {[
              { area: 'Koramangala', progress: 85, color: 'bg-blue-500' },
              { area: 'Indiranagar', progress: 78, color: 'bg-green-500' },
              { area: 'Whitefield', progress: 72, color: 'bg-yellow-500' },
              { area: 'Jayanagar', progress: 68, color: 'bg-purple-500' },
              { area: 'HSR Layout', progress: 64, color: 'bg-pink-500' },
              { area: 'Malleshwaram', progress: 60, color: 'bg-indigo-500' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.area}</span>
                  <span className="text-gray-900 font-medium">{item.progress}%</span>
                </div>
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gray-300 rounded-full transform translate-y-0.5"></div>
                  <div 
                    className={`relative h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Top Colors in Bengaluru</h4>
          <div className="space-y-3">
            {[
              { color: 'White', sales: 28, hex: '#FFFFFF' },
              { color: 'Light Grey', sales: 22, hex: '#D3D3D3' },
              { color: 'Beige', sales: 18, hex: '#F5F5DC' },
              { color: 'Ocean Blue', sales: 16, hex: '#0077BE' },
              { color: 'Forest Green', sales: 12, hex: '#228B22' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm"
                    style={{ backgroundColor: item.hex }}
                  ></div>
                  <span className="text-gray-700">{item.color}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: `${item.sales * 4}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{item.sales}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard3D;