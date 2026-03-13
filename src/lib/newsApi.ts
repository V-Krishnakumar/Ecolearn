// News API service for real-time environmental news
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: string;
  imageUrl?: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
}

// Using NewsAPI.org (free tier: 100 requests/day)
const NEWS_API_KEY = 'a3c1dd522cd04291a65cea0d2c20b73e';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Fallback news data when API is not available
const FALLBACK_NEWS_EN: NewsArticle[] = [
  {
    id: '1',
    title: 'Solar Energy Breakthrough: New Efficiency Record Set',
    description: 'Scientists achieve 47.1% efficiency in solar panel technology, promising cheaper renewable energy.',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'EcoTech News',
    category: 'Renewable Energy',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'Ocean Cleanup Project Removes 100,000kg of Plastic',
    description: 'Major milestone reached in Pacific Garbage Patch cleanup initiative.',
    url: '#',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: 'Ocean Conservation',
    category: 'Ocean Conservation',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'Climate Change: New Carbon Capture Technology',
    description: 'Revolutionary method removes CO2 from atmosphere 10x more efficiently.',
    url: '#',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: 'Climate Science',
    category: 'Climate Action',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de6e4f3e8e8b?w=300&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'Biodiversity: New Species Discovered in Amazon',
    description: 'Scientists find 20 new species in previously unexplored rainforest area.',
    url: '#',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    source: 'Nature Research',
    category: 'Biodiversity',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'Wind Energy: Floating Turbines Set New Record',
    description: 'Offshore wind farms generate 50% more power than expected.',
    url: '#',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    source: 'Renewable Energy Today',
    category: 'Renewable Energy',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop'
  }
];

// Hindi translations of fallback news
const FALLBACK_NEWS_HI: NewsArticle[] = [
  {
    id: '1',
    title: 'सौर ऊर्जा में सफलता: नई दक्षता रिकॉर्ड स्थापित',
    description: 'वैज्ञानिकों ने सौर पैनल तकनीक में 47.1% दक्षता हासिल की, जो सस्ती नवीकरणीय ऊर्जा का वादा करती है।',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'EcoTech News',
    category: 'नवीकरणीय ऊर्जा',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'समुद्री सफाई परियोजना ने 100,000 किलो प्लास्टिक हटाया',
    description: 'प्रशांत कचरा पैच सफाई पहल में बड़ी उपलब्धि हासिल की।',
    url: '#',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: 'Ocean Conservation',
    category: 'समुद्री संरक्षण',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'जलवायु परिवर्तन: नई कार्बन कैप्चर तकनीक',
    description: 'क्रांतिकारी विधि वायुमंडल से CO2 को 10 गुना अधिक कुशलता से हटाती है।',
    url: '#',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: 'Climate Science',
    category: 'जलवायु कार्य',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de6e4f3e8e8b?w=300&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'जैव विविधता: अमेज़न में नई प्रजातियां खोजी गईं',
    description: 'वैज्ञानिकों ने पहले से अनछुए वर्षावन क्षेत्र में 20 नई प्रजातियां खोजी हैं।',
    url: '#',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    source: 'Nature Research',
    category: 'जैव विविधता',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'पवन ऊर्जा: तैरते टर्बाइन ने नया रिकॉर्ड बनाया',
    description: 'ऑफशोर पवन फार्म अपेक्षा से 50% अधिक बिजली उत्पन्न करते हैं।',
    url: '#',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    source: 'Renewable Energy Today',
    category: 'नवीकरणीय ऊर्जा',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop'
  }
];

