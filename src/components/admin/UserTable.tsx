import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserRole } from '@/lib/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Loader2, Users, Plus, Edit2, Trash2 } from 'lucide-react';

interface UserTableProps {
  role: UserRole;
  schoolId: string;
  title: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  created_at: string;
  _hash?: string;
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

export default function UserTable({ role, schoolId, title }: UserTableProps) {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    if (!schoolId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, created_at')
        .eq('role', role)
        .eq('school_id', schoolId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const cleanData = (data || []).map(u => {
        const [name, hash] = u.username.split('|');
        return {
          id: u.id,
          name: name || u.username,
          email: u.email,
          created_at: u.created_at,
          _hash: hash
        };
      });

      setUsers(cleanData);
      setError(null);
    } catch (err: any) {
      console.error(`Error fetching ${role}s:`, err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, schoolId]);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, password: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name}? This action cannot be undone.`)) return;
    
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsSubmitting(true);
    try {
      if (editingUser) {
        // UPDATE Existing
        let finalUsername = formData.name.trim();
        if (formData.password) {
          finalUsername += '|' + hashPassword(formData.password);
        } else if (editingUser._hash) {
          finalUsername += '|' + editingUser._hash;
        }

        const { error } = await supabase.from('profiles').update({
          username: finalUsername,
          email: formData.email.trim()
        }).eq('id', editingUser.id);
        
        if (error) throw error;
      } else {
        // CREATE New
        const targetPassword = formData.password || 'password123';
        const hashedPassword = hashPassword(targetPassword);
        const compositeUsername = `${formData.name.trim()}|${hashedPassword}`;

        const { error } = await supabase.from('profiles').insert({
          username: compositeUsername,
          email: formData.email.trim(),
          role: role,
          school_id: schoolId
        });
        
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchUsers(); // Refresh the list
    } catch (err: any) {
      console.error('Error saving user:', err);
      alert('Failed to save user: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && users.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {title}
            </div>
            <Button disabled variant="outline"><Loader2 className="w-4 h-4 animate-spin" /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {title} ({users.length})
          </div>
          <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add New
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md border border-red-100 text-sm">
            {error}
          </div>
        )}

        {users.length === 0 && !error ? (
          <p className="text-gray-500 text-center py-8 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
            No {title.toLowerCase()} found. Click "Add New" to build your roster.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Email</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="bg-white border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditModal(user)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8 px-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(user.id, user.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Add / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-green-800">
              {editingUser ? 'Edit User Profile' : `Add New ${role === 'student' ? 'Student' : 'Teacher'}`}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input 
                required
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                required
                type="email"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="jane@example.com"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-sm font-medium text-gray-700">
                {editingUser ? 'Update Password (optional)' : 'Initial Password'}
              </label>
              <input 
                type="text"
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder={editingUser ? "Leave blank to keep current" : "Defaults to: password123"}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingUser ? 'Save Changes' : 'Create Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
