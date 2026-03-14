
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, BookOpen, User, Trophy, LogOut, Camera, GraduationCap, FileText, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageDropdown } from "@/components/LanguageDropdown";

export function Navigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const { profile, signOut } = useUser();


  const handleLogout = () => {
    signOut();
    toast({
      title: t("nav.logout.success"),
      description: t("nav.logout.message"),
    });
    navigate("/auth");
  };

  return (
    <nav key={language} className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
                  {/* Logo and Brand */}
                  <div className="flex items-center space-x-4">
                      <img src="/images/logo.png" alt="EcoLearn Logo" className="h-20 object-contain drop-shadow-sm scale-[1.3] origin-left" />
                    
                  </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Home className="h-4 w-4" />
              <span>{t("nav.dashboard")}</span>
            </NavLink>

            <NavLink
              to="/student/tasks"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Camera className="h-4 w-4" />
              <span>{t("nav.realtime.tasks")}</span>
            </NavLink>

            <NavLink
              to="/scoreboard"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Trophy className="h-4 w-4" />
              <span>{t("nav.scoreboard")}</span>
            </NavLink>

            <NavLink
              to="/advanced-modules"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <GraduationCap className="h-4 w-4" />
              <span>{t("nav.advanced.modules")}</span>
            </NavLink>

            <NavLink
              to="/certificate"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <FileText className="h-4 w-4" />
              <span>{t("nav.certificate")}</span>
            </NavLink>
          </div>

                  {/* User Menu */}
                  <div className="flex items-center space-x-4">
            <LanguageDropdown />
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{profile?.username || t("nav.user")}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.logout")}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 py-2">
          <div className="flex space-x-1 overflow-x-auto">
            <NavLink
              to="/student/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Home className="h-3 w-3" />
              <span>{t("nav.dashboard")}</span>
            </NavLink>

            <NavLink
              to="/student/tasks"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Camera className="h-3 w-3" />
              <span>{t("nav.realtime.tasks")}</span>
            </NavLink>

            <NavLink
              to="/scoreboard"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <Trophy className="h-3 w-3" />
              <span>{t("nav.scoreboard")}</span>
            </NavLink>

            <NavLink
              to="/advanced-modules"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <GraduationCap className="h-3 w-3" />
              <span>{t("nav.advanced.modules")}</span>
            </NavLink>

            <NavLink
              to="/certificate"
              className={({ isActive }) =>
                `flex items-center space-x-1 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`
              }
            >
              <FileText className="h-3 w-3" />
              <span>{t("nav.certificate")}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