// Punjabi translations of fallback news
const FALLBACK_NEWS_PA: NewsArticle[] = [
  {
    id: '1',
    title: 'ਸੂਰਜੀ ਊਰਜਾ ਵਿੱਚ ਸਫਲਤਾ: ਨਵਾਂ ਦੱਖਤਾ ਰਿਕਾਰਡ ਸਥਾਪਿਤ',
    description: 'ਵਿਗਿਆਨੀਆਂ ਨੇ ਸੂਰਜੀ ਪੈਨਲ ਤਕਨਾਲੋਜੀ ਵਿੱਚ 47.1% ਦੱਖਤਾ ਹਾਸਿਲ ਕੀਤਾ, ਜੋ ਸਸਤੀ ਨਵੀਕਰਣਯੋਗ ਊਰਜਾ ਦਾ ਵਾਅਦਾ ਕਰਦੀ ਹੈ।',
    url: '#',
    publishedAt: new Date().toISOString(),
    source: 'EcoTech News',
    category: 'ਨਵੀਕਰਣਯੋਗ ਊਰਜਾ',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=300&h=200&fit=crop'
  },
  {
    id: '2',
    title: 'ਸਮੁੰਦਰੀ ਸਫਾਈ ਪ੍ਰੋਜੈਕਟ ਨੇ 100,000 ਕਿਲੋ ਪਲਾਸਟਿਕ ਹਟਾਇਆ',
    description: 'ਪ੍ਰਸ਼ਾਂਤ ਕੂੜਾ ਪੈਚ ਸਫਾਈ ਪਹਿਲ ਵਿੱਚ ਵੱਡੀ ਉਪਲਬਧੀ ਹਾਸਿਲ ਕੀਤੀ।',
    url: '#',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    source: 'Ocean Conservation',
    category: 'ਸਮੁੰਦਰੀ ਸੰਭਾਲ',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop'
  },
  {
    id: '3',
    title: 'ਜਲਵਾਯੂ ਪਰਿਵਰਤਨ: ਨਵੀਂ ਕਾਰਬਨ ਕੈਪਚਰ ਤਕਨਾਲੋਜੀ',
    description: 'ਕ੍ਰਾਂਤੀਕਾਰੀ ਵਿਧੀ ਵਾਯੂਮੰਡਲ ਤੋਂ CO2 ਨੂੰ 10 ਗੁਣਾ ਵਧੇਰੇ ਕੁਸ਼ਲਤਾ ਨਾਲ ਹਟਾਉਂਦੀ ਹੈ।',
    url: '#',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    source: 'Climate Science',
    category: 'ਜਲਵਾਯੂ ਕਾਰਵਾਈ',
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de6e4f3e8e8b?w=300&h=200&fit=crop'
  },
  {
    id: '4',
    title: 'ਜੈਵਿਕ ਵਿਭਿੰਨਤਾ: ਅਮੇਜ਼ਨ ਵਿੱਚ ਨਵੀਆਂ ਪ੍ਰਜਾਤੀਆਂ ਖੋਜੀਆਂ ਗਈਆਂ',
    description: 'ਵਿਗਿਆਨੀਆਂ ਨੇ ਪਹਿਲਾਂ ਤੋਂ ਅਨਛੁਏ ਵਰਸਾਵਨ ਖੇਤਰ ਵਿੱਚ 20 ਨਵੀਆਂ ਪ੍ਰਜਾਤੀਆਂ ਖੋਜੀਆਂ ਹਨ।',
    url: '#',
    publishedAt: new Date(Date.now() - 259200000).toISOString(),
    source: 'Nature Research',
    category: 'ਜੈਵਿਕ ਵਿਭਿੰਨਤਾ',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop'
  },
  {
    id: '5',
    title: 'ਹਵਾ ਊਰਜਾ: ਤੈਰਦੇ ਟਰਬਾਈਨ ਨੇ ਨਵਾਂ ਰਿਕਾਰਡ ਬਣਾਇਆ',
    description: 'ਆਫਸ਼ੋਰ ਹਵਾ ਫਾਰਮ ਉਮੀਦ ਤੋਂ 50% ਵਧੇਰੇ ਬਿਜਲੀ ਪੈਦਾ ਕਰਦੇ ਹਨ।',
    url: '#',
    publishedAt: new Date(Date.now() - 345600000).toISOString(),
    source: 'Renewable Energy Today',
    category: 'ਨਵੀਕਰਣਯੋਗ ਊਰਜਾ',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=300&h=200&fit=crop'
  }
];

