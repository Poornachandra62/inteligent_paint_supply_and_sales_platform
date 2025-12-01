// AI-Powered Business Intelligence Service

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

class IntelligentAdvisorService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_AI_API_URL || '';
  }

  private async makeRequest(messages: AIMessage[]): Promise<AIResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('API configuration missing');
      }

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Paint Business Analytics',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.choices[0].message.content,
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async getBusinessInsights(salesData: any, productData: any): Promise<AIResponse> {
    const prompt = `You are an expert business analyst for a paint retail business in Bengaluru, India. 

Analyze this data and provide 3-4 actionable business insights in a concise, bullet-point format:

Sales Summary:
- Total Revenue: ₹${salesData.totalRevenue?.toLocaleString()}
- Total Orders: ${salesData.totalOrders}
- Average Order Value: ₹${salesData.avgOrderValue?.toFixed(2)}
- Top Products: ${productData.topProducts?.slice(0, 3).map((p: any) => p.name).join(', ')}

Focus on:
1. Revenue optimization opportunities
2. Inventory management suggestions
3. Customer behavior insights
4. Seasonal trends

Keep each insight under 30 words. Be specific and actionable.`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a business intelligence advisor specializing in retail analytics and paint industry insights.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getPredictiveAnalysis(historicalData: any): Promise<AIResponse> {
    const prompt = `Based on this historical sales data from a paint business:

Recent Trends:
- Last 30 days revenue: ₹${historicalData.last30Days?.toLocaleString()}
- Growth rate: ${historicalData.growthRate}%
- Best-selling category: ${historicalData.topCategory}
- Peak sales day: ${historicalData.peakDay}

Provide:
1. A sales forecast for next month (with reasoning)
2. Top 2 products to stock up on
3. One risk/opportunity to watch for

Be specific with numbers and reasoning. Keep response under 150 words.`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a predictive analytics expert helping optimize paint business operations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getCustomerSegmentInsights(customerData: any): Promise<AIResponse> {
    const prompt = `Analyze customer behavior for this paint retail business:

Customer Metrics:
- Total Customers: ${customerData.totalCustomers}
- Repeat Rate: ${customerData.repeatRate}%
- Average Purchase Frequency: ${customerData.avgFrequency} days
- Top Customer Segment: ${customerData.topSegment}

Provide:
1. Customer retention strategy (1-2 sentences)
2. Upselling opportunity (specific recommendation)
3. Marketing focus area

Keep it actionable and brief (under 120 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a customer analytics expert specializing in retail CRM strategies.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getInventoryRecommendations(inventoryData: any): Promise<AIResponse> {
    const prompt = `Analyze inventory for this paint business:

Current Status:
- Low stock items: ${inventoryData.lowStockCount}
- Overstocked items: ${inventoryData.overStockCount}
- Turnover rate: ${inventoryData.turnoverRate} days
- Slow-moving products: ${inventoryData.slowMoving?.slice(0, 2).join(', ')}

Provide:
1. Top 2 inventory actions to take immediately
2. Stock optimization tip
3. Cost-saving opportunity

Be specific and concise (under 100 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an inventory optimization specialist for retail businesses.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getSmartRecommendation(context: string, data: any): Promise<AIResponse> {
    const prompt = `Context: ${context}

Data: ${JSON.stringify(data, null, 2)}

Provide a brief, actionable recommendation (2-3 sentences max).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a business advisor providing quick, actionable recommendations.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async analyzeTrends(trendData: any): Promise<AIResponse> {
    const prompt = `Analyze these business trends:

${JSON.stringify(trendData, null, 2)}

Identify:
1. The most significant trend (and why it matters)
2. One opportunity this trend creates
3. One risk to mitigate

Be concise and specific (under 120 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a trend analyst specializing in retail market intelligence.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getProductBundleSuggestions(productAnalysis: any): Promise<AIResponse> {
    const prompt = `Based on purchase patterns:

Frequently bought together:
${JSON.stringify(productAnalysis, null, 2)}

Suggest:
1. Top 2 product bundles that would sell well
2. Pricing strategy for each bundle
3. Marketing angle

Keep it brief (under 100 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a retail merchandising expert specializing in product bundling strategies.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  // ==================== SALESPERSON AI FEATURES ====================
  
  async getSmartProductRecommendations(context: any): Promise<AIResponse> {
    const prompt = `You're a smart sales assistant for a paint store. Customer is at the counter.

Current situation:
- Customer looking at: ${context.currentProduct || 'Paint products'}
- Customer type: ${context.customerType || 'Walk-in'}
- Season: ${context.season || 'Current'}

Provide:
1. Top 2 product recommendations
2. Brief reason for each (one line)
3. One upsell suggestion

Format as bullet points. Keep very brief (under 80 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a smart sales assistant helping salespeople recommend products to customers.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getUpsellingSuggestions(cartData: any): Promise<AIResponse> {
    const prompt = `Customer's current cart:
${JSON.stringify(cartData, null, 2)}

Suggest:
1. One complementary product (brief reason)
2. One bundle opportunity
3. Estimated additional revenue

Keep it actionable and brief (under 70 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are an upselling expert helping maximize order value while providing customer value.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getDailySalesCoaching(salesData: any): Promise<AIResponse> {
    const prompt = `Salesperson performance today:
- Target: ₹${salesData.target}
- Current: ₹${salesData.current} (${salesData.percentage}%)
- Time: ${salesData.timeOfDay}

Provide:
1. Motivational insight
2. One tactical tip for next sale
3. Product to focus on

Keep it energizing and brief (under 70 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a sales coach providing real-time guidance to help salespeople hit their targets.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  // ==================== DISTRIBUTOR AI FEATURES ====================

  async getRestockingRecommendations(shopData: any): Promise<AIResponse> {
    const prompt = `Shop inventory status:
- Shop: ${shopData.shopName}
- Location: ${shopData.location}
- Low stock items: ${shopData.lowStockCount}
- Top selling: ${shopData.topSelling?.join(', ')}

Provide:
1. Urgent restocking priority (product + quantity)
2. Optimal delivery timing
3. One cost-saving tip

Keep brief (under 80 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a supply chain optimization expert helping distributors manage inventory efficiently.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getShopPerformanceInsights(shopsData: any): Promise<AIResponse> {
    const prompt = `Multiple shop analysis:
${JSON.stringify(shopsData, null, 2)}

Provide:
1. Best performing shop (why?)
2. Shop needing attention (action item)
3. One distribution optimization tip

Keep brief (under 90 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a multi-location retail analyst providing distributor insights.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  async getDemandForecastByLocation(locationData: any): Promise<AIResponse> {
    const prompt = `Location demand data:
- City: ${locationData.city}
- Season: ${locationData.season}
- Upcoming events: ${locationData.events?.join(', ')}
- Historical trend: ${locationData.trend}

Forecast:
1. Expected demand surge (product + percentage)
2. Stock recommendation
3. Timing guidance

Keep brief (under 80 words).`;

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a demand forecasting expert for regional paint distribution.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }

  // ==================== UNIVERSAL AI FEATURES ====================

  async chatWithAI(userQuestion: string, context: any): Promise<AIResponse> {
    const roleContext = context.role || 'general';
    const businessData = context.businessData || {};

    let systemPrompt = '';
    
    if (roleContext === 'owner') {
      systemPrompt = 'You are a business intelligence advisor helping a paint business owner with strategic decisions. Provide data-driven insights, growth strategies, and actionable recommendations. Be concise but thorough.';
    } else if (roleContext === 'salesperson') {
      systemPrompt = 'You are a sales coach helping a paint store salesperson. Provide practical selling tips, product recommendations, and customer handling advice. Be motivational and action-oriented.';
    } else if (roleContext === 'distributor') {
      systemPrompt = 'You are a supply chain expert helping a paint distributor. Provide logistics optimization, inventory management, and delivery route suggestions. Be practical and cost-focused.';
    } else {
      systemPrompt = 'You are an intelligent assistant for a paint business. Provide helpful, practical advice.';
    }

    const contextInfo = Object.keys(businessData).length > 0 
      ? `\n\nBusiness Context:\n${JSON.stringify(businessData, null, 2)}`
      : '';

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userQuestion + contextInfo,
      },
    ];

    return this.makeRequest(messages);
  }

  async matchColorsFromImage(colorData: any, context: any): Promise<AIResponse> {
    const roleContext = context.role || 'general';
    const colors = colorData.dominantColors || [];
    const colorDescriptions = colors.map((c: any, i: number) => 
      `Color ${i + 1}: RGB(${c.r}, ${c.g}, ${c.b}) - ${c.name || 'Unknown'}`
    ).join('\n');

    let prompt = '';
    
    if (roleContext === 'salesperson') {
      prompt = `Customer uploaded a photo. Extracted colors:
${colorDescriptions}

As a paint expert:
1. Identify the closest paint products for each color
2. Suggest which rooms/purposes each color suits
3. Recommend complementary colors
4. Mention any seasonal trends

Keep practical and sales-focused (under 120 words).`;
    } else if (roleContext === 'distributor') {
      prompt = `Analyzing color trends from image:
${colorDescriptions}

As a distribution analyst:
1. Identify popular color trends from these shades
2. Stock recommendations for these color families
3. Regional demand patterns for similar colors

Keep brief (under 100 words).`;
    } else if (roleContext === 'owner') {
      prompt = `Market color analysis from customer image:
${colorDescriptions}

As a business strategist:
1. Market trend insights from these colors
2. Product line recommendations
3. Pricing strategy for these color families

Keep strategic (under 100 words).`;
    } else {
      prompt = `Analyzing paint colors:
${colorDescriptions}

Suggest matching paint products and usage recommendations.`;
    }

    const messages: AIMessage[] = [
      {
        role: 'system',
        content: 'You are a paint color expert with deep knowledge of color matching, trends, and applications.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    return this.makeRequest(messages);
  }
}

export const aiService = new IntelligentAdvisorService();
export type { AIResponse };
