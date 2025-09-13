import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
<<<<<<< HEAD
import { Home, BookOpen, User, Trophy, LogOut, Languages, Camera, GraduationCap } from "lucide-react";
=======
import { Home, BookOpen, User, Trophy, LogOut, Languages, Camera, FileText } from "lucide-react";
>>>>>>> f5560166e88de45d93afeaae6c0b0266a6160204
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language, toggleLanguage, t } = useLanguage();
  const { profile, signOut } = useUser();

  const handleLogout = () => {
    signOut();
    toast({
      title: t('nav.logout.success'),
      description: t('nav.logout.message'),
    });
    navigate("/auth");
  };

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-nature rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">🌱</span>
            </div>
            <span className="text-xl font-bold text-foreground">EcoLearn</span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <Home className="w-4 h-4" />
              <span>{t('nav.dashboard')}</span>
            </NavLink>

            <NavLink
              to="/realtime-tasks"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <Camera className="w-4 h-4" />
              <span>{t('nav.realtime.tasks')}</span>
            </NavLink>

            <NavLink
              to="/scoreboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <Trophy className="w-4 h-4" />
              <span>{t('nav.scoreboard')}</span>
            </NavLink>

<<<<<<< HEAD
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/advanced-modules')}
              className="flex items-center space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Advanced Modules</span>
            </Button>
=======
            <NavLink
              to="/certificate"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <FileText className="w-4 h-4" />
              <span>Certificate</span>
            </NavLink>
>>>>>>> f5560166e88de45d93afeaae6c0b0266a6160204
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center space-x-2"
            title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'en' ? 'हिंदी' : 'English'}</span>
          </Button>
          <div className="flex items-center space-x-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">
              {profile?.username || t('nav.user')}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">{t('nav.logout')}</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}