// Environmental facts data
export const ENVIRONMENTAL_FACTS = {
  en: [
    "A single tree can absorb 22kg of CO2 per year",
    "Bees pollinate 70% of the world's most important crops",
    "Recycling one aluminum can saves enough energy to run a TV for 3 hours",
    "The ocean produces 70% of the world's oxygen",
    "A reusable water bottle can save 156 plastic bottles per year",
    "Solar energy could power the entire world in just 6 hours",
    "Forests cover 31% of the world's land area",
    "The Great Barrier Reef is visible from space",
    "Wind energy is the fastest-growing renewable energy source",
    "A single wind turbine can power 500 homes"
  ],
  hi: [
    "एक पेड़ साल में 22 किलो CO2 अवशोषित कर सकता है",
    "मधुमक्खियां दुनिया की 70% सबसे महत्वपूर्ण फसलों का परागण करती हैं",
    "एक एल्यूमीनियम कैन को रीसायकल करने से 3 घंटे तक टीवी चलाने के लिए पर्याप्त ऊर्जा बचती है",
    "समुद्र दुनिया के 70% ऑक्सीजन का उत्पादन करता है",
    "एक पुन: प्रयोज्य पानी की बोतल साल में 156 प्लास्टिक की बोतलें बचा सकती है",
    "सौर ऊर्जा सिर्फ 6 घंटे में पूरी दुनिया को बिजली दे सकती है",
    "जंगल दुनिया के 31% भूमि क्षेत्र को कवर करते हैं",
    "ग्रेट बैरियर रीफ अंतरिक्ष से दिखाई देती है",
    "पवन ऊर्जा सबसे तेजी से बढ़ने वाला नवीकरणीय ऊर्जा स्रोत है",
    "एक पवन टर्बाइन 500 घरों को बिजली दे सकता है"
  ],
  pa: [
    "ਇੱਕ ਪੇੜ ਸਾਲ ਵਿੱਚ 22 ਕਿਲੋ CO2 ਸੋਖ ਸਕਦਾ ਹੈ",
    "ਮਧੂਮੱਖੀਆਂ ਦੁਨੀਆ ਦੇ 70% ਸਭ ਤੋਂ ਮਹੱਤਵਪੂਰਨ ਫਸਲਾਂ ਦਾ ਪਰਾਗਣ ਕਰਦੀਆਂ ਹਨ",
    "ਇੱਕ ਐਲੂਮੀਨੀਅਮ ਕੈਨ ਨੂੰ ਰੀਸਾਈਕਲ ਕਰਨ ਨਾਲ 3 ਘੰਟੇ ਟੀਵੀ ਚਲਾਉਣ ਲਈ ਕਾਫ਼ੀ ਊਰਜਾ ਬਚਦੀ ਹੈ",
    "ਸਮੁੰਦਰ ਦੁਨੀਆ ਦੇ 70% ਆਕਸੀਜਨ ਦਾ ਉਤਪਾਦਨ ਕਰਦਾ ਹੈ",
    "ਇੱਕ ਦੁਬਾਰਾ ਵਰਤੋਂ ਵਾਲੀ ਪਾਣੀ ਦੀ ਬੋਤਲ ਸਾਲ ਵਿੱਚ 156 ਪਲਾਸਟਿਕ ਬੋਤਲਾਂ ਬਚਾ ਸਕਦੀ ਹੈ",
    "ਸੂਰਜੀ ਊਰਜਾ ਸਿਰਫ਼ 6 ਘੰਟਿਆਂ ਵਿੱਚ ਪੂਰੀ ਦੁਨੀਆ ਨੂੰ ਬਿਜਲੀ ਦੇ ਸਕਦੀ ਹੈ",
    "ਜੰਗਲ ਦੁਨੀਆ ਦੇ 31% ਭੂਮੀ ਖੇਤਰ ਨੂੰ ਕਵਰ ਕਰਦੇ ਹਨ",
    "ਗ੍ਰੇਟ ਬੈਰੀਅਰ ਰੀਫ਼ ਸਪੇਸ ਤੋਂ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ",
    "ਹਵਾ ਊਰਜਾ ਸਭ ਤੋਂ ਤੇਜ਼ੀ ਨਾਲ ਵਧਣ ਵਾਲਾ ਨਵੀਕਰਣਯੋਗ ਊਰਜਾ ਸਰੋਤ ਹੈ",
    "ਇੱਕ ਹਵਾ ਟਰਬਾਈਨ 500 ਘਰਾਂ ਨੂੰ ਬਿਜਲੀ ਦੇ ਸਕਦਾ ਹੈ"
  ]
};

