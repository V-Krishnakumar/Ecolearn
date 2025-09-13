import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, TreePine, Users, Award, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RealTimeTasks() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const tasks = [
    {
      id: 1,
      title: t('task.afforestation.title'),
      description: t('task.afforestation.description'),
      icon: TreePine,
      difficulty: 'Beginner',
      participants: 1250,
      completed: 890,
      timeEstimate: '15-30 min',
      status: 'active'
    },
    {
      id: 2,
      title: t('task.community.cleanup.title'),
      description: t('task.community.cleanup.description'),
      icon: Users,
      difficulty: 'Intermediate',
      participants: 850,
      completed: 420,
      timeEstimate: '1-2 hours',
      status: 'coming-soon'
    },
    {
      id: 3,
      title: t('task.waste.audit.title'),
      description: t('task.waste.audit.description'),
      icon: Award,
      difficulty: 'Advanced',
      participants: 320,
      completed: 180,
      timeEstimate: '2-3 hours',
      status: 'coming-soon'
    }
  ];

  const handleTaskClick = (taskId: number) => {
    if (taskId === 1) {
      navigate('/afforestation-task');
    }
    // Add other task routes as needed
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">{t('task.status.active')}</Badge>;
      case 'coming-soon':
        return <Badge variant="secondary">{t('task.status.coming.soon')}</Badge>;
      default:
        return <Badge variant="outline">{t('task.status.inactive')}</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return <Badge variant="outline" className="text-green-600 border-green-200">{t('difficulty.beginner')}</Badge>;
      case 'Intermediate':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-200">{t('difficulty.intermediate')}</Badge>;
      case 'Advanced':
        return <Badge variant="outline" className="text-red-600 border-red-200">{t('difficulty.advanced')}</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t('realtime.tasks.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {t('realtime.tasks.subtitle')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const IconComponent = task.icon;
            return (
              <Card 
                key={task.id} 
                className={`shadow-card hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  task.status === 'active' ? 'hover:scale-105' : 'opacity-75'
                }`}
                onClick={() => task.status === 'active' && handleTaskClick(task.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-nature rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{task.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          {getDifficultyBadge(task.difficulty)}
                          {getStatusBadge(task.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('task.participants')}:</span>
                      <span className="font-medium">{task.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('task.completed')}:</span>
                      <span className="font-medium">{task.completed.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 col-span-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{t('task.time.estimate')}:</span>
                      <span className="font-medium">{task.timeEstimate}</span>
                    </div>
                  </div>
                  
                  {task.status === 'active' && (
                    <Button 
                      className="w-full bg-gradient-nature hover:opacity-90"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(task.id);
                      }}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {t('task.start.task')}
                    </Button>
                  )}
                  
                  {task.status === 'coming-soon' && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                    >
                      {t('task.coming.soon')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t('realtime.tasks.motivation.title')}
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('realtime.tasks.motivation.description')}
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

