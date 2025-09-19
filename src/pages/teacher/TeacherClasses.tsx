import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherNavigation from "@/components/teacher/TeacherNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus,
  BookOpen,
  Calendar
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { TeacherDataManager, Class, Student } from "@/lib/teacherData";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TeacherClasses() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [newClass, setNewClass] = useState({ name: '', description: '' });
  const [newStudent, setNewStudent] = useState({ name: '', email: '' });

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

  const handleCreateClass = () => {
    if (!user || !newClass.name.trim()) return;

    const createdClass = TeacherDataManager.addClass(
      user.id,
      newClass.name.trim(),
      newClass.description.trim()
    );

    setClasses(prev => [...prev, createdClass]);
    setNewClass({ name: '', description: '' });
    setIsCreateDialogOpen(false);
  };

  const handleAddStudent = () => {
    if (!selectedClass || !newStudent.name.trim() || !newStudent.email.trim()) return;

    const createdStudent = TeacherDataManager.addStudent(
      selectedClass.id,
      newStudent.name.trim(),
      newStudent.email.trim()
    );

    setStudents(prev => [...prev, createdStudent]);
    setNewStudent({ name: '', email: '' });
    setIsAddStudentDialogOpen(false);
  };

  const getClassStudents = (classId: string) => {
    return students.filter(student => student.classId === classId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <TeacherNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('teacher.classes.title')}</h1>
            <p className="text-gray-600">{t('teacher.classes.subtitle')}</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('teacher.classes.create.new')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('teacher.classes.create.new')}</DialogTitle>
                <DialogDescription>
                  {t('teacher.classes.create.first')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="className">{t('teacher.classes.class.name')}</Label>
                  <Input
                    id="className"
                    placeholder="e.g., Grade 7 Eco Club"
                    value={newClass.name}
                    onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="classDescription">{t('teacher.classes.description')}</Label>
                  <Textarea
                    id="classDescription"
                    placeholder="Brief description of the class..."
                    value={newClass.description}
                    onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    {t('teacher.classes.cancel')}
                  </Button>
                  <Button onClick={handleCreateClass}>
                    {t('teacher.classes.create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Grid */}
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls) => {
              const classStudents = getClassStudents(cls.id);
              return (
                <Card key={cls.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{cls.name}</CardTitle>
                        {cls.description && (
                          <CardDescription className="mt-2">{cls.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {t('teacher.classes.students.count').replace('{count}', classStudents.length.toString())}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Class Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{t('teacher.classes.students.count').replace('{count}', classStudents.length.toString())}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-green-600" />
                          <span>{t('teacher.classes.assignments.count').replace('{count}', TeacherDataManager.getClassAssignments(cls.id).length.toString())}</span>
                        </div>
                      </div>

                      {/* Students List */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{t('teacher.classes.students.capital')}</h4>
                        {classStudents.length > 0 ? (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {classStudents.map((student) => (
                              <div key={student.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="text-sm font-medium">{student.name}</p>
                                  <p className="text-xs text-gray-600">{t('teacher.classes.eco.points').replace('{points}', student.ecoPoints.toString())}</p>
                                </div>
                                <div className="flex space-x-1">
                                  {student.badges.slice(0, 2).map((badge, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {badge}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500 italic">{t('teacher.classes.no.students.in.class')}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedClass(cls);
                            setIsAddStudentDialogOpen(true);
                          }}
                          className="flex-1"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          {t('teacher.classes.add.student.to.class')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/teacher/classes/${cls.id}`)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          {t('teacher.classes.manage')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('teacher.classes.no.classes.yet')}</h3>
              <p className="text-gray-600 mb-6">
                {t('teacher.classes.create.first.description')}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                {t('teacher.classes.create.your.first.class')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Student Dialog */}
        <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('teacher.classes.add.student.to.class.title').replace('{className}', selectedClass?.name || '')}</DialogTitle>
              <DialogDescription>
                {t('teacher.classes.add.student.to.class.desc')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentName">{t('teacher.classes.student.name')}</Label>
                <Input
                  id="studentName"
                  placeholder={t('teacher.classes.student.name.placeholder')}
                  value={newStudent.name}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="studentEmail">{t('teacher.classes.student.email')}</Label>
                <Input
                  id="studentEmail"
                  type="email"
                  placeholder={t('teacher.classes.student.email.placeholder')}
                  value={newStudent.email}
                  onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddStudentDialogOpen(false)}>
                  {t('teacher.classes.cancel')}
                </Button>
                <Button onClick={handleAddStudent}>
                  {t('teacher.classes.add')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
