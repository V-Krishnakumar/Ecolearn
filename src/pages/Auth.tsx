import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase"; // Ensure this import is correct
import AnimatedBackground from "@/components/AnimatedBackground";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
<<<<<<< HEAD
    role: "Student",
=======
    role: t('auth.student')
>>>>>>> 2189e27 (Updated project with latest changes)
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
=======
    toast({
      title: t('auth.welcome.back'),
      description: t('auth.login.success'),
>>>>>>> 2189e27 (Updated project with latest changes)
    });
    if (error) {
      console.error("Login error:", error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "Login successful. Redirecting to dashboard...",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { name: formData.name, role: formData.role }, // Store extra user data
      },
=======
    toast({
      title: t('auth.account.created'),
      description: t('auth.registration.success'),
>>>>>>> 2189e27 (Updated project with latest changes)
    });
    if (error) {
      console.error("Sign-up error:", error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      // Optionally insert into profiles table (requires RLS)
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({ id: data.user.id, username: formData.name, created_at: new Date().toISOString() });
      if (profileError) console.error("Profile insert error:", profileError.message);

      toast({
        title: "Account created!",
        description: "Registration successful. Check your email for confirmation.",
      });
      setTimeout(() => navigate("/dashboard"), 1000);
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
                  <Button type="submit" className="w-full bg-gradient-nature hover:opacity-90 transition-all duration-200 shadow-glow">
                    {t('auth.login.to.ecolearn')}
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
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('auth.role')}</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">{t('auth.student')}</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-nature hover:opacity-90 transition-all duration-200 shadow-glow">
                    {t('auth.create.account')}
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
              onClick={() => navigate("/dashboard")}
            >
              {t('auth.view.demo')}
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}