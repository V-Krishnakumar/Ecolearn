import React from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useUser } from "@/contexts/UserContext";
import { useProgress } from "@/lib/localProgress";

// Lesson images from public directory
const wasteManagementImg = "/images/lesson-waste-management.jpg";
const waterTreatmentImg = "/images/lesson-water-treatment.jpg";
const pollutionFreeImg = "/images/lesson-pollution-free.jpg";
const afforestationImg = "/images/lesson-afforestation.jpg";
const deforestationImg = "/images/lesson-deforestation.jpg";
const renewableEnergyImg = "/images/lesson-renewable-energy.jpg";

const getLessonsTemplate = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('lesson.waste.management'),
    description: t('lesson.waste.management.desc'),
    image: wasteManagementImg,
    duration: `15 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    category: 'Waste Management'
  },
  {
    id: 2,
    title: t('lesson.water.treatment'),
    description: t('lesson.water.treatment.desc'),
    image: waterTreatmentImg,
    duration: `12 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    category: 'Water Conservation'
  },
  {
    id: 3,
    title: t('lesson.pollution.free'),
    description: t('lesson.pollution.free.desc'),
    image: pollutionFreeImg,
    duration: `18 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate'),
    category: 'Pollution Control'
  },
  {
    id: 4,
    title: t('lesson.afforestation'),
    description: t('lesson.afforestation.desc'),
    image: afforestationImg,
    duration: `14 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    category: 'Forest Conservation'
  },
  {
    id: 5,
    title: t('lesson.deforestation'),
    description: t('lesson.deforestation.desc'),
    image: deforestationImg,
    duration: `16 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate'),
    category: 'Forest Conservation'
  },
  {
    id: 6,
    title: t('lesson.renewable.energy'),
    description: t('lesson.renewable.energy.desc'),
    image: renewableEnergyImg,
    duration: `20 ${t('common.minutes')}`,
    difficulty: t('difficulty.advanced'),
    category: 'Clean Energy'
  }
];

export default function StudentLessons() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const { getUserProgress } = useProgress();

  const userProgress = user ? getUserProgress(user.id) : null;
  const lessons = getLessonsTemplate(t);

  const getLessonStatus = (lessonId: number) => {
    if (!userProgress) return 'not-started';
    const lesson = userProgress.lessons[lessonId];
    if (!lesson) return 'not-started';
    return lesson.completed ? 'completed' : 'in-progress';
  };

  const getLessonProgress = (lessonId: number) => {
    if (!userProgress) return 0;
    const lesson = userProgress.lessons[lessonId];
    if (!lesson) return 0;
    return lesson.videoProgress;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case t('difficulty.beginner'): return 'bg-green-100 text-green-800';
      case t('difficulty.intermediate'): return 'bg-yellow-100 text-yellow-800';
      case t('difficulty.advanced'): return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completedLessons = lessons.filter(lesson => getLessonStatus(lesson.id) === 'completed').length;
  const inProgressLessons = lessons.filter(lesson => getLessonStatus(lesson.id) === 'in-progress').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <StudentNavigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-nature rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🌱</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('student.lessons.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('student.lessons.subtitle')}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('student.lessons.total.lessons')}</p>
                  <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <PlayCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('student.lessons.completed')}</p>
                  <p className="text-2xl font-bold text-green-600">{completedLessons}</p>
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
                  <p className="text-sm font-medium text-gray-600">{t('student.lessons.in.progress')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{inProgressLessons}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lessons Grid */}
        <div className="space-y-6">
          {lessons.map((lesson) => {
            const status = getLessonStatus(lesson.id);
            const progress = getLessonProgress(lesson.id);
            
            return (
              <Card key={lesson.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Lesson Image */}
                    <div className="md:w-1/3">
                      <div className="relative">
                        <img
                          src={lesson.image}
                          alt={lesson.title}
                          className="w-full h-48 md:h-32 object-cover rounded-lg"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge 
                            variant={status === 'completed' ? 'default' : status === 'in-progress' ? 'secondary' : 'outline'}
                            className="bg-white/90 text-gray-900"
                          >
                            {status === 'completed' ? 'Completed' : 
                             status === 'in-progress' ? 'In Progress' : 'Not Started'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="md:w-2/3">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{lesson.title}</h3>
                            <Badge className={getDifficultyColor(lesson.difficulty)}>
                              {lesson.difficulty}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{lesson.description}</p>
                          <p className="text-sm text-blue-600 font-medium">{lesson.category}</p>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{lesson.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <PlayCircle className="h-4 w-4" />
                            <span>Interactive Lesson</span>
                          </div>
                        </div>

                        {status === 'in-progress' && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        )}

                        <div className="flex space-x-3">
                          <Button
                            onClick={() => navigate(`/lesson/${lesson.id}`)}
                            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                          >
                            <PlayCircle className="h-4 w-4 mr-2" />
                            {status === 'completed' ? 'Review Lesson' : 
                             status === 'in-progress' ? 'Continue' : 'Start Lesson'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/quiz/${lesson.id}`)}
                            className="flex items-center space-x-2"
                          >
                            <span>Take Quiz</span>
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        {completedLessons === lessons.length && (
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0 mt-8">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">🎉 Congratulations!</h3>
              <p className="text-lg mb-4">
                You've completed all the environmental lessons! You're now an Eco-Warrior!
              </p>
              <Button
                onClick={() => navigate('/student/achievements')}
                variant="secondary"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                View Your Achievements
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
