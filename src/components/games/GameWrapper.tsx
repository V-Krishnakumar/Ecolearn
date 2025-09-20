import { ReactNode, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Star, Trophy, ArrowRight } from "lucide-react";

interface GameWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  score: number;
  maxScore: number;
  progress: number;
  onRestart: () => void;
  onComplete: () => void;
  isCompleted: boolean;
  gameIcon: string;
}

export function GameWrapper({
  title,
  description,
  children,
  score,
  maxScore,
  progress,
  onRestart,
  onComplete,
  isCompleted,
  gameIcon
}: GameWrapperProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (isCompleted && !showCelebration) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    } else if (!isCompleted && showCelebration) {
      // Hide celebration immediately when game is restarted
      setShowCelebration(false);
    }
  }, [isCompleted, showCelebration]);

  const getScoreColor = () => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-success";
    if (percentage >= 60) return "text-accent";
    return "text-secondary";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Game Header */}
      <Card className="shadow-card mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{gameIcon}</div>
              <div>
                <CardTitle className="text-2xl text-foreground">{title}</CardTitle>
                <p className="text-muted-foreground mt-1">{description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getScoreColor()}`}>
                  {score}
                </div>
                <div className="text-xs text-muted-foreground">
                  / {maxScore} points
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onRestart}
                className="shrink-0"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Game Area */}
      <Card className="shadow-card mb-6">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>

      {/* Progress & Status */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent" />
              <span className="font-medium">Game Progress</span>
            </div>
            <Badge variant={isCompleted ? "default" : "secondary"} className={isCompleted ? "bg-success" : ""}>
              {isCompleted ? "Completed!" : `${Math.round(progress)}%`}
            </Badge>
          </div>

          <Progress value={progress} className="h-3 mb-4" />

          {isCompleted && (
            <div className="text-center">
              <Button
                onClick={onComplete}
                className="bg-gradient-nature hover:opacity-90"
                size="lg"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Quiz
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-scale-pulse">
            <div className="bg-success text-success-foreground px-8 py-4 rounded-lg shadow-glow text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <div className="text-2xl font-bold">🎉 Game Complete! 🎉</div>
              <div className="text-lg">Score: {score}/{maxScore}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}