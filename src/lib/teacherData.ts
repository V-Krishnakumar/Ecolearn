// src/lib/teacherData.ts
export interface Teacher {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Class {
  id: string;
  teacherId: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  classId: string;
  ecoPoints: number;
  badges: string[];
  created_at: string;
}

export interface Assignment {
  id: string;
  classId: string;
  type: 'lesson' | 'quiz' | 'task';
  lessonId?: string;
  title: string;
  description: string;
  dueDate: string;
  created_at: string;
}

export interface Progress {
  studentId: string;
  lessonId: string;
  completed: boolean;
  quizScore?: number;
  completed_at?: string;
}

export interface TeacherData {
  teachers: Teacher[];
  classes: Class[];
  students: Student[];
  assignments: Assignment[];
  progress: Progress[];
}

export class TeacherDataManager {
  private static readonly STORAGE_KEY = 'ecolearn_teacher_data';

  /**
   * Get all teacher data from localStorage
   */
  static getTeacherData(): TeacherData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.getDefaultData();
    } catch (error) {
      console.error('Error getting teacher data:', error);
      return this.getDefaultData();
    }
  }

  /**
   * Save teacher data to localStorage
   */
  static saveTeacherData(data: TeacherData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving teacher data:', error);
    }
  }

  /**
   * Get default teacher data with sample data
   */
  private static getDefaultData(): TeacherData {
    return {
      teachers: [
        {
          id: 'T1',
          name: 'Mrs. Sharma',
          email: 'sharma@example.com',
          created_at: new Date().toISOString()
        }
      ],
      classes: [
        {
          id: 'C1',
          teacherId: 'T1',
          name: 'Grade 7 Eco Club',
          description: 'Environmental science class for grade 7 students',
          created_at: new Date().toISOString()
        }
      ],
      students: [
        {
          id: 'S1',
          name: 'Aarav',
          email: 'aarav@example.com',
          classId: 'C1',
          ecoPoints: 120,
          badges: ['Green Hero'],
          created_at: new Date().toISOString()
        },
        {
          id: 'S2',
          name: 'Priya',
          email: 'priya@example.com',
          classId: 'C1',
          ecoPoints: 95,
          badges: ['Recycling Champion'],
          created_at: new Date().toISOString()
        }
      ],
      assignments: [
        {
          id: 'A1',
          classId: 'C1',
          type: 'lesson',
          lessonId: 'L1',
          title: 'Waste Management Basics',
          description: 'Learn about the 3 R\'s of waste management',
          dueDate: '2025-01-25',
          created_at: new Date().toISOString()
        }
      ],
      progress: [
        {
          studentId: 'S1',
          lessonId: 'L1',
          completed: true,
          quizScore: 8,
          completed_at: new Date().toISOString()
        }
      ]
    };
  }

  /**
   * Add a new class
   */
  static addClass(teacherId: string, name: string, description?: string): Class {
    const data = this.getTeacherData();
    const newClass: Class = {
      id: this.generateId(),
      teacherId,
      name,
      description,
      created_at: new Date().toISOString()
    };
    
    data.classes.push(newClass);
    this.saveTeacherData(data);
    return newClass;
  }

  /**
   * Add a student to a class
   */
  static addStudent(classId: string, name: string, email: string): Student {
    const data = this.getTeacherData();
    const newStudent: Student = {
      id: this.generateId(),
      name,
      email,
      classId,
      ecoPoints: 0,
      badges: [],
      created_at: new Date().toISOString()
    };
    
    data.students.push(newStudent);
    this.saveTeacherData(data);
    return newStudent;
  }

  /**
   * Create a new assignment
   */
  static createAssignment(
    classId: string,
    type: 'lesson' | 'quiz' | 'task',
    title: string,
    description: string,
    dueDate: string,
    lessonId?: string
  ): Assignment {
    const data = this.getTeacherData();
    const newAssignment: Assignment = {
      id: this.generateId(),
      classId,
      type,
      title,
      description,
      dueDate,
      lessonId,
      created_at: new Date().toISOString()
    };
    
    data.assignments.push(newAssignment);
    this.saveTeacherData(data);
    return newAssignment;
  }

  /**
   * Update student progress
   */
  static updateProgress(studentId: string, lessonId: string, completed: boolean, quizScore?: number): void {
    const data = this.getTeacherData();
    const existingIndex = data.progress.findIndex(
      p => p.studentId === studentId && p.lessonId === lessonId
    );
    
    const progressEntry: Progress = {
      studentId,
      lessonId,
      completed,
      quizScore,
      completed_at: completed ? new Date().toISOString() : undefined
    };
    
    if (existingIndex >= 0) {
      data.progress[existingIndex] = progressEntry;
    } else {
      data.progress.push(progressEntry);
    }
    
    this.saveTeacherData(data);
  }

  /**
   * Award a badge to a student
   */
  static awardBadge(studentId: string, badgeName: string): void {
    const data = this.getTeacherData();
    const student = data.students.find(s => s.id === studentId);
    if (student && !student.badges.includes(badgeName)) {
      student.badges.push(badgeName);
      this.saveTeacherData(data);
    }
  }

  /**
   * Get classes for a teacher
   */
  static getTeacherClasses(teacherId: string): Class[] {
    const data = this.getTeacherData();
    return data.classes.filter(c => c.teacherId === teacherId);
  }

  /**
   * Get students in a class
   */
  static getClassStudents(classId: string): Student[] {
    const data = this.getTeacherData();
    return data.students.filter(s => s.classId === classId);
  }

  /**
   * Get assignments for a class
   */
  static getClassAssignments(classId: string): Assignment[] {
    const data = this.getTeacherData();
    return data.assignments.filter(a => a.classId === classId);
  }

  /**
   * Get progress for a class
   */
  static getClassProgress(classId: string): Progress[] {
    const data = this.getTeacherData();
    const classStudents = this.getClassStudents(classId);
    const studentIds = classStudents.map(s => s.id);
    return data.progress.filter(p => studentIds.includes(p.studentId));
  }

  /**
   * Create demo data for a demo teacher
   */
  static createDemoData(teacherId: string): void {
    const data = this.getTeacherData();
    
    // Create demo classes
    const demoClass1 = this.addClass(teacherId, 'Environmental Science 101', 'Introduction to environmental concepts');
    const demoClass2 = this.addClass(teacherId, 'Eco Warriors Club', 'Advanced environmental studies');
    
    // Create demo students for class 1
    this.addStudent(demoClass1.id, 'Alex Johnson', 'alex.j@demo.com');
    this.addStudent(demoClass1.id, 'Sarah Chen', 'sarah.c@demo.com');
    this.addStudent(demoClass1.id, 'Michael Brown', 'michael.b@demo.com');
    
    // Create demo students for class 2
    this.addStudent(demoClass2.id, 'Emma Wilson', 'emma.w@demo.com');
    this.addStudent(demoClass2.id, 'David Lee', 'david.l@demo.com');
    
    // Add some eco points and badges to students
    const allStudents = data.students.filter(s => s.classId === demoClass1.id || s.classId === demoClass2.id);
    allStudents.forEach((student, index) => {
      student.ecoPoints = Math.floor(Math.random() * 150) + 50; // 50-200 points
      student.badges = this.getRandomBadges();
    });
    
    // Create demo assignments
    this.createAssignment(
      demoClass1.id,
      'lesson',
      'Waste Management Basics',
      'Learn about the 3 R\'s of waste management',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      '1'
    );
    
    this.createAssignment(
      demoClass1.id,
      'quiz',
      'Water Treatment Quiz',
      'Test your knowledge about water treatment processes',
      new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 10 days from now
      '2'
    );
    
    this.createAssignment(
      demoClass2.id,
      'task',
      'Climate Change Research Project',
      'Research and present on climate change impacts',
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      '3'
    );
    
    this.saveTeacherData(data);
  }

  /**
   * Get random badges for demo students
   */
  private static getRandomBadges(): string[] {
    const allBadges = [
      'Green Hero',
      'Recycling Champion',
      'Water Saver',
      'Energy Efficient',
      'Eco Warrior',
      'Climate Advocate',
      'Biodiversity Protector',
      'Waste Reducer'
    ];
    
    const numBadges = Math.floor(Math.random() * 3) + 1; // 1-3 badges
    const shuffled = allBadges.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numBadges);
  }

  /**
   * Generate a simple ID
   */
  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

