import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Newspaper, 
  Lightbulb, 
  TrendingUp, 
  Leaf, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { newsService, NewsArticle, ENVIRONMENTAL_FACTS, DAILY_TIPS } from '@/lib/newsApi';

const NewsFacts: React.FC = () => {
  const { t, language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'facts' | 'tips'>('news');
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFact, setCurrentFact] = useState('');
  const [currentTip, setCurrentTip] = useState('');

  // Load real-time news
  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const newsData = await newsService.getEnvironmentalNews(language as 'en' | 'hi');
        console.log('News loaded:', newsData.length, 'articles');
        console.log('Sample news article:', newsData[0]);
        console.log('Article title length:', newsData[0]?.title?.length);
        console.log('Article description length:', newsData[0]?.description?.length);
        setNews(newsData.slice(0, 8)); // Show 8 latest articles
      } catch (error) {
        console.error('Failed to load news:', error);
        // Set fallback news if API fails
        setNews([
          {
            id: 'fallback-1',
            title: 'Solar Energy Breakthrough: New Efficiency Record Set',
            description: 'Scientists achieve 47.1% efficiency in solar panel technology, promising cheaper renewable energy.',
            url: '#',
            publishedAt: new Date().toISOString(),
            source: 'EcoTech News',
            category: 'Renewable Energy'
          },
          {
            id: 'fallback-2',
            title: 'Ocean Cleanup Project Removes 100,000kg of Plastic',
            description: 'Major milestone reached in Pacific Garbage Patch cleanup initiative.',
            url: '#',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            source: 'Ocean Conservation',
            category: 'Ocean Conservation'
          },
          {
            id: 'fallback-3',
            title: 'Climate Change: New Carbon Capture Technology',
            description: 'Revolutionary method removes CO2 from atmosphere 10x more efficiently.',
            url: '#',
            publishedAt: new Date(Date.now() - 172800000).toISOString(),
            source: 'Climate Science',
            category: 'Climate Action'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
    
    // Refresh news every 10 minutes
    const interval = setInterval(loadNews, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [language]);

  // Load random fact and tip
  useEffect(() => {
    setCurrentFact(newsService.getRandomFact(language as 'en' | 'hi'));
    setCurrentTip(newsService.getRandomTip(language as 'en' | 'hi'));
    
    // Refresh fact and tip every 5 minutes
    const interval = setInterval(() => {
      setCurrentFact(newsService.getRandomFact(language as 'en' | 'hi'));
      setCurrentTip(newsService.getRandomTip(language as 'en' | 'hi'));
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [language]);

  const refreshNews = async () => {
    setLoading(true);
    try {
      const newsData = await newsService.getEnvironmentalNews(language as 'en' | 'hi');
      setNews(newsData.slice(0, 5));
    } catch (error) {
      console.error('Failed to refresh news:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="w-full max-w-md bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-xl shadow-xl border border-green-200 overflow-hidden relative hover:shadow-2xl transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Leaf className="w-4 h-4 text-yellow-300" />
            {t('news.title')}
          </h3>
          <div className="flex items-center gap-1">
            {activeTab === 'news' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={refreshNews}
                disabled={loading}
                className="p-1 h-6 w-6 text-white hover:bg-white/20"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 h-6 w-6 text-white hover:bg-white/20"
            >
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Tabs */}
          <div className="p-3 pb-2">
            <div className="flex space-x-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-1">
              {[
                { key: 'news', label: t('news.tabs.news'), icon: <Newspaper className="w-3 h-3" />, color: 'from-blue-500 to-cyan-500' },
                { key: 'facts', label: t('news.tabs.facts'), icon: <Lightbulb className="w-3 h-3" />, color: 'from-yellow-500 to-orange-500' },
                { key: 'tips', label: t('news.tabs.tips'), icon: <TrendingUp className="w-3 h-3" />, color: 'from-green-500 to-emerald-500' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-md transform scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-3 pt-0 max-h-96 overflow-y-auto relative z-10">
            {activeTab === 'news' && (
              <div className="space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center py-4">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
                    <span className="ml-2 text-sm text-gray-600">Loading news...</span>
                  </div>
                ) : (
                  news.map((article, index) => {
                    // Ensure we have valid article data
                    const safeTitle = article.title || 'No title available';
                    const safeDescription = article.description || 'No description available';
                    const safeCategory = article.category || 'General';
                    
                    return (
                      <Card key={article.id || `news-${index}`} className="border-0 shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-to-r from-white to-blue-50">
                        <CardContent className="p-2">
                          <div className="flex items-start gap-2">
                            <div className="flex-shrink-0 mt-1">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                index % 3 === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                index % 3 === 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                'bg-gradient-to-r from-green-500 to-emerald-500'
                              }`}>
                                <Newspaper className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 w-full max-w-full">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <Badge className={`text-xs ${
                                  safeCategory === 'Renewable Energy' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800' :
                                  safeCategory === 'Climate Action' ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800' :
                                  safeCategory === 'Ocean Conservation' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800' :
                                  'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                                }`}>
                                  {safeCategory}
                                </Badge>
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {formatDate(article.publishedAt)}
                                </span>
                              </div>
                              <div className="mb-1">
                                <h4 
                                  className="font-medium text-xs text-gray-800 leading-tight overflow-hidden"
                                  style={{
                                    height: '2.4em',
                                    lineHeight: '1.2em',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word'
                                  }}
                                  title={safeTitle}
                                >
                                  {safeTitle}
                                </h4>
                              </div>
                              <div className="mb-2">
                                <p 
                                  className="text-xs text-gray-600 leading-tight overflow-hidden"
                                  style={{
                                    height: '2.4em',
                                    lineHeight: '1.2em',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word'
                                  }}
                                  title={safeDescription}
                                >
                                  {safeDescription}
                                </p>
                              </div>
                              <a
                                href={article.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                              >
                                Read more <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'facts' && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-xl transition-all duration-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {currentFact}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentFact(newsService.getRandomFact(language as 'en' | 'hi'))}
                    className="mt-3 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 rounded-full px-4 py-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    New Fact
                  </Button>
                </CardContent>
              </Card>
            )}

            {activeTab === 'tips' && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-200">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                    {currentTip}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentTip(newsService.getRandomTip(language as 'en' | 'hi'))}
                    className="mt-3 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 rounded-full px-4 py-2"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    New Tip
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NewsFacts;
