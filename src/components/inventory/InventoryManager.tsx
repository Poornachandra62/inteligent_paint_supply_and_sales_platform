import React, { useState } from 'react';
import { Search, Package, Plus, Edit2, Filter, AlertTriangle } from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types';

const InventoryManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterQuality, setFilterQuality] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const brands = [...new Set(mockProducts.map(p => p.brand))];
  const qualities = [...new Set(mockProducts.map(p => p.quality))];

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = 
      product.colorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.colorCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = filterBrand === 'all' || product.brand === filterBrand;
    const matchesQuality = filterQuality === 'all' || product.quality === filterQuality;
    
    return matchesSearch && matchesBrand && matchesQuality;
  });

  const lowStockCount = mockProducts.filter(p => p.quantity < 100).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Inventory Management</h3>
          <p className="text-gray-600">Search and manage paint products</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      {/* Alert for low stock */}
      {lowStockCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <span className="text-orange-800 font-medium">
              {lowStockCount} product{lowStockCount > 1 ? 's' : ''} running low on stock
            </span>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by color name, brand, or color code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={filterQuality}
          onChange={(e) => setFilterQuality(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Qualities</option>
          {qualities.map(quality => (
            <option key={quality} value={quality}>{quality}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white border rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: product.colorCode }}
                  ></div>
                  <div 
                    className="absolute inset-0 w-10 h-10 rounded-full border border-gray-300"
                  style={{ backgroundColor: product.colorCode }}
                  ></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{product.colorName}</h3>
                  <p className="text-sm text-gray-600">{product.colorCode}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Edit2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Brand:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quality:</span>
                <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                  product.quality === 'Premium' ? 'bg-purple-100 text-purple-800' :
                  product.quality === 'Standard' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {product.quality}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Texture:</span>
                <span className="font-medium">{product.texture}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price:</span>
                <span className="font-medium">₹{product.price}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-gray-400" />
                <span className={`text-sm font-medium ${
                  product.quantity < 50 ? 'text-red-600' :
                  product.quantity < 100 ? 'text-orange-600' :
                  'text-green-600'
                }`}>
                  {product.quantity} units
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Batch: {product.batch}
              </div>
            </div>

            {product.quantity < 100 && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded p-2">
                <p className="text-xs text-orange-800">⚠️ Low stock alert</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Product</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Color Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Color Code (e.g., #FF0000)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Brand"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Quality</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
                <option value="Economy">Economy</option>
              </select>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Texture</option>
                <option value="Matte">Matte</option>
                <option value="Gloss">Gloss</option>
                <option value="Satin">Satin</option>
                <option value="Semi-Gloss">Semi-Gloss</option>
              </select>
              <input
                type="number"
                placeholder="Price"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Batch Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Plant Location"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManager;