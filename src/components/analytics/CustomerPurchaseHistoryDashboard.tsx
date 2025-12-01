import React, { useState, useMemo } from 'react';
import { 
  User, 
  ShoppingBag, 
  DollarSign, 
  Calendar, 
  Palette, 
  Crown,
  Search,
  Filter,
  TrendingUp,
  CreditCard,
  Clock
} from 'lucide-react';
import { analyzeCustomerPurchases, getCustomerSummary, CustomerPurchaseData } from '../../data/customerAnalytics';

const CustomerPurchaseHistoryDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerPurchaseData | null>(null);

  // Get customer data
  const allCustomers = useMemo(() => analyzeCustomerPurchases(), []);
  const customerSummary = useMemo(() => getCustomerSummary(), []);

  // Filter customers based on search and segment
  const filteredCustomers = useMemo(() => {
    let filtered = allCustomers;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(customer => 
        customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerPhone.includes(searchTerm)
      );
    }

    // Segment filter
    if (selectedSegment !== 'all') {
      filtered = filtered.filter(customer => customer.customerType.toLowerCase() === selectedSegment);
    }

    return filtered;
  }, [allCustomers, searchTerm, selectedSegment]);

  // Customer type badge colors
  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Premium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Regular': return 'bg-green-100 text-green-800 border-green-300';
      case 'New': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Dormant': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Purchase Analytics</h1>
        <p className="text-gray-600">Complete customer purchase history and behavioral insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{customerSummary.totalCustomers}</p>
            </div>
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(customerSummary.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Customer Value</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(customerSummary.averageCustomerValue)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-orange-600">{customerSummary.totalOrders}</p>
            </div>
            <ShoppingBag className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Customer Segmentation */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Customer Segmentation</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(customerSummary.customerSegmentation).map(([segment, count]) => (
            <div key={segment} className="text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getCustomerTypeColor(segment.toUpperCase())}`}>
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </div>
              <p className="text-2xl font-bold mt-2">{count}</p>
              <p className="text-sm text-gray-600">{((count / customerSummary.totalCustomers) * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md">
            {/* Search and Filter */}
            <div className="p-6 border-b">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value)}
                  >
                    <option value="all">All Segments</option>
                    <option value="vip">VIP</option>
                    <option value="premium">Premium</option>
                    <option value="regular">Regular</option>
                    <option value="new">New</option>
                    <option value="dormant">Dormant</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Customer List */}
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.customerName}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedCustomer?.customerName === customer.customerName ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{customer.customerName}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getCustomerTypeColor(customer.customerType)}`}>
                          {customer.customerType === 'VIP' && <Crown className="w-3 h-3 mr-1" />}
                          {customer.customerType}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{customer.totalOrders} orders</span>
                        <span>{formatCurrency(customer.totalSpent)}</span>
                        <span>Avg: {formatCurrency(customer.averageOrderValue)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex -space-x-1">
                          {customer.favoriteColors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border-2 border-white"
                              style={{ backgroundColor: color.colorCode }}
                              title={color.colorName}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">Favorite colors</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-white rounded-lg shadow-md">
          {selectedCustomer ? (
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-lg font-semibold">{selectedCustomer.customerName}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getCustomerTypeColor(selectedCustomer.customerType)}`}>
                  {selectedCustomer.customerType === 'VIP' && <Crown className="w-3 h-3 mr-1" />}
                  {selectedCustomer.customerType}
                </span>
              </div>

              {/* Key Metrics */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Spent</span>
                  <span className="font-semibold text-green-600">{formatCurrency(selectedCustomer.totalSpent)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Orders</span>
                  <span className="font-semibold">{selectedCustomer.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Order Value</span>
                  <span className="font-semibold">{formatCurrency(selectedCustomer.averageOrderValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Purchase Frequency</span>
                  <span className="font-semibold">{selectedCustomer.purchaseFrequency.toFixed(0)} days</span>
                </div>
              </div>

              {/* Purchase Timeline */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Purchase Timeline
                </h4>
                <div className="text-sm">
                  <p className="text-gray-600">First Purchase: {formatDate(selectedCustomer.firstPurchase)}</p>
                  <p className="text-gray-600">Last Purchase: {formatDate(selectedCustomer.lastPurchase)}</p>
                </div>
              </div>

              {/* Favorite Colors */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Favorite Colors
                </h4>
                <div className="space-y-2">
                  {selectedCustomer.favoriteColors.slice(0, 3).map((color, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: color.colorCode }}
                        />
                        <span className="text-sm">{color.colorName}</span>
                      </div>
                      <span className="text-sm font-medium">{color.purchases}x</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Preference */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Preference
                </h4>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  {selectedCustomer.paymentPreference === 'cash' ? '💵 Cash' : 
                   selectedCustomer.paymentPreference === 'online' ? '💳 Online' : '🔄 Mixed'}
                </span>
              </div>

              {/* Recent Orders */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Orders
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedCustomer.orderHistory.slice(0, 5).map((order, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{formatDate(order.timestamp)}</span>
                      <span className="font-medium">{formatCurrency(order.grandTotal)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a customer to view detailed purchase history</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerPurchaseHistoryDashboard;
