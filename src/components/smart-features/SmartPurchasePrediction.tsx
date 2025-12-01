import React, { useState, useEffect } from 'react';
import { TrendingUp, ShoppingCart, Zap, Target, Brain, Sparkles } from 'lucide-react';
import { 
  predictNextPurchase, 
  predictForCart,
  getFrequentBundles,
  getPredictionInsights,
  PurchasePrediction 
} from '../../analytics/purchasePrediction';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types';

export const SmartPurchasePrediction: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [prediction, setPrediction] = useState<PurchasePrediction | null>(null);
  const [insights, setInsights] = useState<any>(null);
  const [bundles, setBundles] = useState<any[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [cartPredictions, setCartPredictions] = useState<any[]>([]);

  useEffect(() => {
    const insightsData = getPredictionInsights();
    setInsights(insightsData);
    
    const bundlesData = getFrequentBundles(0.03);
    setBundles(bundlesData);
  }, []);

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      const predictionData = predictNextPurchase(productId);
      setPrediction(predictionData);
    }
  };

  const addToCart = (product: Product) => {
    if (!cart.find(p => p.id === product.id)) {
      const newCart = [...cart, product];
      setCart(newCart);
      
      const predictions = predictForCart(newCart.map(p => p.id));
      setCartPredictions(predictions);
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(p => p.id !== productId);
    setCart(newCart);
    
    if (newCart.length > 0) {
      const predictions = predictForCart(newCart.map(p => p.id));
      setCartPredictions(predictions);
    } else {
      setCartPredictions([]);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'text-green-600 bg-green-100';
    if (confidence >= 0.5) return 'text-blue-600 bg-blue-100';
    if (confidence >= 0.3) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStrengthBadge = (strength: string) => {
    const colors = {
      'Very Strong': 'bg-green-100 text-green-800 border-green-300',
      'Strong': 'bg-blue-100 text-blue-800 border-blue-300',
      'Moderate': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Weak': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[strength as keyof typeof colors] || colors.Weak;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-purple-600 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            Smart Purchase Prediction Engine
          </h1>
          <TrendingUp className="w-12 h-12 text-blue-600 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg">
          AI-Powered recommendations analyzing <span className="font-bold text-purple-600">{insights?.totalPatterns || 0} purchase patterns</span> from your Kaggle dataset
        </p>
      </div>

      {/* Insights Dashboard */}
      {insights && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-8 h-8 text-purple-600" />
              <h3 className="font-bold text-purple-900">Total Patterns</h3>
            </div>
            <p className="text-3xl font-bold text-purple-600">{Math.round(insights.totalPatterns)}</p>
            <p className="text-sm text-purple-700">Discovered associations</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-green-600" />
              <h3 className="font-bold text-green-900">Strong Links</h3>
            </div>
            <p className="text-3xl font-bold text-green-600">{Math.round(insights.strongAssociations)}</p>
            <p className="text-sm text-green-700">&gt;50% confidence</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h3 className="font-bold text-blue-900">Avg Confidence</h3>
            </div>
            <p className="text-3xl font-bold text-blue-600">{Math.round(insights.averageConfidence * 100)}%</p>
            <p className="text-sm text-blue-700">Prediction accuracy</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="w-8 h-8 text-pink-600" />
              <h3 className="font-bold text-pink-900">Top Bundle</h3>
            </div>
            <p className="text-xl font-bold text-pink-600">
              {insights.topBundle ? `${insights.topBundle.frequency}×` : 'N/A'}
            </p>
            <p className="text-sm text-pink-700">Most frequent pair</p>
          </div>
        </div>
      )}

      {/* Product Selector */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-100">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          Select a Product to See Predictions
        </h2>
        <select
          onChange={(e) => handleProductSelect(e.target.value)}
          className="w-full p-4 border-2 border-purple-300 rounded-lg text-lg focus:border-purple-600 focus:outline-none"
        >
          <option value="">Choose a product...</option>
          {mockProducts.slice(0, 50).map(product => (
            <option key={product.id} value={product.id}>
              {product.colorName} - {product.brand} (₹{product.price})
            </option>
          ))}
        </select>
      </div>

      {/* Prediction Results */}
      {prediction && selectedProduct && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-blue-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-xl border-4 border-gray-300 shadow-lg"
                style={{ backgroundColor: selectedProduct.colorCode }}
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedProduct.colorName}
                </h2>
                <p className="text-gray-600">{selectedProduct.brand} • ₹{selectedProduct.price}</p>
              </div>
            </div>
            
            <div className={`px-6 py-3 rounded-full font-bold border-2 ${getStrengthBadge(prediction.predictionStrength)}`}>
              {prediction.predictionStrength} Prediction
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <span className="font-bold">📊 Analysis:</span> Based on {prediction.totalAnalyzedOrders.toLocaleString()} orders, 
              we found {prediction.recommendations.length} products frequently bought with this item.
            </p>
          </div>

          {prediction.recommendations.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Customers Who Bought This Also Bought:
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {prediction.recommendations.map((rec) => (
                  <div 
                    key={rec.productId}
                    className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className="w-16 h-16 rounded-lg border-2 border-gray-300 shadow-md flex-shrink-0"
                        style={{ backgroundColor: rec.colorCode }}
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-800">{rec.colorName}</h4>
                        <p className="text-sm text-gray-600">{rec.brand}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Confidence</p>
                        <p className={`text-xl font-bold ${rec.confidence >= 0.5 ? 'text-green-600' : 'text-blue-600'}`}>
                          {Math.round(rec.confidence * 100)}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Times Bought Together</p>
                        <p className="text-xl font-bold text-purple-600">
                          {rec.coOccurrenceCount}×
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Lift:</span> {rec.lift.toFixed(2)}x
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const product = mockProducts.find(p => p.id === rec.productId);
                          if (product) addToCart(product);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-600">No strong predictions available for this product yet.</p>
              <p className="text-sm text-gray-500 mt-2">More data needed to generate recommendations.</p>
            </div>
          )}
        </div>
      )}

      {/* Shopping Cart Predictions */}
      {cart.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-200">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-purple-600" />
            Your Cart ({cart.length} items)
          </h2>

          <div className="grid md:grid-cols-3 gap-3 mb-6">
            {cart.map(product => (
              <div key={product.id} className="bg-white p-4 rounded-lg flex items-center gap-3 border-2 border-gray-200">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: product.colorCode }}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{product.colorName}</p>
                  <p className="text-xs text-gray-600">{product.brand}</p>
                </div>
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {cartPredictions.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-800">
                🎯 Smart Recommendations for Your Cart
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {cartPredictions.map((rec) => {
                  const product = mockProducts.find(p => p.id === rec.productId);
                  if (!product) return null;

                  return (
                    <div key={rec.productId} className="bg-white p-4 rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-14 h-14 rounded-lg border-2 border-gray-300"
                          style={{ backgroundColor: rec.colorCode }}
                        />
                        <div>
                          <p className="font-bold text-sm">{rec.colorName}</p>
                          <p className="text-xs text-gray-600">{rec.brand}</p>
                        </div>
                      </div>
                      <p className={`text-center font-bold text-lg mb-2 ${getConfidenceColor(rec.confidence)} px-3 py-1 rounded-full`}>
                        {Math.round(rec.confidence * 100)}% Match
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Frequent Bundles */}
      {bundles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-green-600" />
            Frequently Bought Together Bundles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {bundles.slice(0, 6).map((bundle, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-green-800">
                    Bought together {bundle.frequency} times
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {bundle.products.map((product: Product) => (
                    <div key={product.id} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-gray-300"
                        style={{ backgroundColor: product.colorCode }}
                      />
                      <div>
                        <p className="font-semibold">{product.colorName}</p>
                        <p className="text-sm text-gray-600">{product.brand} • ₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t-2 border-green-200">
                  <div>
                    <p className="text-sm text-gray-600">Bundle Value</p>
                    <p className="text-2xl font-bold text-green-600">₹{bundle.totalRevenue}</p>
                  </div>
                  <button
                    onClick={() => {
                      bundle.products.forEach((p: Product) => addToCart(p));
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Add Bundle
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Brain className="w-7 h-7 text-blue-600" />
          How This AI Works
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-bold text-lg mb-2">Market Basket Analysis</h4>
            <p className="text-sm text-gray-700">
              Analyzes your 10,000+ sales transactions to discover which products are frequently purchased together.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">📊</div>
            <h4 className="font-bold text-lg mb-2">Association Rules</h4>
            <p className="text-sm text-gray-700">
              Calculates confidence, lift, and support metrics to determine the strength of product relationships.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-bold text-lg mb-2">Smart Recommendations</h4>
            <p className="text-sm text-gray-700">
              Provides personalized suggestions with probability scores, helping increase average order value by 20-30%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
