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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👩‍🏫
          </h1>
          <p className="text-gray-600">
            Manage your classes, assignments, and track student progress
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Classes</p>
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
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Assignments</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg Eco Points</p>
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
                <span>Classes</span>
              </CardTitle>
              <CardDescription>
                Manage your classes and student rosters
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
                            {TeacherDataManager.getClassStudents(cls.id).length} students
                          </p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    ))}
                    {classes.length > 3 && (
                      <p className="text-sm text-gray-500">+{classes.length - 3} more classes</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No classes yet</p>
                    <Button onClick={handleCreateClass} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Class
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleViewClasses}
                >
                  View All Classes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5 text-purple-600" />
                <span>Recent Assignments</span>
              </CardTitle>
              <CardDescription>
                Track assignment progress and due dates
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
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={new Date(assignment.dueDate) > new Date() ? "default" : "destructive"}>
                          {assignment.type}
                        </Badge>
                      </div>
                    ))}
                    {assignments.length > 3 && (
                      <p className="text-sm text-gray-500">+{assignments.length - 3} more assignments</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No assignments yet</p>
                    <Button onClick={handleViewAssignments} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleViewAssignments}
                >
                  View All Assignments
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
              <span>Top Performing Students</span>
            </CardTitle>
            <CardDescription>
              Students with the highest eco points across all classes
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
                            {student.badges.length} badges earned
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{student.ecoPoints} pts</p>
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
                <p className="text-gray-500">No students enrolled yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
