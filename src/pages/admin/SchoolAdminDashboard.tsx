import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';
import UserTable from '@/components/admin/UserTable';

export default function SchoolAdminDashboard() {
  const { profile, signOut } = useUser();
  const [activeTab, setActiveTab] = useState<'overview' | 'teachers' | 'students'>('overview');

  return (
    <div className="min-h-screen bg-gradient-nature p-6 relative">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10 animate-slide-up">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-card gap-4">
          <div className="flex items-center space-x-4">
            <img src="/images/logo.png" alt="EcoLearn Logo" className="h-24 md:h-32 object-contain drop-shadow-sm scale-125 origin-left" />
            <div>
              <h1 className="text-3xl font-bold text-green-800">School Admin Portal</h1>
              <p className="text-gray-600">Manage your school's teachers and students</p>
            </div>
          </div>
          <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50" onClick={signOut}>Sign Out</Button>
        </div>

        {/* Global Navigation */}
        <div className="flex space-x-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-card overflow-x-auto">
          <Button 
            variant={activeTab === 'overview' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('overview')}
            className={activeTab === 'overview' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-700'}
          >
            Dashboard Overview
          </Button>
          <Button 
            variant={activeTab === 'teachers' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('teachers')}
            className={activeTab === 'teachers' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-700'}
          >
            Manage Teachers
          </Button>
          <Button 
            variant={activeTab === 'students' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('students')}
            className={activeTab === 'students' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-700'}
          >
            Manage Students
          </Button>
        </div>

        {/* Dynamic Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card hover:shadow-glow transition-all">
              <CardHeader>
                <CardTitle className="text-green-800">Welcome, {profile?.username}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 font-medium capitalize">Role: {profile?.role?.replace('_', ' ')}</p>
                <p className="text-sm text-gray-600">School ID: <span className="font-mono text-xs">{profile?.school_id || 'Not assigned'}</span></p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Tables (Filtered correctly by schoolId) */}
        {activeTab === 'teachers' && profile?.school_id && (
          <UserTable role="teacher" schoolId={profile.school_id} title="Manage Teachers" />
        )}
        
        {activeTab === 'students' && profile?.school_id && (
          <UserTable role="student" schoolId={profile.school_id} title="Manage Students" />
        )}
        
        {/* Fallback error if the admin mysteriously has no school ID mapped */}
        {(activeTab === 'teachers' || activeTab === 'students') && !profile?.school_id && (
          <Card className="bg-red-50 border-0 shadow-card max-w-xl">
            <CardContent className="p-6 text-red-600">
              <h3 className="font-bold text-lg mb-2">Missing Organization Access</h3>
              <p>Your School Admin account is not currently assigned to a school. Please contact the platform administrators to link your school ID.</p>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
