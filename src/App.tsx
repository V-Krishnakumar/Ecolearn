import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
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

const queryClient = new QueryClient();

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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/quiz/:id" element={<Quiz />} />
              <Route path="/scoreboard" element={<Scoreboard />} />
              <Route path="/realtime-tasks" element={<RealTimeTasks />} />
              <Route path="/afforestation-task" element={<AfforestationTask />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
