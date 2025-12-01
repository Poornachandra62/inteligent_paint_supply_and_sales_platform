import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { CustomerPurchaseData } from '../../data/customerAnalytics';

interface CustomerPurchaseChartProps {
  customers: CustomerPurchaseData[];
}

const CustomerPurchaseChart: React.FC<CustomerPurchaseChartProps> = ({ customers }) => {
  // Prepare data for monthly purchase trends
  const monthlyData = React.useMemo(() => {
    const monthMap: { [key: string]: { orders: number; revenue: number } } = {};
    
    customers.forEach(customer => {
      customer.seasonalTrends.forEach(trend => {
        if (!monthMap[trend.month]) {
          monthMap[trend.month] = { orders: 0, revenue: 0 };
        }
        monthMap[trend.month].orders += trend.orders;
        monthMap[trend.month].revenue += trend.totalSpent;
      });
    });

    return Object.entries(monthMap)
      .map(([month, data]) => ({
        month,
        orders: data.orders,
        revenue: data.revenue
      }))
      .sort((a, b) => {
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
      });
  }, [customers]);

  // Customer segmentation data for pie chart
  const segmentationData = React.useMemo(() => {
    const segments = customers.reduce((acc, customer) => {
      acc[customer.customerType] = (acc[customer.customerType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(segments).map(([type, count]) => ({
      name: type,
      value: count,
      percentage: ((count / customers.length) * 100).toFixed(1)
    }));
  }, [customers]);

  // Top customers by revenue
  const topCustomersData = React.useMemo(() => {
    return customers
      .slice(0, 10)
      .map(customer => ({
        name: customer.customerName.length > 15 
          ? customer.customerName.substring(0, 12) + '...' 
          : customer.customerName,
        revenue: customer.totalSpent,
        orders: customer.totalOrders
      }));
  }, [customers]);

  // Color palettes
  const SEGMENT_COLORS = {
    'VIP': '#8B5CF6',
    'Premium': '#3B82F6', 
    'Regular': '#10B981',
    'New': '#F59E0B',
    'Dormant': '#EF4444'
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey === 'revenue' 
                ? `Revenue: ${formatCurrency(entry.value)}` 
                : `${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Monthly Purchase Trends */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Purchase Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="Orders" />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segmentation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Segmentation</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} (${entry.percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {segmentationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEGMENT_COLORS[entry.name as keyof typeof SEGMENT_COLORS] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers by Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Top Customers by Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topCustomersData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Purchase Frequency Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Purchase Frequency Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={customers.map(c => ({
              name: c.customerName.length > 10 ? c.customerName.substring(0, 8) + '..' : c.customerName,
              frequency: Math.round(c.purchaseFrequency),
              totalOrders: c.totalOrders
            })).slice(0, 15)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: number, name: string) => 
                  name === 'frequency' ? [`${value} days`, 'Avg. Days Between Purchases'] : [value, 'Total Orders']
                }
              />
              <Legend />
              <Bar dataKey="frequency" fill="#F59E0B" name="Purchase Frequency (days)" />
              <Bar dataKey="totalOrders" fill="#10B981" name="Total Orders" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CustomerPurchaseChart;
