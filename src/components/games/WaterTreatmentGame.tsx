import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { DragDropProvider, useDragDrop } from "./DragDropContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Scenario {
  id: string;
  title: string;
  problem: string;
  image: string;
  solutions: string[];
  correctSolution: string;
  solved: boolean;
  description: string;
}

const scenarios: Scenario[] = [
  {
    id: "1",
    title: "Leaky Tap",
    problem: "Water is dripping from this tap, wasting precious water!",
    image: "🚰",
    solutions: ["Ignore it", "Turn off valve", "Add more taps"],
    correctSolution: "Turn off valve",
    solved: false,
    description: "Fixing leaks saves thousands of gallons per year!"
  },
  {
    id: "2", 
    title: "Dirty Water",
    problem: "This water source is contaminated and needs treatment.",
    image: "🌊",
    solutions: ["Drink anyway", "Install filter", "Boil in microwave"],
    correctSolution: "Install filter",
    solved: false,
    description: "Water filters remove 99% of harmful contaminants!"
  },
  {
    id: "3",
    title: "Rain Collection", 
    problem: "It's raining! How can we collect this clean water?",
    image: "🌧️",
    solutions: ["Let it drain away", "Install rain barrel", "Use buckets only"],
    correctSolution: "Install rain barrel",
    solved: false,
    description: "Rainwater harvesting reduces water bills by 40%!"
  },
  {
    id: "4",
    title: "Wastewater",
    problem: "This dirty water needs to be cleaned before returning to nature.",
    image: "🏭",
    solutions: ["Pour down drain", "Treatment plant", "Bury underground"],
    correctSolution: "Treatment plant",
    solved: false,
    description: "Treatment plants clean 95% of pollutants from wastewater!"
  },
  {
    id: "5",
    title: "Garden Watering",
    problem: "These plants need water, but we should conserve it.",
    image: "🌱",
    solutions: ["Use sprinkler all day", "Drip irrigation", "Water at noon"],
    correctSolution: "Drip irrigation",
    solved: false,
    description: "Drip irrigation uses 50% less water than sprinklers!"
  }
];

function ScenarioCard({ 
  scenario, 
  onSolutionSelect 
}: { 
  scenario: Scenario; 
  onSolutionSelect: (scenarioId: string, solution: string) => void 
}) {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSolutionClick = (solution: string) => {
    if (scenario.solved) return;
    
    setSelectedSolution(solution);
    setShowResult(true);
    onSolutionSelect(scenario.id, solution);
    
    setTimeout(() => {
      setShowResult(false);
      setSelectedSolution(null);
    }, 2000);
  };

  return (
    <Card className={`transition-all duration-300 ${scenario.solved ? 'bg-success/10 border-success' : 'hover:shadow-glow'}`}>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="text-6xl mb-3">{scenario.image}</div>
          <h3 className="font-bold text-lg mb-2">{scenario.title}</h3>
          <p className="text-muted-foreground text-sm">{scenario.problem}</p>
        </div>

        {scenario.solved ? (
          <div className="text-center space-y-3">
            <Badge className="bg-success text-success-foreground">
              ✅ Solved!
            </Badge>
            <p className="text-sm text-success font-medium">
              {scenario.description}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-center">Choose the best solution:</p>
            <div className="space-y-2">
              {scenario.solutions.map((solution) => (
                <Button
                  key={solution}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSolutionClick(solution)}
                  disabled={showResult}
                >
                  {solution}
                </Button>
              ))}
            </div>
            
            {showResult && selectedSolution && (
              <div className={`text-center p-3 rounded-lg animate-bounce-gentle ${
                selectedSolution === scenario.correctSolution 
                  ? 'bg-success/20 text-success' 
                  : 'bg-destructive/20 text-destructive'
              }`}>
                {selectedSolution === scenario.correctSolution ? (
                  <div>
                    <div className="font-bold">🎉 Correct!</div>
                    <div className="text-sm">{scenario.description}</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold">❌ Try again!</div>
                    <div className="text-sm">Think about water conservation!</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WaterGameContent({ onScoreUpdate }: { onScoreUpdate: (score: number, progress: number) => void }) {
  const [gameScenarios, setGameScenarios] = useState<Scenario[]>(scenarios);
  const [score, setScore] = useState(0);

  const handleSolutionSelect = (scenarioId: string, solution: string) => {
    const scenario = gameScenarios.find(s => s.id === scenarioId);
    if (!scenario || scenario.solved) return;

    const isCorrect = solution === scenario.correctSolution;
    const newScore = isCorrect ? score + 20 : score;
    
    if (isCorrect) {
      setGameScenarios(prev => 
        prev.map(s => s.id === scenarioId ? { ...s, solved: true } : s)
      );
      toast.success("Great solution! +20 points");
    } else {
      toast.error("Not the best choice. Try thinking about conservation!");
    }
    
    setScore(newScore);
    
    const solvedCount = gameScenarios.filter(s => s.solved).length + (isCorrect ? 1 : 0);
    const progress = (solvedCount / scenarios.length) * 100;
    
    onScoreUpdate(newScore, progress);
  };

  const restart = () => {
    setGameScenarios(scenarios.map(s => ({ ...s, solved: false })));
    setScore(0);
    onScoreUpdate(0, 0);
  };

  useEffect(() => {
    const solvedCount = gameScenarios.filter(s => s.solved).length;
    const progress = (solvedCount / scenarios.length) * 100;
    onScoreUpdate(score, progress);
  }, []);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">💧 Fix the Flow!</h3>
        <p className="text-muted-foreground">
          Solve water problems by choosing the best conservation solution. Each correct answer earns 20 points!
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onSolutionSelect={handleSolutionSelect}
          />
        ))}
      </div>

      {/* Restart Button */}
      <div className="text-center">
        <Button onClick={restart} variant="outline">
          Reset Game
        </Button>
      </div>
    </div>
  );
}

export function WaterTreatmentGame({ onComplete }: { onComplete: () => void }) {
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [key, setKey] = useState(0);

  const handleScoreUpdate = (newScore: number, newProgress: number) => {
    setScore(newScore);
    setProgress(newProgress);
  };

  const handleRestart = () => {
    setScore(0);
    setProgress(0);
    setKey(key + 1);
  };

  return (
    <DragDropProvider>
      <GameWrapper
        title="Fix the Flow!"
        description="Solve water conservation challenges with smart solutions"
        score={score}
        maxScore={100}
        progress={progress}
        onRestart={handleRestart}
        onComplete={onComplete}
        isCompleted={progress >= 100}
        gameIcon="💧"
      >
        <WaterGameContent key={key} onScoreUpdate={handleScoreUpdate} />
      </GameWrapper>
    </DragDropProvider>
  );
}