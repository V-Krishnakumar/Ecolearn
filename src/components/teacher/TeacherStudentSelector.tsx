import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SchoolStudent {
  id: string;
  name: string;
  email: string;
}

interface TeacherStudentSelectorProps {
  onSelect: (student: { name: string; email: string; id: string } | null) => void;
  selectedId?: string;
}

export function TeacherStudentSelector({ onSelect, selectedId }: TeacherStudentSelectorProps) {
  const { user } = useUser();
  const [students, setStudents] = useState<SchoolStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchoolStudents() {
      if (!user?.school_id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email')
          .eq('school_id', user.school_id)
          .eq('role', 'student');

        if (error) {
          console.error('Error fetching school students:', error);
          return;
        }

        const formatted = (data || []).map(s => ({
          id: s.id,
          name: s.username.split('|')[0] || 'Unknown Student',
          email: s.email
        }));

        setStudents(formatted);
      } catch (err) {
        console.error('Failed to load students:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchoolStudents();
  }, [user]);

  const handleValueChange = (val: string) => {
    const found = students.find(s => s.id === val);
    if (found) {
      onSelect(found);
    } else {
      onSelect(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <Label>Select Student from School Roster</Label>
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500 text-sm animate-pulse">
          Loading students...
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Select Student from School Roster</Label>
        <div className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500 text-sm">
          No available students found in your school.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>Select Student from School Roster</Label>
      <Select value={selectedId} onValueChange={handleValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="-- Choose a student --" />
        </SelectTrigger>
        <SelectContent>
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.name} ({student.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
