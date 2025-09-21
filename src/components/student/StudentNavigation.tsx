import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  Trophy,
  LogOut,
  User,
  MessageCircle,
  Languages,
  Home,
  Camera,
  GraduationCap,
  FileText,
  Award
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Chatbot from "@/components/Chatbot";

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/student/dashboard',
    icon: Home
  },
  {
    name: 'Real Time Tasks',
    href: '/student/tasks',
    icon: Camera
  },
  {
    name: 'Scoreboard',
    href: '/scoreboard',
    icon: Trophy
  },
  {
    name: 'Achievements',
    href: '/achievements',
    icon: Award
  },
  {
    name: 'Advanced Modules',
    href: '/advanced-modules',
    icon: GraduationCap
  },
  {
    name: 'Certificate',
    href: '/certificate',
    icon: FileText
  }
];

export default function StudentNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useUser();
  const { t, language, toggleLanguage } = useLanguage();

  const handleSignOut = () => {
    signOut();
    navigate('/auth');
  };

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🌱</span>
              </div>
              <span className="text-xl font-bold text-gray-900">EcoLearn</span>
            </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleLanguage}
                className="flex items-center space-x-2"
                title={language === "en" ? "Switch to Hindi" : "Switch to English"}
              >
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === "en" ? "हिंदी" : "English"}
                </span>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex space-x-1 overflow-x-auto">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-3 w-3" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Chatbot for students */}
      <Chatbot />
    </>
  );
}

