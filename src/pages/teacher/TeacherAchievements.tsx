import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from "@/components/teacher/TeacherNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Award, 
  Plus, 
  Star,
  Users,
  Target,
  Gift,
  Trophy
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { TeacherDataManager, Class, Student } from "@/lib/teacherData";
import { useLanguage } from "@/contexts/LanguageContext";

const PREDEFINED_BADGES = [
  { name: 'Green Hero', description: 'For outstanding environmental awareness', color: 'bg-green-100 text-green-800' },
  { name: 'Recycling Champion', description: 'For excellent recycling practices', color: 'bg-blue-100 text-blue-800' },
  { name: 'Energy Saver', description: 'For energy conservation efforts', color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Water Warrior', description: 'For water conservation activities', color: 'bg-cyan-100 text-cyan-800' },
  { name: 'Eco Innovator', description: 'For creative environmental solutions', color: 'bg-purple-100 text-purple-800' },
  { name: 'Nature Lover', description: 'For appreciation of nature', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'Climate Champion', description: 'For climate action leadership', color: 'bg-orange-100 text-orange-800' },
  { name: 'Sustainability Star', description: 'For sustainable living practices', color: 'bg-pink-100 text-pink-800' },
];

export default function TeacherAchievements() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBadge, setSelectedBadge] = useState('');
  const [customBadge, setCustomBadge] = useState({ name: '', description: '' });

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

    setClasses(teacherClasses);
    setStudents(allStudents);
  };

  const handleAwardBadge = () => {
    if (!selectedStudent || !selectedBadge) return;

    const badgeName = selectedBadge === 'custom' ? customBadge.name : selectedBadge;
    if (!badgeName.trim()) return;

    TeacherDataManager.awardBadge(selectedStudent.id, badgeName.trim());
    
    // Update local state
    setStudents(prev => prev.map(student => 
      student.id === selectedStudent.id 
        ? { ...student, badges: [...student.badges, badgeName.trim()] }
        : student
    ));

    setSelectedStudent(null);
    setSelectedBadge('');
    setCustomBadge({ name: '', description: '' });
    setIsAwardDialogOpen(false);
  };

  const getStudentBadges = (student: Student) => {
    return student.badges.map(badgeName => {
      const predefined = PREDEFINED_BADGES.find(b => b.name === badgeName);
      return {
        name: badgeName,
        description: predefined?.description || 'Custom achievement',
        color: predefined?.color || 'bg-gray-100 text-gray-800'
      };
    });
  };

  const getBadgeStats = () => {
    const badgeCounts: { [key: string]: number } = {};
    
    students.forEach(student => {
      student.badges.forEach(badge => {
        badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
      });
    });

    return Object.entries(badgeCounts)
      .map(([badge, count]) => ({
        badge,
        count,
        percentage: (count / students.length) * 100
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <TeacherNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Achievements & Badges</h1>
            <p className="text-gray-600">Award badges and track student achievements</p>
          </div>
          <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                <Plus className="h-4 w-4 mr-2" />
                Award Badge
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Award Badge to Student</DialogTitle>
                <DialogDescription>
                  Recognize student achievements with badges
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="studentSelect">Select Student</Label>
                  <Select
                    value={selectedStudent?.id || ''}
                    onValueChange={(value) => {
                      const student = students.find(s => s.id === value);
                      setSelectedStudent(student || null);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} ({getClassName(student.classId)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="badgeSelect">Select Badge</Label>
                  <Select
                    value={selectedBadge}
                    onValueChange={setSelectedBadge}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a badge" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREDEFINED_BADGES.map((badge) => (
                        <SelectItem key={badge.name} value={badge.name}>
                          <div className="flex items-center space-x-2">
                            <Badge className={badge.color}>{badge.name}</Badge>
                            <span className="text-sm text-gray-600">{badge.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Create Custom Badge</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedBadge === 'custom' && (
                  <>
                    <div>
                      <Label htmlFor="customBadgeName">Badge Name</Label>
                      <Input
                        id="customBadgeName"
                        placeholder="e.g., Eco Innovator"
                        value={customBadge.name}
                        onChange={(e) => setCustomBadge(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="customBadgeDescription">Description</Label>
                      <Textarea
                        id="customBadgeDescription"
                        placeholder="Describe what this badge represents..."
                        value={customBadge.description}
                        onChange={(e) => setCustomBadge(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAwardDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAwardBadge}>
                    Award Badge
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Badge Statistics */}
        <Card className="bg-white shadow-lg border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Badge Statistics</span>
            </CardTitle>
            <CardDescription>
              Most awarded badges across all students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {getBadgeStats().slice(0, 4).map((stat) => (
                <div key={stat.badge} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                  <div className="text-sm text-gray-600">{stat.badge}</div>
                  <div className="text-xs text-gray-500">{stat.percentage.toFixed(1)}% of students</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students with Achievements */}
        <div className="space-y-6">
          {students.length > 0 ? (
            students
              .filter(student => student.badges.length > 0)
              .sort((a, b) => b.badges.length - a.badges.length)
              .map((student) => (
                <Card key={student.id} className="bg-white shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-gray-600">{getClassName(student.classId)}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-sm text-gray-500">
                                {student.ecoPoints} eco points
                              </span>
                              <Badge variant="secondary">
                                {student.badges.length} badges
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getStudentBadges(student).map((badge, index) => (
                            <Badge key={index} className={badge.color}>
                              <Star className="h-3 w-3 mr-1" />
                              {badge.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsAwardDialogOpen(true);
                          }}
                        >
                          <Gift className="h-4 w-4 mr-1" />
                          Award Badge
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card className="bg-white shadow-lg border-0">
              <CardContent className="text-center py-12">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Yet</h3>
                <p className="text-gray-600 mb-6">
                  Add students to your classes to start awarding badges
                </p>
                <Button onClick={() => navigate('/teacher/classes')} className="bg-blue-600 hover:bg-blue-700">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Classes
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Students without badges */}
        {students.filter(s => s.badges.length === 0).length > 0 && (
          <Card className="bg-white shadow-lg border-0 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-gray-600" />
                <span>Students Without Badges</span>
              </CardTitle>
              <CardDescription>
                Encourage these students to earn their first badge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {students
                  .filter(s => s.badges.length === 0)
                  .map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-600">{getClassName(student.classId)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setIsAwardDialogOpen(true);
                        }}
                      >
                        Award First Badge
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
