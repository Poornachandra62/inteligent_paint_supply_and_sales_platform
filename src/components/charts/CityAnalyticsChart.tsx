import React from 'react';
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface CityData {
  city: string;
  sales: number;
  growth: number;
  marketSize: number;
  shops: number;
  prediction: number;
}

interface ColorTrendData {
  month: string;
  oceanBlue: number;
  forestGreen: number;
  pureWhite: number;
  sunsetOrange: number;
  royalPurple: number;
}

interface CityAnalyticsChartProps {
  cityData?: CityData[];
  trendData?: ColorTrendData[];
  type?: 'composed' | 'scatter' | 'trend' | 'prediction';
  title?: string;
  height?: number;
}

const CITY_COLORS = {
  Bengaluru: '#8B5CF6'
};

const COLOR_PALETTE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CityAnalyticsChart: React.FC<CityAnalyticsChartProps> = ({ 
  cityData = [], 
  trendData = [],
  type = 'composed', 
  title = 'City Analytics',
  height = 350 
}) => {
  const defaultCityData: CityData[] = [
    { city: 'Bengaluru', sales: 2500000, growth: 12, marketSize: 25000000, shops: 6, prediction: 2800000 }
  ];

  const defaultTrendData: ColorTrendData[] = [
    { month: 'Jan', oceanBlue: 120, forestGreen: 80, pureWhite: 150, sunsetOrange: 60, royalPurple: 40 },
    { month: 'Feb', oceanBlue: 140, forestGreen: 90, pureWhite: 160, sunsetOrange: 70, royalPurple: 45 },
    { month: 'Mar', oceanBlue: 160, forestGreen: 100, pureWhite: 180, sunsetOrange: 85, royalPurple: 55 },
    { month: 'Apr', oceanBlue: 180, forestGreen: 120, pureWhite: 200, sunsetOrange: 100, royalPurple: 65 },
    { month: 'May', oceanBlue: 200, forestGreen: 140, pureWhite: 220, sunsetOrange: 120, royalPurple: 75 },
    { month: 'Jun', oceanBlue: 220, forestGreen: 160, pureWhite: 240, sunsetOrange: 140, royalPurple: 85 },
  ];

  const cities = cityData.length > 0 ? cityData : defaultCityData;
  const trends = trendData.length > 0 ? trendData : defaultTrendData;

  const formatCurrency = (value: number) => `₹${(value / 100000).toFixed(1)}L`;
  const formatLarge = (value: number) => `₹${(value / 10000000).toFixed(1)}Cr`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center" style={{ color: entry.color }}>
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {
                entry.value > 1000000 ? formatCurrency(entry.value) :
                entry.value > 100 ? entry.value.toLocaleString() :
                entry.value
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'composed':
        return (
          <ComposedChart data={cities}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="city" stroke="#6B7280" />
            <YAxis yAxisId="left" tickFormatter={formatCurrency} stroke="#6B7280" />
            <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="sales" fill="#3B82F6" name="Current Sales" />
            <Bar yAxisId="left" dataKey="prediction" fill="#10B981" name="Predicted Sales" />
            <Line yAxisId="right" type="monotone" dataKey="growth" stroke="#EF4444" strokeWidth={3} name="Growth %" />
          </ComposedChart>
        );

      case 'scatter':
        return (
          <ScatterChart data={cities}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="marketSize" tickFormatter={formatLarge} stroke="#6B7280" name="Market Size" />
            <YAxis dataKey="sales" tickFormatter={formatCurrency} stroke="#6B7280" name="Sales" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={<CustomTooltip />}
            />
            <Scatter name="Cities" dataKey="growth" fill="#8884d8">
              {cities.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CITY_COLORS[entry.city as keyof typeof CITY_COLORS]} />
              ))}
            </Scatter>
          </ScatterChart>
        );

      case 'trend':
        return (
          <ComposedChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" stroke="#6B7280" />
            <YAxis stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="pureWhite" stackId="1" stroke="#E5E7EB" fill="#E5E7EB" name="Pure White" />
            <Area type="monotone" dataKey="oceanBlue" stackId="1" stroke="#0077BE" fill="#0077BE" name="Ocean Blue" />
            <Area type="monotone" dataKey="forestGreen" stackId="1" stroke="#228B22" fill="#228B22" name="Forest Green" />
            <Line type="monotone" dataKey="sunsetOrange" stroke="#FF6B35" strokeWidth={3} name="Sunset Orange" />
            <Line type="monotone" dataKey="royalPurple" stroke="#663399" strokeWidth={3} name="Royal Purple" />
          </ComposedChart>
        );

      case 'prediction':
        const predictionData = cities.map(city => ({
          city: city.city,
          current: city.sales,
          predicted: city.prediction,
          growth: ((city.prediction - city.sales) / city.sales * 100).toFixed(1)
        }));

        return (
          <ComposedChart data={predictionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="city" stroke="#6B7280" />
            <YAxis tickFormatter={formatCurrency} stroke="#6B7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="current" fill="#6B7280" name="Current Sales" />
            <Bar dataKey="predicted" fill="#10B981" name="Predicted Sales" />
            <Line type="monotone" dataKey="growth" stroke="#EF4444" strokeWidth={3} name="Growth %" />
          </ComposedChart>
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
      
      {type === 'scatter' && (
        <div className="mt-4 flex justify-center space-x-6">
          {cities.map((city, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: CITY_COLORS[city.city as keyof typeof CITY_COLORS] }}
              ></div>
              <span className="text-sm text-gray-600">{city.city}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAnalyticsChart;