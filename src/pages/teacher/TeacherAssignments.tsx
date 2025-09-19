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
  ClipboardList, 
  Plus, 
  Calendar,
  BookOpen,
  FileText,
  Target,
  Clock
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { TeacherDataManager, Class, Assignment } from "@/lib/teacherData";
import { useLanguage } from "@/contexts/LanguageContext";

const LESSON_OPTIONS = [
  { id: 'L1', title: 'Waste Management Basics', type: 'lesson' },
  { id: 'L2', title: 'Water Treatment Process', type: 'lesson' },
  { id: 'L3', title: 'Pollution-Free Zones', type: 'lesson' },
  { id: 'L4', title: 'Afforestation Techniques', type: 'lesson' },
  { id: 'L5', title: 'Deforestation Impact', type: 'lesson' },
  { id: 'L6', title: 'Renewable Energy Sources', type: 'lesson' },
];

export default function TeacherAssignments() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useLanguage();
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    classId: '',
    type: 'lesson' as 'lesson' | 'quiz' | 'task',
    title: '',
    description: '',
    dueDate: '',
    lessonId: ''
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
    const allAssignments = teacherClasses.flatMap(cls => 
      TeacherDataManager.getClassAssignments(cls.id)
    );

    setClasses(teacherClasses);
    setAssignments(allAssignments);
  };

  const handleCreateAssignment = () => {
    if (!newAssignment.classId || !newAssignment.title.trim() || !newAssignment.dueDate) return;

    const createdAssignment = TeacherDataManager.createAssignment(
      newAssignment.classId,
      newAssignment.type,
      newAssignment.title.trim(),
      newAssignment.description.trim(),
      newAssignment.dueDate,
      newAssignment.lessonId || undefined
    );

    setAssignments(prev => [...prev, createdAssignment]);
    setNewAssignment({
      classId: '',
      type: 'lesson',
      title: '',
      description: '',
      dueDate: '',
      lessonId: ''
    });
    setIsCreateDialogOpen(false);
  };

  const getAssignmentTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />;
      case 'quiz': return <FileText className="h-4 w-4" />;
      case 'task': return <Target className="h-4 w-4" />;
      default: return <ClipboardList className="h-4 w-4" />;
    }
  };

  const getAssignmentTypeColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDueDateStatus = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: 'overdue', text: 'Overdue', color: 'text-red-600' };
    if (diffDays === 0) return { status: 'due-today', text: 'Due Today', color: 'text-orange-600' };
    if (diffDays <= 3) return { status: 'due-soon', text: 'Due Soon', color: 'text-yellow-600' };
    return { status: 'upcoming', text: 'Upcoming', color: 'text-green-600' };
  };

  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Unknown Class';
  };

  const getLessonTitle = (lessonId: string) => {
    const lesson = LESSON_OPTIONS.find(l => l.id === lessonId);
    return lesson ? lesson.title : 'Unknown Lesson';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <TeacherNavigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignments</h1>
            <p className="text-gray-600">Create and manage assignments for your classes</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Assign lessons, quizzes, or tasks to your classes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="assignmentClass">Class</Label>
                    <Select
                      value={newAssignment.classId}
                      onValueChange={(value) => setNewAssignment(prev => ({ ...prev, classId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignmentType">Type</Label>
                    <Select
                      value={newAssignment.type}
                      onValueChange={(value: 'lesson' | 'quiz' | 'task') => 
                        setNewAssignment(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lesson">Lesson</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="task">Task</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="assignmentTitle">Title</Label>
                  <Input
                    id="assignmentTitle"
                    placeholder="e.g., Waste Management Quiz"
                    value={newAssignment.title}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="assignmentDescription">Description</Label>
                  <Textarea
                    id="assignmentDescription"
                    placeholder="Describe what students need to do..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {newAssignment.type === 'lesson' && (
                  <div>
                    <Label htmlFor="assignmentLesson">Lesson</Label>
                    <Select
                      value={newAssignment.lessonId}
                      onValueChange={(value) => setNewAssignment(prev => ({ ...prev, lessonId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a lesson" />
                      </SelectTrigger>
                      <SelectContent>
                        {LESSON_OPTIONS.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="assignmentDueDate">Due Date</Label>
                  <Input
                    id="assignmentDueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAssignment}>
                    Create Assignment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Assignments List */}
        {assignments.length > 0 ? (
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const dueStatus = getDueDateStatus(assignment.dueDate);
              return (
                <Card key={assignment.id} className="bg-white shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className={`p-2 rounded-full ${getAssignmentTypeColor(assignment.type)}`}>
                            {getAssignmentTypeIcon(assignment.type)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-600">{getClassName(assignment.classId)}</p>
                          </div>
                        </div>
                        
                        {assignment.description && (
                          <p className="text-gray-700 mb-3">{assignment.description}</p>
                        )}

                        {assignment.lessonId && (
                          <div className="flex items-center space-x-2 mb-3">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">
                              Lesson: {getLessonTitle(assignment.lessonId)}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <Badge className={dueStatus.color}>
                            {dueStatus.text}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Progress
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit
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
              <ClipboardList className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Assignments Yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first assignment to start engaging your students
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Assignment
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
