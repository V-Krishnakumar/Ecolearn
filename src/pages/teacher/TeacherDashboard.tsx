import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from "@/components/teacher/TeacherNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  BarChart3, 
  Plus,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { TeacherDataManager, Class, Student, Assignment } from "@/lib/teacherData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    averageEcoPoints: 0
  });


  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/auth');
      return;
    }

    loadTeacherData();
  }, [user, navigate]);

  const loadTeacherData = () => {
    if (!user) return;

    const teacherClasses = TeacherDataManager.getTeacherClasses(user.id);
    const allStudents = teacherClasses.flatMap(cls => 
      TeacherDataManager.getClassStudents(cls.id)
    );
    const allAssignments = teacherClasses.flatMap(cls => 
      TeacherDataManager.getClassAssignments(cls.id)
    );

    setClasses(teacherClasses);
    setStudents(allStudents);
    setAssignments(allAssignments);

    const averageEcoPoints = allStudents.length > 0 
      ? allStudents.reduce((sum, student) => sum + student.ecoPoints, 0) / allStudents.length 
      : 0;

    setStats({
      totalClasses: teacherClasses.length,
      totalStudents: allStudents.length,
      totalAssignments: allAssignments.length,
      averageEcoPoints: Math.round(averageEcoPoints)
    });
  };

  const handleCreateClass = () => {
    navigate('/teacher/classes');
  };

  const handleViewClasses = () => {
    navigate('/teacher/classes');
  };

  const handleViewAssignments = () => {
    navigate('/teacher/assignments');
  };

  const handleViewReports = () => {
    navigate('/teacher/reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <TeacherNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-nature rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">🌱</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('teacher.dashboard.welcome').replace('{username}', user?.username || '')}
            </h1>
            {user?.id.startsWith('demo-') && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                {t('demo.mode.badge')}
              </Badge>
            )}
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('teacher.dashboard.subtitle')}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('teacher.dashboard.total.classes')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('teacher.dashboard.total.students')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('teacher.dashboard.active.assignments')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAssignments}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <ClipboardList className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('teacher.dashboard.avg.eco.points')}</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageEcoPoints}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>{t('teacher.dashboard.classes')}</span>
              </CardTitle>
              <CardDescription>
                {t('teacher.dashboard.manage.classes')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classes.length > 0 ? (
                  <div className="space-y-2">
                    {classes.slice(0, 3).map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{cls.name}</p>
                          <p className="text-sm text-gray-600">
                            {TeacherDataManager.getClassStudents(cls.id).length} {t('teacher.dashboard.students')}
                          </p>
                        </div>
                        <Badge variant="secondary">{t('teacher.dashboard.active')}</Badge>
                      </div>
                    ))}
                    {classes.length > 3 && (
                      <p className="text-sm text-gray-500">{t('teacher.dashboard.more.classes').replace('{count}', (classes.length - 3).toString())}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{t('teacher.dashboard.no.classes')}</p>
                    <Button onClick={handleCreateClass} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('teacher.dashboard.create.first.class')}
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleViewClasses}
                >
                  {t('teacher.dashboard.view.all.classes')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-purple-600" />
                <span>{t('teacher.dashboard.recent.assignments')}</span>
              </CardTitle>
              <CardDescription>
                {t('teacher.dashboard.track.assignments')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.length > 0 ? (
                  <div className="space-y-2">
                    {assignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{assignment.title}</p>
                          <p className="text-sm text-gray-600">
                            {t('teacher.dashboard.due')} {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={new Date(assignment.dueDate) > new Date() ? "default" : "destructive"}>
                          {assignment.type}
                        </Badge>
                      </div>
                    ))}
                    {assignments.length > 3 && (
                      <p className="text-sm text-gray-500">{t('teacher.dashboard.more.assignments').replace('{count}', (assignments.length - 3).toString())}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">{t('teacher.dashboard.no.assignments')}</p>
                    <Button onClick={handleViewAssignments} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      {t('teacher.dashboard.create.assignment')}
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleViewAssignments}
                >
                  {t('teacher.dashboard.view.all.assignments')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Students */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>{t('teacher.dashboard.top.students')}</span>
            </CardTitle>
            <CardDescription>
              {t('teacher.dashboard.top.students.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {students.length > 0 ? (
              <div className="space-y-4">
                {students
                  .sort((a, b) => b.ecoPoints - a.ecoPoints)
                  .slice(0, 5)
                  .map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                          <span className="text-sm font-bold text-green-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-600">
                            {t('teacher.dashboard.badges.earned').replace('{count}', student.badges.length.toString())}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{student.ecoPoints} {t('teacher.dashboard.pts')}</p>
                        <div className="flex space-x-1">
                          {student.badges.slice(0, 3).map((badge, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t('teacher.dashboard.no.students')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
