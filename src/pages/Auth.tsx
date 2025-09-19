import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserRole } from "@/lib/localAuth";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { signIn, signUp } = useUser();
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

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value as UserRole });
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
          title: t('auth.welcome.back'),
          description: t('auth.login.success'),
        });
        // Redirect based on role
        const redirectPath = result.user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signUp(formData.name, formData.email, formData.password, formData.role);

      if (!result.success) {
        toast({
          title: "Registration Failed",
          description: result.error || "Registration failed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created Successfully! 🎉",
          description: "Welcome to EcoLearn! Redirecting to dashboard...",
        });
        // Redirect based on role
        const redirectPath = result.user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
        setTimeout(() => navigate(redirectPath), 2000);
      }
    } catch (error) {
      console.error("Unexpected registration error:", error);
      toast({
        title: "Registration Failed",
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
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-glow">
              <span className="text-2xl">🌱</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-200 drop-shadow-[0_0_14px_rgba(34,197,94,0.95)] tracking-tight">EcoLearn</h1>
          </div>
          <p className="text-white text-lg md:text-xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            {t('auth.subtitle')}
          </p>
        </div>

        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {t('auth.join.community')}
            </CardTitle>
            <CardDescription>
              {t('auth.start.journey')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('auth.email.placeholder')}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('auth.password.placeholder')}
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
                    {isLoading ? "Signing in..." : t('auth.login.to.ecolearn')}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.full.name')}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder={t('auth.name.placeholder')}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={t('auth.email.placeholder')}
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('auth.password')}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t('auth.password.create.placeholder')}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>I am a:</Label>
                    <RadioGroup
                      value={formData.role}
                      onValueChange={handleRoleChange}
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="student" id="student" />
                        <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer">
                          <span className="text-lg">🎓</span>
                          <span>Student - Learn about environmental topics</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="teacher" id="teacher" />
                        <Label htmlFor="teacher" className="flex items-center space-x-2 cursor-pointer">
                          <span className="text-lg">👩‍🏫</span>
                          <span>Teacher - Manage classes and assignments</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-nature hover:opacity-90 transition-all duration-200 shadow-glow disabled:opacity-50"
                  >
                    {isLoading ? "Creating account..." : t('auth.create.account')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            {t('auth.ready.explore')} 
            <Button
              variant="link"
              className="text-white underline p-0 ml-1"
              onClick={() => navigate("/student/dashboard")}
            >
              {t('auth.view.demo')}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
