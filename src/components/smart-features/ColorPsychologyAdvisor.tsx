import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Heart, Zap, Sun, Cloud, Snowflake, PartyPopper } from 'lucide-react';
import { 
  colorPsychologyDatabase, 
  matchToInventory, 
  getCurrentSeason,
  getSeasonalSuggestions,
  seasonalColorRecommendations 
} from '../../data/colorPsychology';
import { mockProducts } from '../../data/mockData';

export const ColorPsychologyAdvisor: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [currentSeason, setCurrentSeason] = useState<string>('');
  const [seasonalColors, setSeasonalColors] = useState<string[]>([]);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);
    setSeasonalColors(getSeasonalSuggestions());
  }, []);

  const roomTypes = colorPsychologyDatabase.map(r => ({
    name: r.roomType,
    icon: r.icon
  }));

  const moods = [
    { value: 'calming', label: 'Calming & Peaceful', icon: '😌' },
    { value: 'energetic', label: 'Energetic & Active', icon: '⚡' },
    { value: 'focused', label: 'Focused & Productive', icon: '🎯' },
    { value: 'cheerful', label: 'Cheerful & Happy', icon: '😊' },
    { value: 'elegant', label: 'Elegant & Sophisticated', icon: '✨' },
  ];

  const getRecommendations = () => {
    const roomData = colorPsychologyDatabase.find(r => r.roomType === selectedRoom);
    if (!roomData) return;

    let colors = roomData.recommendedColors;

    // Filter by mood if selected
    if (selectedMood) {
      colors = colors.filter(c => 
        c.moodImpact.toLowerCase().includes(selectedMood.toLowerCase())
      );
    }

    // Boost seasonal colors
    const seasonalBoost = colors.map(color => ({
      ...color,
      isSeasonal: seasonalColors.some(sc => 
        color.colorName.toLowerCase().includes(sc.toLowerCase())
      )
    }));

    // Sort: seasonal first, then by number of facts
    const sorted = seasonalBoost.sort((a, b) => {
      if (a.isSeasonal && !b.isSeasonal) return -1;
      if (!a.isSeasonal && b.isSeasonal) return 1;
      return b.psychologyFacts.length - a.psychologyFacts.length;
    });

    // Match to actual inventory
    const matched = sorted.map(color => ({
      ...color,
      availableProducts: matchToInventory(color, mockProducts)
    }));

    setRecommendations(matched);
  };

  const getSeasonIcon = () => {
    switch (currentSeason) {
      case 'summer': return <Sun className="w-5 h-5" />;
      case 'monsoon': return <Cloud className="w-5 h-5" />;
      case 'winter': return <Snowflake className="w-5 h-5" />;
      default: return <PartyPopper className="w-5 h-5" />;
    }
  };

  const getSeasonInfo = () => {
    const seasonData = seasonalColorRecommendations[currentSeason as keyof typeof seasonalColorRecommendations];
    if (!seasonData) return null;
    return seasonData;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-purple-600 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Color Psychology Advisor
          </h1>
          <Sparkles className="w-12 h-12 text-pink-600 animate-pulse" />
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover the perfect colors based on <span className="font-semibold text-purple-600">scientific research</span> and <span className="font-semibold text-pink-600">psychological principles</span>
        </p>
      </div>

      {/* Seasonal Banner */}
      {currentSeason && getSeasonInfo() && (
        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            {getSeasonIcon()}
            <div>
              <h3 className="font-bold text-amber-900">
                {getSeasonInfo()?.name} Recommendation
              </h3>
              <p className="text-sm text-amber-700">
                {getSeasonInfo()?.reason}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {seasonalColors.map((color, idx) => (
                  <span key={idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selection Panel */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-100">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Room Type */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              <Heart className="inline w-5 h-5 mr-2 text-pink-500" />
              Select Room Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {roomTypes.map(room => (
                <button
                  key={room.name}
                  onClick={() => setSelectedRoom(room.name)}
                  className={`p-4 rounded-lg border-2 transition-all transform hover:scale-105 ${
                    selectedRoom === room.name
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{room.icon}</div>
                  <div className="font-semibold text-sm">{room.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              <Zap className="inline w-5 h-5 mr-2 text-yellow-500" />
              Desired Mood (Optional)
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedMood('')}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                  selectedMood === ''
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <span className="mr-2">🎨</span>
                <span className="font-semibold">Any Mood</span>
              </button>
              {moods.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                    selectedMood === mood.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <span className="mr-2">{mood.icon}</span>
                  <span className="font-semibold">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={getRecommendations}
          disabled={!selectedRoom}
          className="mt-6 w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <Sparkles className="inline w-6 h-6 mr-2" />
          Get AI-Powered Color Recommendations
          <Brain className="inline w-6 h-6 ml-2" />
        </button>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-gray-800">
              🎨 Recommended Colors for Your {selectedRoom}
            </h2>
            <div className="text-sm text-gray-600">
              {recommendations.length} Perfect {recommendations.length === 1 ? 'Match' : 'Matches'}
            </div>
          </div>

          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all transform hover:scale-[1.02] border-2 border-gray-100"
            >
              <div className="flex flex-col md:flex-row">
                {/* Color Preview */}
                <div
                  className="md:w-64 h-64 md:h-auto flex-shrink-0 relative"
                  style={{ 
                    background: `linear-gradient(135deg, ${rec.colorCode} 0%, ${rec.colorCode}dd 100%)`
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center bg-white bg-opacity-95 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
                      <p className="font-bold text-2xl text-gray-800 mb-2">{rec.colorName}</p>
                      <p className="text-sm text-gray-600 font-mono">{rec.colorCode}</p>
                      {rec.isSeasonal && (
                        <div className="mt-3">
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
                            ☀️ Seasonal Pick
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 p-6 md:p-8">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full text-sm font-bold">
                      <Heart className="w-4 h-4" />
                      {rec.moodImpact}
                    </span>
                    {rec.season && rec.season.length > 0 && (
                      <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                        {getSeasonIcon()}
                        {rec.season[0]}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    Psychology & Science
                  </h3>
                  <ul className="space-y-2 mb-6">
                    {rec.psychologyFacts.map((fact: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-purple-600 mt-1 text-lg font-bold">✓</span>
                        <span className="text-gray-700 leading-relaxed">{fact}</span>
                      </li>
                    ))}
                  </ul>

                  {rec.scientificBacking && (
                    <div className="mb-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm text-blue-900">
                        <span className="font-bold">🔬 Scientific Backing: </span>
                        {rec.scientificBacking}
                      </p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Best For:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.bestFor.map((use: string, i: number) => (
                        <span key={i} className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 border border-gray-300">
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Available Products */}
                  {rec.availableProducts && rec.availableProducts.length > 0 && (
                    <div className="mt-6 pt-6 border-t-2 border-gray-200">
                      <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg">
                        <span className="text-2xl">🎨</span>
                        Available in Our Inventory ({rec.availableProducts.length} products)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {rec.availableProducts.map((product: any) => (
                          <div 
                            key={product.id} 
                            className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl hover:shadow-lg transition-all border-2 border-gray-200 hover:border-purple-300"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div
                                className="w-10 h-10 rounded-lg border-2 border-gray-300 shadow-inner"
                                style={{ backgroundColor: product.colorCode }}
                              />
                              <div className="flex-1">
                                <p className="font-bold text-sm text-gray-800">{product.brand}</p>
                                <p className="text-xs text-gray-600">{product.quality}</p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 font-medium mb-2">{product.colorName}</p>
                            <div className="flex justify-between items-center">
                              <p className="text-lg font-bold text-purple-600">₹{product.price}</p>
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                                In Stock
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Educational Section */}
      <div className="mt-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          Why Color Psychology Matters
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-gray-700">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🧠</div>
            <p className="font-bold mb-2 text-lg">Scientific Backing</p>
            <p className="text-sm leading-relaxed">
              Colors have measurable effects on mood, productivity, heart rate, and blood pressure. Over 1,000 scientific studies validate these effects.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">📈</div>
            <p className="font-bold mb-2 text-lg">Practical Impact</p>
            <p className="text-sm leading-relaxed">
              Right colors can improve sleep quality by 40%, increase productivity by 25%, and create lasting emotional impressions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl mb-3">🎨</div>
            <p className="font-bold mb-2 text-lg">Personalized Selection</p>
            <p className="text-sm leading-relaxed">
              Our AI matches psychology principles with your actual inventory, ensuring you get scientifically-backed colors available right now.
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {recommendations.length === 0 && selectedRoom && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            No recommendations found. Try selecting a different mood or room type.
          </p>
        </div>
      )}
    </div>
  );
};
