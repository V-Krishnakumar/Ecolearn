import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Lesson from "./pages/Lesson";
import Quiz from "./pages/Quiz";
import Scoreboard from "./pages/Scoreboard";
import RealTimeTasks from "./pages/RealTimeTasks";
import AfforestationTask from "./pages/AfforestationTask";
import EnvironmentalPolicy from "./pages/EnvironmentalPolicy";
import ClimateChange from "./pages/ClimateChange";
import Biodiversity from "./pages/Biodiversity";
import AdvancedModules from "./pages/AdvancedModules";
import Achievements from "./pages/Achievements";
import CertificatePage from "./pages/CertificatePage";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentLessons from "./pages/student/StudentLessons";
import StudentTasks from "./pages/student/StudentTasks";

// Teacher pages
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherClasses from "./pages/teacher/TeacherClasses";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherReports from "./pages/teacher/TeacherReports";
import TeacherAchievements from "./pages/teacher/TeacherAchievements";

const queryClient = new QueryClient();

// Role-based route wrapper
const RoleRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Allow demo users to access their respective dashboards
  if (!allowedRoles.includes(user.role)) {
    // If it's a demo user, redirect to appropriate dashboard
    if (user.id.startsWith('demo-')) {
      const demoRole = user.role;
      return <Navigate to={`/${demoRole}/dashboard`} replace />;
    }
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Legacy routes - redirect to role-based routes */}
              <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
              <Route path="/realtime-tasks" element={<Navigate to="/student/tasks" replace />} />
              <Route path="/achievements" element={<Navigate to="/student/achievements" replace />} />
              
              {/* Student routes */}
              <Route path="/student/dashboard" element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleRoute>
              } />
              <Route path="/student/lessons" element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentLessons />
                </RoleRoute>
              } />
              <Route path="/student/tasks" element={
                <RoleRoute allowedRoles={['student']}>
                  <StudentTasks />
                </RoleRoute>
              } />
              <Route path="/student/achievements" element={
                <RoleRoute allowedRoles={['student']}>
                  <Achievements />
                </RoleRoute>
              } />
              
              {/* Teacher routes */}
              <Route path="/teacher/dashboard" element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </RoleRoute>
              } />
              <Route path="/teacher/classes" element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherClasses />
                </RoleRoute>
              } />
              <Route path="/teacher/assignments" element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherAssignments />
                </RoleRoute>
              } />
              <Route path="/teacher/reports" element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherReports />
                </RoleRoute>
              } />
              <Route path="/teacher/achievements" element={
                <RoleRoute allowedRoles={['teacher']}>
                  <TeacherAchievements />
                </RoleRoute>
              } />
              
              {/* Shared routes */}
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/quiz/:id" element={<Quiz />} />
              <Route path="/scoreboard" element={<Scoreboard />} />
              <Route path="/afforestation-task" element={<AfforestationTask />} />
              <Route path="/lesson/environmental-policy" element={<EnvironmentalPolicy />} />
              <Route path="/lesson/climate-change" element={<ClimateChange />} />
              <Route path="/lesson/biodiversity" element={<Biodiversity />} />
              <Route path="/advanced-modules" element={<AdvancedModules />} />
              <Route path="/certificate" element={<CertificatePage />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
