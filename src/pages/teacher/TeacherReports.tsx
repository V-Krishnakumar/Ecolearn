import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from "@/components/teacher/TeacherNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award,
  BookOpen,
  Target,
  Calendar
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { TeacherDataManager, Class, Student, Assignment, Progress } from "@/lib/teacherData";
import { useLanguage } from "@/hooks/useLanguage";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function TeacherReports() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAssignments: 0,
    averageEcoPoints: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (user?.role !== 'teacher') {
      navigate('/auth');
      return;
    }

    loadData();
  }, [user, navigate]);

  const loadData = () => {
    if (!user) return;

    const teacherClasses = TeacherDataManager.getTeacherClasses(user.id);
    const allStudents = teacherClasses.flatMap(cls => 
      TeacherDataManager.getClassStudents(cls.id)
    );
    const allAssignments = teacherClasses.flatMap(cls => 
      TeacherDataManager.getClassAssignments(cls.id)
    );
    const allProgress = teacherClasses.flatMap(cls => 
      TeacherDataManager.getClassProgress(cls.id)
    );

    setClasses(teacherClasses);
    setStudents(allStudents);
    setAssignments(allAssignments);
    setProgress(allProgress);

    // Calculate stats
    const averageEcoPoints = allStudents.length > 0 
      ? allStudents.reduce((sum, student) => sum + student.ecoPoints, 0) / allStudents.length 
      : 0;

    const completedLessons = allProgress.filter(p => p.completed).length;
    const totalLessons = allProgress.length;
    const completionRate = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    setStats({
      totalStudents: allStudents.length,
      totalAssignments: allAssignments.length,
      averageEcoPoints: Math.round(averageEcoPoints),
      completionRate: Math.round(completionRate)
    });
  };

  const getFilteredData = () => {
    if (selectedClass === 'all') {
      return { students, assignments, progress };
    }

    const classStudents = students.filter(s => s.classId === selectedClass);
    const classAssignments = assignments.filter(a => a.classId === selectedClass);
    const classProgress = progress.filter(p => 
      classStudents.some(s => s.id === p.studentId)
    );

    return { students: classStudents, assignments: classAssignments, progress: classProgress };
  };

  const getEcoPointsData = () => {
    const { students } = getFilteredData();
    return students
      .sort((a, b) => b.ecoPoints - a.ecoPoints)
      .slice(0, 10)
      .map(student => ({
        name: student.name,
        points: student.ecoPoints
      }));
  };

  const getBadgeDistribution = () => {
    const { students } = getFilteredData();
    const badgeCounts: { [key: string]: number } = {};
    
    students.forEach(student => {
      student.badges.forEach(badge => {
        badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
      });
    });

    return Object.entries(badgeCounts)
      .map(([badge, count]) => ({ name: badge, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const getCompletionTrend = () => {
    const { progress } = getFilteredData();
    const monthlyData: { [key: string]: { completed: number; total: number } } = {};

    progress.forEach(p => {
      if (p.completed_at) {
        const month = new Date(p.completed_at).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        });
        if (!monthlyData[month]) {
          monthlyData[month] = { completed: 0, total: 0 };
        }
        monthlyData[month].completed++;
      }
    });

    // Add total attempts
    progress.forEach(p => {
      const month = new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      });
      if (!monthlyData[month]) {
        monthlyData[month] = { completed: 0, total: 0 };
      }
      monthlyData[month].total++;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        completed: data.completed,
        total: data.total,
        rate: data.total > 0 ? (data.completed / data.total) * 100 : 0
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const getAssignmentTypeData = () => {
    const { assignments } = getFilteredData();
    const typeCounts: { [key: string]: number } = {};

    assignments.forEach(assignment => {
      typeCounts[assignment.type] = (typeCounts[assignment.type] || 0) + 1;
    });

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));
  };

  const filteredData = getFilteredData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <TeacherNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-600">Track student progress and class performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.students.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Active Assignments</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredData.assignments.length}</p>
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
                  <p className="text-sm font-medium text-gray-600">Avg Eco Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredData.students.length > 0 
                      ? Math.round(filteredData.students.reduce((sum, s) => sum + s.ecoPoints, 0) / filteredData.students.length)
                      : 0
                    }
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredData.progress.length > 0 
                      ? Math.round((filteredData.progress.filter(p => p.completed).length / filteredData.progress.length) * 100)
                      : 0
                    }%
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Students by Eco Points */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <span>Top Students by Eco Points</span>
              </CardTitle>
              <CardDescription>
                Students with the highest eco points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getEcoPointsData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="points" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Badge Distribution */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <span>Badge Distribution</span>
              </CardTitle>
              <CardDescription>
                Most earned badges across students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getBadgeDistribution()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getBadgeDistribution().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Completion Trend */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>Completion Trend</span>
              </CardTitle>
              <CardDescription>
                Monthly completion rate over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getCompletionTrend()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Types */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Assignment Types</span>
              </CardTitle>
              <CardDescription>
                Distribution of assignment types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getAssignmentTypeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
