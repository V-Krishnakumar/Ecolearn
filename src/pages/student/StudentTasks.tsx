import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentNavigation from "@/components/student/StudentNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, TreePine, Users, Award, Clock, CheckCircle, Trash2, Droplets, Zap, Leaf, Recycle, Shield } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useUser } from "@/contexts/UserContext";
import { TaskService, RealTimeTask, TaskSubmission } from "@/lib/supabase/tasks";

const getTasksTemplate = (t: (key: string) => string) => [
  {
    id: 1,
    title: t('student.tasks.plant.tree'),
    description: t('student.tasks.plant.tree.desc'),
    icon: TreePine,
    difficulty: t('student.tasks.difficulty.beginner'),
    participants: 1250,
    completed: 890,
    timeEstimate: '15-30 min',
    status: 'active',
    points: 50,
    category: t('student.tasks.category.afforestation')
  },
  {
    id: 2,
    title: t('student.tasks.community.cleanup'),
    description: t('student.tasks.community.cleanup.desc'),
    icon: Trash2,
    difficulty: t('student.tasks.difficulty.intermediate'),
    participants: 850,
    completed: 420,
    timeEstimate: '1-2 hours',
    status: 'coming-soon',
    points: 75,
    category: t('student.tasks.category.waste.management')
  },
  {
    id: 3,
    title: t('student.tasks.waste.audit'),
    description: t('student.tasks.waste.audit.desc'),
    icon: Recycle,
    difficulty: t('student.tasks.difficulty.advanced'),
    participants: 320,
    completed: 180,
    timeEstimate: '2-3 hours',
    status: 'coming-soon',
    points: 100,
    category: t('student.tasks.category.waste.management')
  },
  {
    id: 4,
    title: t('student.tasks.water.conservation.challenge'),
    description: t('student.tasks.water.conservation.challenge.desc'),
    icon: Droplets,
    difficulty: t('student.tasks.difficulty.intermediate'),
    participants: 650,
    completed: 320,
    timeEstimate: '1 week',
    status: 'active',
    points: 60,
    category: t('student.tasks.category.water.conservation')
  },
  {
    id: 5,
    title: t('student.tasks.energy.efficiency.audit'),
    description: t('student.tasks.energy.efficiency.audit.desc'),
    icon: Zap,
    difficulty: t('student.tasks.difficulty.advanced'),
    participants: 280,
    completed: 150,
    timeEstimate: '3-4 hours',
    status: 'coming-soon',
    points: 80,
    category: t('student.tasks.category.energy.conservation')
  }
];