// Daily tips data
export const DAILY_TIPS = {
  en: [
    "Use a reusable water bottle instead of plastic",
    "Turn off lights when leaving a room",
    "Walk or bike for short trips",
    "Use energy-efficient LED bulbs",
    "Reduce meat consumption by one meal per week",
    "Plant a tree or start a small garden",
    "Use public transportation when possible",
    "Buy local and seasonal produce",
    "Fix leaks in your home to save water",
    "Compost your food scraps"
  ],
  hi: [
    "प्लास्टिक के बजाय पुन: प्रयोज्य पानी की बोतल का उपयोग करें",
    "कमरा छोड़ते समय लाइट बंद कर दें",
    "छोटी यात्राओं के लिए पैदल चलें या साइकिल चलाएं",
    "ऊर्जा कुशल LED बल्ब का उपयोग करें",
    "सप्ताह में एक भोजन मांस की खपत कम करें",
    "एक पेड़ लगाएं या छोटा बगीचा शुरू करें",
    "जब भी संभव हो सार्वजनिक परिवहन का उपयोग करें",
    "स्थानीय और मौसमी उत्पाद खरीदें",
    "पानी बचाने के लिए अपने घर में रिसाव ठीक करें",
    "अपने खाद्य स्क्रैप को कंपोस्ट करें"
  ],
  pa: [
    "ਪਲਾਸਟਿਕ ਦੀ ਬਜਾਏ ਦੁਬਾਰਾ ਵਰਤੋਂ ਵਾਲੀ ਪਾਣੀ ਦੀ ਬੋਤਲ ਵਰਤੋ",
    "ਕਮਰਾ ਛੱਡਦੇ ਸਮੇਂ ਲਾਈਟ ਬੰਦ ਕਰ ਦਿਓ",
    "ਛੋਟੀਆਂ ਯਾਤਰਾਵਾਂ ਲਈ ਪੈਦਲ ਚਲੋ ਜਾਂ ਸਾਈਕਲ ਚਲਾਓ",
    "ਊਰਜਾ ਕੁਸ਼ਲ LED ਬਲਬ ਵਰਤੋ",
    "ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਭੋਜਨ ਮਾਸ ਦੀ ਖਪਤ ਘਟਾਓ",
    "ਇੱਕ ਪੇੜ ਲਗਾਓ ਜਾਂ ਛੋਟਾ ਬਾਗ਼ ਸ਼ੁਰੂ ਕਰੋ",
    "ਜਦੋਂ ਵੀ ਸੰਭਵ ਹੋਵੇ ਜਨਤਕ ਆਵਾਜਾਈ ਵਰਤੋ",
    "ਸਥਾਨੀ ਅਤੇ ਮੌਸਮੀ ਉਤਪਾਦ ਖਰੀਦੋ",
    "ਪਾਣੀ ਬਚਾਉਣ ਲਈ ਆਪਣੇ ਘਰ ਵਿੱਚ ਰਿਸਾਵ ਠੀਕ ਕਰੋ",
    "ਆਪਣੇ ਖਾਣੇ ਦੇ ਸਕ੍ਰੈਪ ਨੂੰ ਕੰਪੋਸਟ ਕਰੋ"
  ]
};

export class NewsService {
  private static instance: NewsService;
  private cache: Map<string, { data: NewsArticle[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService();
    }
    return NewsService.instance;
  }

  async getEnvironmentalNews(language: 'en' | 'hi' | 'pa' = 'en'): Promise<NewsArticle[]> {
    const cacheKey = `environmental_news_${language}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Fetch from NewsAPI (strictly in English as requested)
      const response = await fetch(
        `${NEWS_API_BASE_URL}/everything?q=environment OR climate OR "renewable energy" OR sustainability&language=en&sortBy=publishedAt&pageSize=15&apiKey=${NEWS_API_KEY}`
      );
        
        if (response.ok) {
          const data: NewsResponse = await response.json();
          const articles = data.articles.map(article => ({
            ...article,
            category: this.categorizeArticle(article.title, article.description),
            imageUrl: (article as any).urlToImage
          }));
          
          this.cache.set(cacheKey, { data: articles, timestamp: Date.now() });
          return articles;
        }
    } catch (error) {
      console.warn('Failed to fetch real-time news, using fallback data:', error);
    }

    // Always use English fallback data to strictly fulfill "only English environment news" requirement
    const fallbackData = FALLBACK_NEWS_EN;
    this.cache.set(cacheKey, { data: fallbackData, timestamp: Date.now() });
    return fallbackData;
  }

  private categorizeArticle(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('solar') || text.includes('wind') || text.includes('renewable')) {
      return 'Renewable Energy';
    }
    if (text.includes('ocean') || text.includes('sea') || text.includes('marine')) {
      return 'Ocean Conservation';
    }
    if (text.includes('climate') || text.includes('carbon') || text.includes('emission')) {
      return 'Climate Action';
    }
    if (text.includes('biodiversity') || text.includes('species') || text.includes('wildlife')) {
      return 'Biodiversity';
    }
    if (text.includes('forest') || text.includes('tree') || text.includes('deforestation')) {
      return 'Forest Conservation';
    }
    
    return 'Environmental News';
  }

  getRandomFact(language: 'en' | 'hi' | 'pa' = 'en'): string {
    const facts = ENVIRONMENTAL_FACTS[language] || ENVIRONMENTAL_FACTS['en'];
    return facts[Math.floor(Math.random() * facts.length)];
  }

  getRandomTip(language: 'en' | 'hi' | 'pa' = 'en'): string {
    const tips = DAILY_TIPS[language] || DAILY_TIPS['en'];
    return tips[Math.floor(Math.random() * tips.length)];
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const newsService = NewsService.getInstance();
