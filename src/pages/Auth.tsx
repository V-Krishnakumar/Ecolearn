import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { createUserProfile } from "@/lib/profile";
import { debugSupabaseConfig, testRegistration } from "@/lib/auth-debug";
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
    role: t('auth.student'), // resolved conflict, using translation
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error.message);
        toast({
          title: "Login Failed",
          description: error.message.includes("Email not confirmed") 
            ? "Please check your email and click the confirmation link, or try registering again."
            : error.message,
          variant: "destructive",
        });
      } else {
        console.log("Login successful:", data.user);
        toast({
          title: t('auth.welcome.back'),
          description: t('auth.login.success'),
        });
        setTimeout(() => navigate("/dashboard"), 1000);
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
      console.log("Starting registration process...");
      
      // First, sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name, role: formData.role }, // Store extra user data
          emailRedirectTo: `${window.location.origin}/dashboard`, // Redirect after email confirmation
        },
      });

      console.log("SignUp response:", { data, error });

      if (error) {
        console.error("Sign-up error:", error.message);
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data.user) {
        console.log("User created successfully:", data.user);
        console.log("Email confirmed:", data.user.email_confirmed_at);
        console.log("User metadata:", data.user.user_metadata);
        
        // Create profile using the utility function
        const profileResult = await createUserProfile(
          data.user.id,
          formData.name,
          formData.role
        );

        if (profileResult.success) {
          console.log("Profile created successfully:", profileResult.profile);
        } else {
          console.error("Profile creation error:", profileResult.error);
        }
        
        // Check if email is confirmed (handle undefined case)
        const isEmailConfirmed = data.user.email_confirmed_at !== null && data.user.email_confirmed_at !== undefined;
        console.log("Is email confirmed:", isEmailConfirmed);
        
        // Show success message
        toast({
          title: "Account Created Successfully! 🎉",
          description: isEmailConfirmed 
            ? "Welcome to EcoLearn! Redirecting to dashboard..."
            : "Account created! You can now log in directly or check your email for confirmation.",
        });
        
        // Navigate based on email confirmation status
        if (isEmailConfirmed) {
          console.log("Email already confirmed, navigating to dashboard");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          console.log("Email not confirmed, but navigating anyway for development");
          // For development/testing, navigate anyway since email confirmation might be disabled
          setTimeout(() => navigate("/dashboard"), 2000);
        }
      } else {
        console.error("No user data returned from signup");
        toast({
          title: "Registration Failed",
          description: "No user data returned. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);
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
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('auth.role')}</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">{t('auth.student')}</span>
                    </div>
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
