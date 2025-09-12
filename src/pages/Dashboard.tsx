import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Clock, Trophy, Star } from "lucide-react";
import Chatbot from "@/components/Chatbot";

// Import lesson images
import wasteManagementImg from "@/assets/lesson-waste-management.jpg";
import waterTreatmentImg from "@/assets/lesson-water-treatment.jpg";
import pollutionFreeImg from "@/assets/lesson-pollution-free.jpg";
import afforestationImg from "@/assets/lesson-afforestation.jpg";
import deforestationImg from "@/assets/lesson-deforestation.jpg";
import renewableEnergyImg from "@/assets/lesson-renewable-energy.jpg";

const lessons = [
  {
    id: 1,
    title: "Waste Management",
    description: "Learn about proper waste disposal, recycling, and composting to reduce environmental impact.",
    image: wasteManagementImg,
    duration: "15 min",
    difficulty: "Beginner",
    progress: 100,
    completed: true
  },
  {
    id: 2,
    title: "Water Treatment",
    description: "Discover how water is cleaned and purified for safe consumption and environmental protection.",
    image: waterTreatmentImg,
    duration: "12 min",
    difficulty: "Beginner",
    progress: 75,
    completed: false
  },
  {
    id: 3,
    title: "Pollution-Free Zones",
    description: "Explore strategies to create and maintain clean, pollution-free environments in cities.",
    image: pollutionFreeImg,
    duration: "18 min",
    difficulty: "Intermediate",
    progress: 0,
    completed: false
  },
  {
    id: 4,
    title: "Afforestation",
    description: "Understand the importance of planting trees and creating new forests for our planet.",
    image: afforestationImg,
    duration: "14 min",
    difficulty: "Beginner",
    progress: 25,
    completed: false
  },
  {
    id: 5,
    title: "Deforestation",
    description: "Learn about the causes and effects of deforestation and how to prevent it.",
    image: deforestationImg,
    duration: "16 min",
    difficulty: "Intermediate",
    progress: 0,
    completed: false
  },
  {
    id: 6,
    title: "Renewable Energy",
    description: "Discover clean energy sources like solar, wind, and hydroelectric power for a sustainable future.",
    image: renewableEnergyImg,
    duration: "20 min",
    difficulty: "Advanced",
    progress: 0,
    completed: false
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const totalProgress = lessons.reduce((sum, lesson) => sum + lesson.progress, 0) / lessons.length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome to Your Environmental Journey! 🌍
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore interactive lessons about environmental protection and sustainability. 
            Each lesson includes videos, quizzes, and hands-on activities to help you become an eco-hero!
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-accent" />
                <span>Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{Math.round(totalProgress)}%</span>
                </div>
                <Progress value={totalProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Star className="w-5 h-5 text-success" />
                <span>Completed</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {completedLessons}
                <span className="text-lg font-normal text-muted-foreground">/{lessons.length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Lessons completed</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-glow transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Clock className="w-5 h-5 text-secondary" />
                <span>Total Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">2.5</div>
              <p className="text-sm text-muted-foreground">Hours of learning</p>
            </CardContent>
          </Card>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center space-x-2">
            <span>🌱</span>
            <span>Environmental Lessons</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className={`shadow-card hover:shadow-glow transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 animate-slide-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/lesson/${lesson.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={lesson.image}
                    alt={lesson.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    {lesson.completed ? (
                      <Badge className="bg-success text-success-foreground">
                        ✓ Completed
                      </Badge>
                    ) : lesson.progress > 0 ? (
                      <Badge variant="secondary">
                        {lesson.progress}% Complete
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-white/90">
                        Not Started
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {lesson.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-nature hover:opacity-90 transition-all duration-200"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {lesson.completed ? "Review" : lesson.progress > 0 ? "Continue" : "Start"}
                    </Button>
                  </div>
                  
                  {lesson.progress > 0 && (
                    <Progress value={lesson.progress} className="h-2" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        <Card className="bg-gradient-nature text-white shadow-glow">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">🎯 Keep Going, Eco-Warrior!</h3>
            <p className="text-lg mb-6 opacity-90">
              You're making great progress! Every lesson brings you closer to becoming an environmental champion.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/scoreboard")}
              className="bg-white text-primary hover:bg-white/90"
            >
              <Trophy className="w-5 h-5 mr-2" />
              View Your Achievements
            </Button>
          </CardContent>
        </Card>
      </main>
      <Chatbot />
    </div>
  );
}