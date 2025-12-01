import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Trash2, 
  Receipt,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { Product, OrderItem, Order } from '../../types';
import { ProductClass } from '../../classes/Product';
import { OrderClass } from '../../classes/Order';
import { SalesPersonClass } from '../../classes/SalesPerson';

const POSSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentOrder, setCurrentOrder] = useState<OrderClass>(
    new OrderClass(`ORDER-${Date.now()}`, '2', 'shop1')
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderClass | null>(null);

  // Mock salesperson for demonstration
  const salesperson = new SalesPersonClass(
    'EMP001',
    'sales1',
    'password',
    'Priya Sharma',
    '+91-9876543211',
    'shop1',
    '2'
  );

  const filteredProducts = mockProducts.filter(product =>
    product.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.colorCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    // Convert Product interface to ProductClass
    const productClass = new ProductClass(
      product.colorName,
      product.colorCode,
      product.manufacturedDate,
      product.expiryDate,
      product.quantity,
      product.price,
      product.quality,
      product.texture,
      product.batch,
      product.plant,
      product.brand,
      product.id
    );
    
    currentOrder.addProduct(productClass, 1);
    // Force re-render by creating new order instance
    setCurrentOrder(new OrderClass(
      currentOrder.id,
      currentOrder.salespersonId,
      currentOrder.shopId,
      currentOrder.paymentMethod,
      currentOrder.customerName,
      currentOrder.customerPhone
    ));
    // Copy products list
    currentOrder.productsList.forEach(item => {
      setCurrentOrder(prev => {
        prev.addProduct(item.product, item.quantity);
        return prev;
      });
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    currentOrder.updateProductQuantity(productId, quantity);
    setCurrentOrder({ ...currentOrder });
  };

  const removeFromCart = (productId: string) => {
    currentOrder.removeProduct(productId);
    setCurrentOrder({ ...currentOrder });
  };

  const processOrder = () => {
    if (currentOrder.isEmpty()) return;

    // Update order details
    currentOrder.paymentMethod = paymentMethod;
    currentOrder.customerName = customerName || undefined;
    currentOrder.customerPhone = customerPhone || undefined;

    // Generate bill using SalesPerson class
    const bill = salesperson.createBill(currentOrder);
    console.log('Generated Bill:', bill);

    setCompletedOrder(currentOrder);
    setShowReceipt(true);
    
    // Reset for new order
    setCurrentOrder(new OrderClass(`ORDER-${Date.now()}`, '2', 'shop1'));
    setCustomerName('');
    setCustomerPhone('');
  };

  if (showReceipt && completedOrder) {
    return (
      <div className="max-w-md mx-auto bg-white border rounded-lg p-6">
        <div className="text-center mb-6">
          <Receipt className="h-8 w-8 mx-auto text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold text-gray-900">Receipt</h2>
          <p className="text-gray-600">ChromaVerse</p>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span>Order #:</span>
            <span className="font-medium">{completedOrder.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Date:</span>
            <span>{new Date(completedOrder.timestamp).toLocaleString()}</span>
          </div>
          {completedOrder.customerName && (
            <div className="flex justify-between text-sm">
              <span>Customer:</span>
              <span>{completedOrder.customerName}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mb-4">
          {completedOrder.productsList.map((item) => (
            <div key={item.product.id} className="flex justify-between items-center py-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product.colorName}</p>
                <p className="text-sm text-gray-600">{item.product.brand} • Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{completedOrder.getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>₹{completedOrder.saleTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{completedOrder.getGrandTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payment:</span>
            <span className="capitalize">{completedOrder.paymentMethod}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setShowReceipt(false);
            setCompletedOrder(null);
          }}
          className="w-full mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          New Transaction
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Product Search */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by color, brand, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              {/* Add paint color preview */}
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                        style={{ backgroundColor: product.colorCode }}
                      ></div>
                      <div 
                        className="absolute inset-0 w-8 h-8 rounded-full border border-gray-300"
                      style={{ backgroundColor: product.colorCode }}
                      ></div>
                    </div>
                    <h3 className="font-medium text-gray-900">{product.colorName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.quality === 'Premium' ? 'bg-purple-100 text-purple-800' :
                      product.quality === 'Standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {product.quality}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{product.brand} • {product.texture}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    <span className={`text-sm ${product.quantity < 50 ? 'text-orange-600' : 'text-green-600'}`}>
                      {product.quantity} in stock
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.quantity === 0}
                  className="ml-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shopping Cart */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Shopping Cart</h3>
          <ShoppingCart className="h-5 w-5 text-gray-400" />
        </div>

        {currentOrder.isEmpty() ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Cart is empty</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {currentOrder.productsList.map((item) => (
                <div key={item.product.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{item.product.colorName}</h4>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="bg-gray-100 text-gray-600 p-1 rounded"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="bg-gray-100 text-gray-600 p-1 rounded"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Information */}
            <div className="border-t pt-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Customer Information (Optional)</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t pt-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                    paymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-center justify-center p-3 border rounded-lg transition-colors ${
                    paymentMethod === 'online'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Online
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{currentOrder.getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%):</span>
                <span>₹{currentOrder.saleTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₹{currentOrder.getGrandTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={processOrder}
              className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Process Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default POSSystem;