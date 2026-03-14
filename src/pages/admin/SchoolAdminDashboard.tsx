import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AnimatedBackground from '@/components/AnimatedBackground';

export default function SchoolAdminDashboard() {
  const { profile, signOut } = useUser();

  return (
    <div className="min-h-screen bg-gradient-nature p-6 relative">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10 animate-slide-up">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card hover:shadow-glow transition-all">
            <CardHeader>
              <CardTitle className="text-green-800">Welcome, {profile?.username}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 font-medium capitalize">Role: {profile?.role?.replace('_', ' ')}</p>
              <p className="text-sm text-gray-600">School ID: {profile?.school_id || 'Not assigned'}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card hover:shadow-glow transition-all">
            <CardHeader>
              <CardTitle className="text-green-800">Teacher Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-nature hover:opacity-90 shadow-glow transition-all text-white border-0">Manage Teachers</Button>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-card hover:shadow-glow transition-all">
            <CardHeader>
              <CardTitle className="text-green-800">Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-gradient-nature hover:opacity-90 shadow-glow transition-all text-white border-0">Manage Students</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
