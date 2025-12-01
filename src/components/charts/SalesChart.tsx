import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

interface SalesData {
  month: string;
  sales: number;
  orders: number;
  profit: number;
}

interface ColorSalesData {
  color: string;
  sales: number;
  percentage: number;
  fill: string;
}

interface SalesChartProps {
  data?: SalesData[];
  colorData?: ColorSalesData[];
  type?: 'area' | 'bar' | 'line' | 'pie';
  title?: string;
  height?: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const SalesChart: React.FC<SalesChartProps> = ({ 
  data = [], 
  colorData = [], 
  type = 'area', 
  title = 'Sales Overview',
  height = 300 
}) => {
  const defaultSalesData: SalesData[] = [
    { month: 'Jan', sales: 450000, orders: 120, profit: 67500 },
    { month: 'Feb', sales: 520000, orders: 140, profit: 78000 },
    { month: 'Mar', sales: 480000, orders: 130, profit: 72000 },
    { month: 'Apr', sales: 610000, orders: 165, profit: 91500 },
    { month: 'May', sales: 580000, orders: 155, profit: 87000 },
    { month: 'Jun', sales: 720000, orders: 190, profit: 108000 },
  ];

  const defaultColorData: ColorSalesData[] = [
    { color: 'Ocean Blue', sales: 180000, percentage: 25, fill: '#0077BE' },
    { color: 'Pure White', sales: 144000, percentage: 20, fill: '#FFFFFF' },
    { color: 'Forest Green', sales: 108000, percentage: 15, fill: '#228B22' },
    { color: 'Sunset Orange', sales: 86400, percentage: 12, fill: '#FF6B35' },
    { color: 'Royal Purple', sales: 72000, percentage: 10, fill: '#663399' },
    { color: 'Others', sales: 129600, percentage: 18, fill: '#8884D8' },
  ];

  const salesData = data.length > 0 ? data : defaultSalesData;
  const pieData = colorData.length > 0 ? colorData : defaultColorData;

  const formatCurrency = (value: number) => `₹${(value / 1000).toFixed(0)}K`;
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'area':
        return (
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#colorSales)"
              strokeWidth={3}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              dataKey="sales"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'Sales']}
              labelFormatter={(label) => `Color: ${label}`}
            />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
      
      {type === 'pie' && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span className="text-sm text-gray-600">{entry.color}</span>
              <span className="text-sm font-medium text-gray-900">{entry.percentage}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesChart;