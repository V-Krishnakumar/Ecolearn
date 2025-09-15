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
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementCard } from "@/components/AchievementCard";
import { AchievementStats } from "@/components/AchievementStats";
import { AchievementNotification } from "@/components/AchievementNotification";

export default function Achievements() {
  const {
    achievements,
    newAchievements,
    stats,
    loading,
    getAchievementsByCategory,
    getAchievementsByRarity,
    getUnlockedAchievements,
    getLockedAchievements,
    dismissNotification
  } = useAchievements();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRarity, setSelectedRarity] = useState("all");
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  // Filter achievements based on search and filters
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
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
    { id: 'all', name: 'All', icon: <Trophy className="w-4 h-4" /> },
    { id: 'learning', name: 'Learning', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'environmental', name: 'Environmental', icon: <Leaf className="w-4 h-4" /> },
    { id: 'games', name: 'Games', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'streak', name: 'Streak', icon: <Flame className="w-4 h-4" /> },
    { id: 'special', name: 'Special', icon: <Star className="w-4 h-4" /> }
  ];

  const rarities = [
    { id: 'all', name: 'All', color: 'bg-gray-100 text-gray-800' },
    { id: 'common', name: 'Common', color: 'bg-gray-100 text-gray-800' },
    { id: 'rare', name: 'Rare', color: 'bg-blue-100 text-blue-800' },
    { id: 'epic', name: 'Epic', color: 'bg-purple-100 text-purple-800' },
    { id: 'legendary', name: 'Legendary', color: 'bg-yellow-100 text-yellow-800' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading achievements...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold flex items-center justify-center space-x-3">
          <Trophy className="w-10 h-10 text-yellow-500" />
          <span>Achievements</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Track your environmental learning progress and unlock rewards!
        </p>
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
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Unlocked</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="font-bold">{stats.unlockedAchievements}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Locked</span>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span className="font-bold">{stats.totalAchievements - stats.unlockedAchievements}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Points</span>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold">{stats.totalPoints}</span>
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
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 ${
                    selectedCategory === category.id 
                      ? '' 
                      : getCategoryColor(category.id)
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Rarity Filters */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Rarity</label>
            <div className="flex flex-wrap gap-2">
              {rarities.map((rarity) => (
                <Button
                  key={rarity.id}
                  variant={selectedRarity === rarity.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRarity(rarity.id)}
                  className={selectedRarity === rarity.id ? '' : rarity.color}
                >
                  {rarity.name}
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
              Show only unlocked achievements
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {filteredAchievements.length} Achievement{filteredAchievements.length !== 1 ? 's' : ''}
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
              <h3 className="text-lg font-semibold mb-2">No achievements found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                showProgress={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Achievement Notifications */}
      {newAchievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => dismissNotification(achievement.id)}
        />
      ))}
    </div>
  );
}
