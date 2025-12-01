import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';

interface InventoryData {
  category: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  total: number;
}

interface QualityData {
  quality: string;
  count: number;
  percentage: number;
  fill: string;
}

interface InventoryChartProps {
  data?: InventoryData[];
  qualityData?: QualityData[];
  type?: 'bar' | 'pie' | 'radial';
  title?: string;
  height?: number;
}

const QUALITY_COLORS = {
  Premium: '#8B5CF6',
  Standard: '#3B82F6',
  Economy: '#10B981'
};

const InventoryChart: React.FC<InventoryChartProps> = ({ 
  data = [], 
  qualityData = [],
  type = 'bar', 
  title = 'Inventory Overview',
  height = 300 
}) => {
  const defaultInventoryData: InventoryData[] = [
    { category: 'Blue Shades', inStock: 150, lowStock: 25, outOfStock: 5, total: 180 },
    { category: 'White Shades', inStock: 200, lowStock: 30, outOfStock: 8, total: 238 },
    { category: 'Green Shades', inStock: 120, lowStock: 20, outOfStock: 3, total: 143 },
    { category: 'Orange Shades', inStock: 80, lowStock: 15, outOfStock: 2, total: 97 },
    { category: 'Purple Shades', inStock: 60, lowStock: 10, outOfStock: 1, total: 71 },
  ];

  const defaultQualityData: QualityData[] = [
    { quality: 'Premium', count: 180, percentage: 35, fill: QUALITY_COLORS.Premium },
    { quality: 'Standard', count: 220, percentage: 43, fill: QUALITY_COLORS.Standard },
    { quality: 'Economy', count: 115, percentage: 22, fill: QUALITY_COLORS.Economy },
  ];

  const inventoryData = data.length > 0 ? data : defaultInventoryData;
  const pieData = qualityData.length > 0 ? qualityData : defaultQualityData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} units
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="category" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="inStock" stackId="a" fill="#10B981" name="In Stock" />
            <Bar dataKey="lowStock" stackId="a" fill="#F59E0B" name="Low Stock" />
            <Bar dataKey="outOfStock" stackId="a" fill="#EF4444" name="Out of Stock" />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50}
              paddingAngle={3}
              dataKey="count"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [value, 'Products']}
              labelFormatter={(label) => `Quality: ${label}`}
            />
          </PieChart>
        );

      case 'radial':
        return (
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={pieData}>
            <RadialBar
              minAngle={15}
              label={{ position: 'insideStart', fill: '#fff' }}
              background
              clockWise
              dataKey="count"
            />
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip />
          </RadialBarChart>
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
        <div className="mt-4 flex justify-center space-x-6">
          {pieData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: entry.fill }}
              ></div>
              <span className="text-sm text-gray-600">{entry.quality}</span>
              <span className="text-sm font-medium text-gray-900">{entry.count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryChart;