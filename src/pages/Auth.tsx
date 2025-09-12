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

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
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
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { name: formData.name, role: formData.role }, // Store extra user data
      },
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
            Learn about our environment and make a difference!
          </p>
        </div>

        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              Join Our Community
            </CardTitle>
            <CardDescription>
              Start your environmental education journey today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="student@example.com"
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
                  <Button type="submit" className="w-full bg-gradient-nature hover:opacity-90 transition-all duration-200 shadow-glow">
                    Login to EcoLearn
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Alex Student"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="student@example.com"
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
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="border-border focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <span className="text-sm font-medium text-muted-foreground">Student</span>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-nature hover:opacity-90 transition-all duration-200 shadow-glow">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Ready to explore? 
            <Button
              variant="link"
              className="text-white underline p-0 ml-1"
              onClick={() => navigate("/dashboard")}
            >
              View Demo Dashboard
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}