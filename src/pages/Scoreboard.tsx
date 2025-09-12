import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { Trophy, Star, Award, Target, BookOpen, Zap, Crown, Medal, Gift } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Complete your first lesson",
    icon: BookOpen,
    earned: true,
    date: "2024-01-15",
    points: 50,
    color: "text-success"
  },
  {
    id: 2,
    title: "Quiz Master",
    description: "Score 100% on a quiz",
    icon: Target,
    earned: true,
    date: "2024-01-16",
    points: 100,
    color: "text-primary"
  },
  {
    id: 3,
    title: "Eco Warrior",
    description: "Complete 3 lessons",
    icon: Award,
    earned: false,
    date: null,
    points: 200,
    color: "text-accent"
  },
  {
    id: 4,
    title: "Speed Learner",
    description: "Complete a lesson in under 10 minutes",
    icon: Zap,
    earned: true,
    date: "2024-01-17",
    points: 75,
    color: "text-secondary"
  },
  {
    id: 5,
    title: "Perfect Score",
    description: "Get perfect scores on 3 quizzes",
    icon: Crown,
    earned: false,
    date: null,
    points: 300,
    color: "text-accent"
  },
  {
    id: 6,
    title: "Dedicated Learner",
    description: "Study for 7 days in a row",
    icon: Medal,
    earned: false,
    date: null,
    points: 250,
    color: "text-primary"
  }
];

const weeklyProgress = [
  { day: "Mon", progress: 75, lessons: 2 },
  { day: "Tue", progress: 50, lessons: 1 },
  { day: "Wed", progress: 100, lessons: 3 },
  { day: "Thu", progress: 25, lessons: 1 },
  { day: "Fri", progress: 80, lessons: 2 },
  { day: "Sat", progress: 90, lessons: 2 },
  { day: "Sun", progress: 60, lessons: 1 }
];

export default function Scoreboard() {
  const navigate = useNavigate();
  
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const completionRate = (earnedAchievements / achievements.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center space-x-3">
            <Trophy className="w-10 h-10 text-accent" />
            <span>Your Achievements</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress, earn badges, and celebrate your environmental learning journey! 
            Every lesson completed makes you a better guardian of our planet.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card text-center bg-gradient-nature text-white">
            <CardContent className="p-6">
              <div className="text-3xl font-bold mb-2">{totalPoints}</div>
              <p className="text-white/90">Total Points</p>
              <Star className="w-6 h-6 mx-auto mt-2 animate-bounce-gentle" />
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-2">{earnedAchievements}</div>
              <p className="text-muted-foreground">Badges Earned</p>
              <Award className="w-6 h-6 mx-auto mt-2 text-primary" />
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-success mb-2">1</div>
              <p className="text-muted-foreground">Lessons Completed</p>
              <BookOpen className="w-6 h-6 mx-auto mt-2 text-success" />
            </CardContent>
          </Card>
          
          <Card className="shadow-card text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-secondary mb-2">{Math.round(completionRate)}%</div>
              <p className="text-muted-foreground">Achievement Rate</p>
              <Target className="w-6 h-6 mx-auto mt-2 text-secondary" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <Card className="shadow-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-accent" />
                  <span>Achievement Badges</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {achievements.map((achievement, index) => {
                    const IconComponent = achievement.icon;
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 animate-slide-up ${
                          achievement.earned
                            ? "border-primary bg-primary/5 shadow-glow"
                            : "border-muted-foreground/20 bg-muted/30"
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-full ${achievement.earned ? 'bg-primary/10' : 'bg-muted'}`}>
                              <IconComponent 
                                className={`w-6 h-6 ${achievement.earned ? achievement.color : 'text-muted-foreground'}`} 
                              />
                            </div>
                            <div>
                              <h3 className={`font-semibold ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              {achievement.earned && achievement.date && (
                                <p className="text-xs text-primary mt-1">
                                  Earned on {new Date(achievement.date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge 
                              variant={achievement.earned ? "default" : "outline"}
                              className={achievement.earned ? "bg-primary" : ""}
                            >
                              {achievement.earned ? "Earned" : "Locked"}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {achievement.points} pts
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Certificate Section */}
            <Card className="shadow-card bg-gradient-earth text-white">
              <CardContent className="p-8 text-center">
                <Gift className="w-16 h-16 mx-auto mb-4 animate-bounce-gentle" />
                <h3 className="text-2xl font-bold mb-4">🎓 Environmental Champion Certificate</h3>
                <p className="text-white/90 mb-6">
                  Complete all 6 lessons to unlock your official Environmental Champion Certificate!
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress to Certificate</span>
                    <span>1/6 Lessons</span>
                  </div>
                  <Progress value={16.67} className="h-3 bg-white/20" />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/dashboard")}
                  className="bg-white text-primary hover:bg-white/90"
                >
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress & Leaderboard */}
          <div className="space-y-6">
            {/* Weekly Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span>Weekly Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {weeklyProgress.map((day, index) => (
                    <div key={day.day} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-8">{day.day}</span>
                        <div className="flex-1 w-24">
                          <Progress value={day.progress} className="h-2" />
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {day.lessons} lesson{day.lessons !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-accent" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Study Streak</span>
                  <Badge className="bg-accent">3 days 🔥</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Quiz Score</span>
                  <Badge variant="secondary">85%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Favorite Topic</span>
                  <Badge variant="outline">Waste Management</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Time Spent Learning</span>
                  <Badge variant="secondary">2.5 hours</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Next Achievement */}
            <Card className="shadow-card border-accent">
              <CardHeader>
                <CardTitle className="text-accent flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Next Goal</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Award className="w-12 h-12 text-accent mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Eco Warrior</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete 3 lessons to unlock this badge
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>1/3</span>
                    </div>
                    <Progress value={33.33} className="h-2" />
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate("/dashboard")}
                    className="w-full"
                  >
                    Continue Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}