export default function StudentTasks() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useUser();
  const [tasks, setTasks] = useState<RealTimeTask[]>([]);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks and submissions from Supabase
  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setLoading(true);
          
          // Load tasks
          const { data: tasksData, error: tasksError } = await TaskService.getTasks();
          if (tasksError) {
            console.error('Error loading tasks:', tasksError);
            setTasks(getTasksTemplate(t));
          } else {
            // Transform Supabase tasks to apply translations
            const transformedTasks = tasksData?.map(task => {
              // Map task titles and descriptions to translation keys based on category
              const getTranslatedTitle = (title: string, category: string) => {
                const titleLower = title.toLowerCase();
                const categoryLower = category.toLowerCase();

                if (titleLower.includes('plant') || titleLower.includes('tree') || categoryLower.includes('afforestation')) {
                  return t('student.tasks.plant.tree');
                } else if (titleLower.includes('cleanup') || titleLower.includes('community') || categoryLower.includes('waste')) {
                  return t('student.tasks.community.cleanup');
                } else if (titleLower.includes('waste') || titleLower.includes('audit') || categoryLower.includes('waste')) {
                  return t('student.tasks.waste.audit');
                } else if (titleLower.includes('water') || titleLower.includes('conservation') || categoryLower.includes('water')) {
                  return t('student.tasks.water.conservation.challenge');
                } else if (titleLower.includes('energy') || titleLower.includes('efficiency') || categoryLower.includes('energy')) {
                  return t('student.tasks.energy.efficiency.audit');
                }
                return title; // Return original if no match
              };

              const getTranslatedDescription = (title: string, category: string) => {
                const titleLower = title.toLowerCase();
                const categoryLower = category.toLowerCase();

                if (titleLower.includes('plant') || titleLower.includes('tree') || categoryLower.includes('afforestation')) {
                  return t('student.tasks.plant.tree.desc');
                } else if (titleLower.includes('cleanup') || titleLower.includes('community') || categoryLower.includes('waste')) {
                  return t('student.tasks.community.cleanup.desc');
                } else if (titleLower.includes('waste') || titleLower.includes('audit') || categoryLower.includes('waste')) {
                  return t('student.tasks.waste.audit.desc');
                } else if (titleLower.includes('water') || titleLower.includes('conservation') || categoryLower.includes('water')) {
                  return t('student.tasks.water.conservation.challenge.desc');
                } else if (titleLower.includes('energy') || titleLower.includes('efficiency') || categoryLower.includes('energy')) {
                  return t('student.tasks.energy.efficiency.audit.desc');
                }
                return task.description || '';
              };

              const getTranslatedDifficulty = (difficulty: string) => {
                const difficultyLower = difficulty.toLowerCase();
                if (difficultyLower.includes('beginner') || difficultyLower.includes('easy')) {
                  return t('student.tasks.difficulty.beginner');
                } else if (difficultyLower.includes('intermediate') || difficultyLower.includes('medium')) {
                  return t('student.tasks.difficulty.intermediate');
                } else if (difficultyLower.includes('advanced') || difficultyLower.includes('hard')) {
                  return t('student.tasks.difficulty.advanced');
                }
                return difficulty;
              };

              const getTranslatedCategory = (category: string) => {
                const categoryLower = category.toLowerCase();
                if (categoryLower.includes('afforestation') || categoryLower.includes('tree')) {
                  return t('student.tasks.category.afforestation');
                } else if (categoryLower.includes('waste') || categoryLower.includes('cleanup')) {
                  return t('student.tasks.category.waste.management');
                } else if (categoryLower.includes('water') || categoryLower.includes('conservation')) {
                  return t('student.tasks.category.water.conservation');
                } else if (categoryLower.includes('energy') || categoryLower.includes('efficiency')) {
                  return t('student.tasks.category.energy.conservation');
                }
                return category;
              };

              const getTaskIcon = (title: string, category: string) => {
                const titleLower = title.toLowerCase();
                const categoryLower = category.toLowerCase();

                if (titleLower.includes('plant') || titleLower.includes('tree') || categoryLower.includes('afforestation')) {
                  return TreePine;
                } else if (titleLower.includes('cleanup') || titleLower.includes('community') || categoryLower.includes('waste')) {
                  return Trash2;
                } else if (titleLower.includes('waste') || titleLower.includes('audit') || categoryLower.includes('waste')) {
                  return Recycle;
                } else if (titleLower.includes('water') || titleLower.includes('conservation') || categoryLower.includes('water')) {
                  return Droplets;
                } else if (titleLower.includes('energy') || titleLower.includes('efficiency') || categoryLower.includes('energy')) {
                  return Zap;
                }
                return Award; // Default icon
              };

              return {
                ...task,
                title: getTranslatedTitle(task.title, task.category),
                description: getTranslatedDescription(task.title, task.category),
                difficulty: getTranslatedDifficulty(task.difficulty),
                category: getTranslatedCategory(task.category),
                icon: getTaskIcon(task.title, task.category)
              };
            }) || [];

            if (transformedTasks.length === 0) {
              setTasks(getTasksTemplate(t));
            } else {
              setTasks(transformedTasks);
            }
          }

          // Load user submissions
          const { data: submissionsData, error: submissionsError } = await TaskService.getStudentSubmissions(user.id);
          if (submissionsError) {
            console.error('Error loading submissions:', submissionsError);
          } else {
            setSubmissions(submissionsData || []);
          }
        } catch (error) {
          console.error('Error loading data:', error);
          setTasks(getTasksTemplate(t));
        } finally {
          setLoading(false);
        }
      } else {
        setTasks(getTasksTemplate(t));
        setLoading(false);
      }
    };

    loadData();
  }, [user, t]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (task: RealTimeTask) => {
    const submission = submissions.find(s => s.task_id === task.id);
    if (submission) {
      switch (submission.status) {
        case 'approved': return 'bg-green-100 text-green-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        case 'rejected': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
    
    // Check if task is active based on dates
    const now = new Date();
    const startDate = task.start_date ? new Date(task.start_date) : null;
    const endDate = task.end_date ? new Date(task.end_date) : null;
    
    if (startDate && now < startDate) return 'bg-blue-100 text-blue-800';
    if (endDate && now > endDate) return 'bg-gray-100 text-gray-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (task: RealTimeTask) => {
    const submission = submissions.find(s => s.task_id === task.id);
    if (submission) {
      switch (submission.status) {
        case 'approved': return 'Approved';
        case 'pending': return t('student.tasks.under.review');
        case 'rejected': return 'Needs Revision';
        default: return 'Submitted';
      }
    }
    
    // Check if task is active based on dates
    const now = new Date();
    const startDate = task.start_date ? new Date(task.start_date) : null;
    const endDate = task.end_date ? new Date(task.end_date) : null;
    
    if (startDate && now < startDate) return 'Coming Soon';
    if (endDate && now > endDate) return 'Expired';
    return 'Active';
  };

  const getStatusIcon = (task: RealTimeTask) => {
    const submission = submissions.find(s => s.task_id === task.id);
    if (submission) {
      switch (submission.status) {
        case 'approved': return <CheckCircle className="w-4 h-4" />;
        case 'pending': return <Clock className="w-4 h-4" />;
        case 'rejected': return <Clock className="w-4 h-4" />;
        default: return <Clock className="w-4 h-4" />;
      }
    }
    return <Clock className="w-4 h-4" />;
  };

  const getTaskStats = (task: RealTimeTask) => {
    const submission = submissions.find(s => s.task_id === task.id);
    return {
      participants: 0, // This would need to be calculated from submissions
      completed: submission ? 1 : 0,
      timeEstimate: `${task.time_estimate_minutes} min`
    };
  };

  // Filter tasks based on Supabase data
  const activeTasks = tasks.filter(task => {
    const now = new Date();
    const startDate = task.start_date ? new Date(task.start_date) : null;
    const endDate = task.end_date ? new Date(task.end_date) : null;
    return task.is_active && (!startDate || now >= startDate) && (!endDate || now <= endDate);
  });
  
  const completedTasks = tasks.filter(task => {
    const submission = submissions.find(s => s.task_id === task.id);
    return submission && submission.status === 'approved';
  });
  
  const upcomingTasks = tasks.filter(task => {
    const now = new Date();
    const startDate = task.start_date ? new Date(task.start_date) : null;
    return task.is_active && startDate && now < startDate;
  });

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
            <h1 className="text-4xl font-bold text-gray-900">{t('student.tasks.real.time.tasks')}</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('student.tasks.real.time.tasks.desc')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('student.tasks.active.tasks')}</p>
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
                  <p className="text-sm font-medium text-gray-600">{t('student.tasks.completed.tasks')}</p>
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
                  <p className="text-sm font-medium text-gray-600">{t('student.tasks.eco.points.earned')}</p>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('student.tasks.available.now')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTasks.map((task) => {
              // Calculate completion rate based on submissions
              const taskSubmissions = submissions.filter(s => s.task_id === task.id);
              const approvedSubmissions = taskSubmissions.filter(s => s.status === 'approved').length;
              const completionRate = task.max_participants ? (approvedSubmissions / task.max_participants) * 100 : 0;
              
              return (
                <Card key={task.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-green-100 rounded-full">
                            {task.icon && <task.icon className="h-6 w-6 text-green-600" />}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-sm text-gray-700 font-medium">{task.category}</p>
                          </div>
                        </div>
                        <Badge className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>

                      <p className="text-gray-800 font-medium">{task.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-gray-700">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{task.time_estimate_minutes} min</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{taskSubmissions.length} {t('student.tasks.participants')}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span className="font-medium text-green-600">{task.points} {t('student.tasks.points')}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-800 font-medium">{t('student.tasks.completion.rate')}</span>
                            <span className="text-gray-800 font-semibold">{Math.round(completionRate)}%</span>
                          </div>
                          <Progress value={completionRate} className="h-2" />
                        </div>

                        {(() => {
                          const submission = submissions.find(s => s.task_id === task.id);
                          if (submission) {
                            return (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-800 font-medium">{t('student.tasks.status')}</span>
                                  <Badge 
                                    variant={submission.status === 'approved' ? 'default' : 'secondary'}
                                    className={submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  >
                                    {submission.status === 'pending' ? t('student.tasks.under.review') : submission.status}
                                  </Badge>
                                </div>
                                {submission.status === 'pending' && (
                                  <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                                    {t('student.tasks.awaiting.approval')}
                                  </div>
                                )}
                                <Button
                                  onClick={() => navigate(`/afforestation-task`)}
                                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  {t('student.tasks.view.submission')}
                                </Button>
                              </div>
                            );
                          }
                          return (
                            <Button
                              onClick={() => navigate(`/afforestation-task`)}
                              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white"
                            >
                              <Camera className="h-4 w-4 mr-2" />
                              {t('student.tasks.start.task')}
                            </Button>
                          );
                        })()}
                      </div>
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
            <h3 className="text-2xl font-bold mb-2">{t('student.tasks.call.to.action.title')}</h3>
            <p className="text-lg mb-4">
              {t('student.tasks.call.to.action.description')}
            </p>
            <Button
              onClick={() => navigate('/student/achievements')}
              className="bg-gray-800 text-white hover:bg-gray-700 border-2 border-white font-semibold"
            >
              {t('student.tasks.view.progress')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
