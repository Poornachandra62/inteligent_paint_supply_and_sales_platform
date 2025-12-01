import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader, Sparkles, Palette, Image as ImageIcon } from 'lucide-react';
import { aiService } from '../../services/aiService';

interface ColorPhotoMatchProps {
  role: 'owner' | 'salesperson' | 'distributor';
}

interface ExtractedColor {
  r: number;
  g: number;
  b: number;
  name: string;
  hex: string;
  percentage: number;
}

const ColorPhotoMatch: React.FC<ColorPhotoMatchProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getRoleColor = () => {
    if (role === 'owner') return { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-500' };
    if (role === 'salesperson') return { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-500' };
    if (role === 'distributor') return { from: 'from-green-500', to: 'to-teal-500', bg: 'bg-green-500' };
    return { from: 'from-gray-500', to: 'to-gray-600', bg: 'bg-gray-500' };
  };

  const colors = getRoleColor();

  // Extract colors from image
  const extractColors = (imageUrl: string) => {
    setIsExtracting(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Color quantization - sample every 10th pixel
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < pixels.length; i += 40) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Round to reduce color variations
        const rRound = Math.round(r / 25) * 25;
        const gRound = Math.round(g / 25) * 25;
        const bRound = Math.round(b / 25) * 25;

        const key = `${rRound},${gRound},${bRound}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Get top 5 colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      const totalPixels = sortedColors.reduce((sum, [, count]) => sum + count, 0);

      const extracted: ExtractedColor[] = sortedColors.map(([rgb, count]) => {
        const [r, g, b] = rgb.split(',').map(Number);
        return {
          r,
          g,
          b,
          name: getColorName(r, g, b),
          hex: rgbToHex(r, g, b),
          percentage: Math.round((count / totalPixels) * 100),
        };
      });

      setExtractedColors(extracted);
      setIsExtracting(false);
    };

    img.onerror = () => {
      setIsExtracting(false);
      alert('Failed to load image. Please try another image.');
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const getColorName = (r: number, g: number, b: number): string => {
    // Simple color name detection
    const brightness = (r + g + b) / 3;
    
    if (brightness < 30) return 'Black';
    if (brightness > 225) return 'White';
    
    if (r > g && r > b) {
      if (g > 100 && b < 100) return 'Orange';
      if (b > 100) return 'Purple';
      return 'Red';
    }
    if (g > r && g > b) {
      if (b > 100) return 'Cyan';
      if (r > 100) return 'Yellow';
      return 'Green';
    }
    if (b > r && b > g) {
      if (r > 100) return 'Purple';
      return 'Blue';
    }
    
    return 'Gray';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setSelectedImage(imageUrl);
      setExtractedColors([]);
      setAiAnalysis('');
      extractColors(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (extractedColors.length === 0) return;

    setIsAnalyzing(true);
    try {
      const response = await aiService.matchColorsFromImage(
        {
          dominantColors: extractedColors,
        },
        { role }
      );

      if (response.success && response.data) {
        setAiAnalysis(response.data);
      } else {
        setAiAnalysis('Unable to analyze colors at this time. Please try again.');
      }
    } catch (error) {
      setAiAnalysis('Error analyzing colors. Please try again.');
    }
    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setExtractedColors([]);
    setAiAnalysis('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 left-6 px-6 py-3 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 z-50`}
          title="Color Photo Match"
        >
          <Camera className="w-5 h-5" />
          <span className="font-semibold">Color Match</span>
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/30 shadow-2xl hover:bg-white/95 transition-all duration-300 animate-scale-in">
            {/* Header */}
            <div className={`bg-gradient-to-r ${colors.from} ${colors.to} text-white p-6 rounded-t-2xl flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">AI Color Photo Match</h2>
                  <p className="text-sm opacity-90">Upload a photo to extract and match paint colors</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Upload Area */}
              {!selectedImage && (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-purple-500 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="color-photo-upload"
                  />
                  <label htmlFor="color-photo-upload" className="cursor-pointer">
                    <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload a Photo</h3>
                    <p className="text-gray-600 mb-4">
                      Click to select or drag and drop an image
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, or GIF up to 10MB
                    </p>
                  </label>
                </div>
              )}

              {/* Image Preview & Colors */}
              {selectedImage && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image */}
                  <div>
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Uploaded"
                        className="w-full rounded-xl shadow-lg"
                      />
                      <button
                        onClick={resetAnalysis}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Extracted Colors */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      Extracted Colors
                    </h3>
                    
                    {isExtracting ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader className="w-8 h-8 animate-spin text-purple-500" />
                        <span className="ml-3 text-gray-600">Extracting colors...</span>
                      </div>
                    ) : extractedColors.length > 0 ? (
                      <div className="space-y-3">
                        {extractedColors.map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div
                              className="w-16 h-16 rounded-lg shadow-md border-2 border-white"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800">{color.name}</h4>
                              <p className="text-sm text-gray-600">RGB({color.r}, {color.g}, {color.b})</p>
                              <p className="text-xs text-gray-500">{color.hex} • {color.percentage}%</p>
                            </div>
                          </div>
                        ))}
                        
                        {!aiAnalysis && (
                          <button
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
                            className={`w-full mt-4 py-3 bg-gradient-to-r ${colors.from} ${colors.to} text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50`}
                          >
                            {isAnalyzing ? (
                              <span className="flex items-center justify-center gap-2">
                                <Loader className="w-5 h-5 animate-spin" />
                                Analyzing...
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Get AI Analysis
                              </span>
                            )}
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {aiAnalysis && (
                <div className={`bg-gradient-to-r ${colors.from} ${colors.to} bg-opacity-10 border-2 border-purple-200 rounded-xl p-6`}>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Sparkles className={`w-5 h-5 ${colors.bg.replace('bg-', 'text-')}`} />
                    AI Color Analysis
                  </h3>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiAnalysis}</p>
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="mt-4 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Analyze Another Photo
                  </button>
                </div>
              )}

              {/* Info Section */}
              {!selectedImage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Upload any photo (room, wall, inspiration image)</li>
                    <li>• AI extracts the dominant colors automatically</li>
                    <li>• Get intelligent paint recommendations and insights</li>
                    <li>• Perfect for matching colors or finding complementary shades</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Hidden canvas for color extraction */}
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      )}
    </>
  );
};

export default ColorPhotoMatch;
