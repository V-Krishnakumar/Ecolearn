import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, TreePine, Users, Award, Clock, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const tasks = [
  {
    id: 1,
    title: 'Plant a Tree',
    description: 'Plant a tree in your community and share a photo of your environmental action.',
    icon: TreePine,
    difficulty: 'Beginner',
    participants: 1250,
    completed: 890,
    timeEstimate: '15-30 min',
    status: 'active',
    points: 50,
    category: 'Afforestation'
  },
  {
    id: 2,
    title: 'Community Cleanup',
    description: 'Organize or participate in a local cleanup event to remove waste from public spaces.',
    icon: Users,
    difficulty: 'Intermediate',
    participants: 850,
    completed: 420,
    timeEstimate: '1-2 hours',
    status: 'coming-soon',
    points: 75,
    category: 'Waste Management'
  },
  {
    id: 3,
    title: 'Waste Audit',
    description: 'Analyze your household waste for one week and create a reduction plan.',
    icon: Award,
    difficulty: 'Advanced',
    participants: 320,
    completed: 180,
    timeEstimate: '2-3 hours',
    status: 'coming-soon',
    points: 100,
    category: 'Waste Management'
  },
  {
    id: 4,
    title: 'Water Conservation Challenge',
    description: 'Implement water-saving practices for one week and track your savings.',
    icon: Award,
    difficulty: 'Intermediate',
    participants: 650,
    completed: 320,
    timeEstimate: '1 week',
    status: 'active',
    points: 60,
    category: 'Water Conservation'
  },
  {
    id: 5,
    title: 'Energy Efficiency Audit',
    description: 'Audit your home for energy efficiency and implement improvements.',
    icon: Award,
    difficulty: 'Advanced',
    participants: 280,
    completed: 150,
    timeEstimate: '3-4 hours',
    status: 'coming-soon',
    points: 80,
    category: 'Energy Conservation'
  }
];

export default function StudentTasks() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'coming-soon': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Available Now';
      case 'coming-soon': return 'Coming Soon';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const activeTasks = tasks.filter(task => task.status === 'active');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const upcomingTasks = tasks.filter(task => task.status === 'coming-soon');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <StudentNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Real-Time Tasks</h1>
          <p className="text-gray-600 text-lg">
            Take action for the environment and earn eco points by completing real-world tasks
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{activeTasks.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedTasks.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {completedTasks.reduce((sum, task) => sum + task.points, 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTasks.map((task) => {
              const Icon = task.icon;
              const completionRate = (task.completed / task.participants) * 100;
              
              return (
                <Card key={task.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-green-100 rounded-full">
                            <Icon className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.category}</p>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>

                      <p className="text-gray-700">{task.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{task.timeEstimate}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{task.participants} participants</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span className="font-medium text-green-600">{task.points} points</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Completion Rate</span>
                            <span>{Math.round(completionRate)}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>

                        <Button
                          onClick={() => navigate(`/afforestation-task`)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Start Task
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Coming Soon Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingTasks.map((task) => {
              const Icon = task.icon;
              
              return (
                <Card key={task.id} className="bg-white shadow-lg border-0 opacity-75">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-gray-100 rounded-full">
                            <Icon className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-600">{task.category}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusText(task.status)}
                        </Badge>
                      </div>

                      <p className="text-gray-700">{task.description}</p>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{task.timeEstimate}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{task.participants} interested</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="h-4 w-4" />
                          <span className="font-medium text-gray-600">{task.points} points</span>
                        </div>
                      </div>

                      <Button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-2">🌱 Make a Real Impact!</h3>
            <p className="text-lg mb-4">
              Complete tasks to earn eco points and contribute to environmental protection in your community.
            </p>
            <Button
              onClick={() => navigate('/student/achievements')}
              variant="secondary"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              View Your Progress
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
