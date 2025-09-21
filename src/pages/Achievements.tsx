import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Search, 
  Filter, 
  Star, 
  Lock, 
  CheckCircle,
  Award,
  Target,
  Flame,
  Gamepad2,
  BookOpen,
  Leaf
} from "lucide-react";
import { useSupabaseAchievements } from "@/hooks/useSupabaseAchievements";
import { AchievementCard } from "@/components/AchievementCard";
import { AchievementStats } from "@/components/AchievementStats";
import { AchievementNotification } from "@/components/AchievementNotification";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Navigation } from "@/components/Navigation";
import { runSeedAchievements } from "@/lib/supabase/seed-achievements";

export default function Achievements() {
  const {
    achievements,
    newAchievements,
    stats,
    loading,
    getAchievementsByRarity,
    getUnlockedAchievements,
    dismissNotification
  } = useSupabaseAchievements();
  
  const { t } = useLanguage();
  const { user } = useUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeedAchievements = async () => {
    setSeeding(true);
    try {
      const result = await runSeedAchievements();
      if (result.success) {
        // Reload achievements after seeding
        window.location.reload();
      } else {
        console.error('Failed to seed achievements:', result.error);
      }
    } catch (error) {
      console.error('Error seeding achievements:', error);
    } finally {
      setSeeding(false);
    }
  };

  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || achievement.category === selectedCategory;
    const matchesRarity = selectedRarity === "all" || achievement.rarity === selectedRarity;
    const matchesUnlocked = !showOnlyUnlocked || !!achievement.unlockedAt;
    
    return matchesSearch && matchesCategory && matchesRarity && matchesUnlocked;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-4 h-4" />;
      case 'environmental': return <Leaf className="w-4 h-4" />;
      case 'games': return <Gamepad2 className="w-4 h-4" />;
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'environmental': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'games': return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'streak': return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'special': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const categories = [
    { id: 'all', name: t('achievements.categories.all'), icon: <Trophy className="w-4 h-4" /> },
    { id: 'learning', name: t('achievements.categories.learning'), icon: <BookOpen className="w-4 h-4" /> },
    { id: 'environmental', name: t('achievements.categories.environmental'), icon: <Leaf className="w-4 h-4" /> },
    { id: 'games', name: t('achievements.categories.games'), icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'streak', name: t('achievements.categories.streak'), icon: <Flame className="w-4 h-4" /> },
    { id: 'special', name: t('achievements.categories.special'), icon: <Star className="w-4 h-4" /> }
  ];

  const rarities = [
    { id: 'all', name: t('achievements.rarities.all'), color: 'bg-gray-100 text-gray-800' },
    { id: 'common', name: t('achievements.rarities.common'), color: 'bg-gray-100 text-gray-800' },
    { id: 'rare', name: t('achievements.rarities.rare'), color: 'bg-blue-100 text-blue-800' },
    { id: 'epic', name: t('achievements.rarities.epic'), color: 'bg-purple-100 text-purple-800' },
    { id: 'legendary', name: t('achievements.rarities.legendary'), color: 'bg-yellow-100 text-yellow-800' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <Navigation />
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('achievements.loading')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-nature rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">🏆</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">
            {t('achievements.title')}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t('achievements.subtitle')}
        </p>
        
        {/* Debug Info and Seed Button for Testing */}
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-500">
            Debug: {achievements.length} achievements loaded
          </div>
          {achievements.length === 0 && (
            <Button 
              onClick={handleSeedAchievements}
              disabled={seeding}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {seeding ? 'Seeding...' : 'Seed Sample Achievements'}
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AchievementStats stats={stats} />
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>{t('achievements.quick.stats')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">{t('achievements.stats.unlocked')}</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-green-600">{stats.unlockedAchievements}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-700">{t('achievements.stats.locked')}</span>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-600">{stats.totalAchievements - stats.unlockedAchievements}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2 border-t pt-3">
                <span className="text-sm font-medium text-gray-700">{t('achievements.stats.total.points')}</span>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold text-yellow-600">{stats.totalPoints}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>{t('achievements.filters')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('achievements.search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">{t('achievements.category')}</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 transition-all duration-200 hover:scale-105 ${
                    selectedCategory === category.id 
                      ? '' 
                      : getCategoryColor(category.id)
                  }`}
                >
                  {category.icon}
                  <span className="text-xs">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Rarity Filters */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">{t('achievements.rarity')}</label>
            <div className="flex flex-wrap gap-2">
              {rarities.map((rarity) => (
                <Button
                  key={rarity.id}
                  variant={selectedRarity === rarity.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={`transition-all duration-200 hover:scale-105 ${selectedRarity === rarity.id ? '' : rarity.color}`}
                >
                  <span className="text-xs">{rarity.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Toggle for unlocked only */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unlocked-only"
              checked={showOnlyUnlocked}
              onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="unlocked-only" className="text-sm font-medium">
              {t('achievements.filter.unlocked.only')}
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {filteredAchievements.length} {t('achievements.count')}
          </h2>
          <Badge variant="outline" className="text-sm">
            {selectedCategory !== 'all' && `${selectedCategory} • `}
            {selectedRarity !== 'all' && `${selectedRarity} • `}
            {showOnlyUnlocked && 'unlocked only'}
          </Badge>
        </div>

        {filteredAchievements.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('achievements.no.achievements')}</h3>
              <p className="text-muted-foreground">
                {t('achievements.try.different.filters')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => {
              // Find if this achievement is unlocked for the current user
              const studentAchievement = getUnlockedAchievements().find(sa => sa.achievement_id === achievement.id);
              const isUnlocked = !!studentAchievement?.is_unlocked;
              const progress = studentAchievement?.progress || 0;
              
              return (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  showProgress={true}
                  isUnlocked={isUnlocked}
                  progress={progress}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Achievement Notifications */}
      {newAchievements && newAchievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => dismissNotification(achievement.id)}
        />
      ))}
      </div>
    </div>
  );
}
