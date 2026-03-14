import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import { UserRole } from "@/lib/supabase/types";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, startDemo } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDemoStart = (role: UserRole) => {
    const result = startDemo(role);
    
    if (result.success && result.user) {
      toast({
        title: 'Demo Started! 🎉',
        description: role === 'student' ? 'Welcome to the student demo! Explore lessons and activities.' : 'Welcome to the teacher demo! Manage your classes and assignments.',
      });
      let redirectPath = '/student/dashboard';
      if (role === 'teacher') redirectPath = '/teacher/dashboard';
      else if (role === 'school_admin') redirectPath = '/admin/dashboard';
      else if (role === 'platform_admin') redirectPath = '/platform/dashboard';
      setTimeout(() => navigate(redirectPath), 1000);
    } else {
      toast({
        title: 'Demo Failed',
        description: result.error || 'Unable to start demo. Please try again.',
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn(formData.email, formData.password);

      if (!result.success) {
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials",
          variant: "destructive",
        });
      } else {
        toast({
          title: 'Welcome Back!',
          description: 'Successfully logged in to EcoLearn!',
        });
        let redirectPath = '/student/dashboard';
        if (result.user?.role === 'teacher') redirectPath = '/teacher/dashboard';
        else if (result.user?.role === 'school_admin') redirectPath = '/admin/dashboard';
        else if (result.user?.role === 'platform_admin') redirectPath = '/platform/dashboard';
        setTimeout(() => navigate(redirectPath), 1000);
      }
    } catch (error) {
      console.error("Unexpected login error:", error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-nature flex items-center justify-center p-4">
      <AnimatedBackground />
      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/images/logo.png" 
              alt="EcoLearn" 
              className="h-40 md:h-56 object-contain drop-shadow-[0_4px_16px_rgba(34,197,94,0.4)] transition-transform hover:scale-105 duration-300" 
            />
          </div>
          <p className="text-white text-lg md:text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] mt-4">
            Empowering Environmental Education
          </p>
        </div>

        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Join Our Community
            </CardTitle>
            <CardDescription>
              Start your environmental learning journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-nature hover:opacity-90 transition-all duration-200 shadow-glow disabled:opacity-50"
                  >
                    {isLoading ? "Signing in..." : "Login to EcoLearn"}
                  </Button>
                </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm mb-4">
            Ready to explore? Try our demo!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => handleDemoStart('student')}
            >
              <span className="text-lg mr-2">🎓</span>
              Student Demo
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => handleDemoStart('teacher')}
            >
              <span className="text-lg mr-2">👩‍🏫</span>
              Teacher Demo
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => handleDemoStart('school_admin')}
            >
              <span className="text-lg mr-2">🏢</span>
              School Admin
            </Button>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => handleDemoStart('platform_admin')}
            >
              <span className="text-lg mr-2">⚙️</span>
              Platform Admin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
