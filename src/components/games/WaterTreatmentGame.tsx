import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { DragDropProvider, useDragDrop } from "./DragDropContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

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

const getScenarios = (t: (key: string) => string): Scenario[] => [
  {
    id: "1",
    title: t('game.water.leaky.tap'),
    problem: t('game.water.leaky.tap.problem'),
    image: "🚰",
    solutions: t('game.water.leaky.tap.solutions').split(','),
    correctSolution: t('game.water.leaky.tap.correct'),
    solved: false,
    description: t('game.water.leaky.tap.description')
  },
  {
    id: "2", 
    title: t('game.water.dirty.water'),
    problem: t('game.water.dirty.water.problem'),
    image: "🌊",
    solutions: t('game.water.dirty.water.solutions').split(','),
    correctSolution: t('game.water.dirty.water.correct'),
    solved: false,
    description: t('game.water.dirty.water.description')
  },
  {
    id: "3",
    title: t('game.water.rain.collection'), 
    problem: t('game.water.rain.collection.problem'),
    image: "🌧️",
    solutions: t('game.water.rain.collection.solutions').split(','),
    correctSolution: t('game.water.rain.collection.correct'),
    solved: false,
    description: t('game.water.rain.collection.description')
  },
  {
    id: "4",
    title: t('game.water.wastewater'),
    problem: t('game.water.wastewater.problem'),
    image: "🏭",
    solutions: t('game.water.wastewater.solutions').split(','),
    correctSolution: t('game.water.wastewater.correct'),
    solved: false,
    description: t('game.water.wastewater.description')
  },
  {
    id: "5",
    title: t('game.water.garden.watering'),
    problem: t('game.water.garden.watering.problem'),
    image: "🌱",
    solutions: t('game.water.garden.watering.solutions').split(','),
    correctSolution: t('game.water.garden.watering.correct'),
    solved: false,
    description: t('game.water.garden.watering.description')
  }
];

function ScenarioCard({ 
  scenario, 
  onSolutionSelect 
}: { 
  scenario: Scenario; 
  onSolutionSelect: (scenarioId: string, solution: string) => void 
}) {
  const { t } = useLanguage();
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
              ✅ {t('game.water.solved')}
            </Badge>
            <p className="text-sm text-success font-medium">
              {scenario.description}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-center">{t('game.water.choose.solution')}</p>
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
                    <div className="font-bold">🎉 {t('game.water.correct')}</div>
                    <div className="text-sm">{scenario.description}</div>
                  </div>
                ) : (
                  <div>
                    <div className="font-bold">❌ {t('game.water.try.again')}</div>
                    <div className="text-sm">{t('game.water.think.conservation')}</div>
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
  const { t } = useLanguage();
  const scenarios = getScenarios(t);
  const [gameScenarios, setGameScenarios] = useState<Scenario[]>(scenarios);
  const [score, setScore] = useState(0);

  // Update scenarios when language changes
  useEffect(() => {
    setGameScenarios(getScenarios(t));
  }, [t]);

  const handleSolutionSelect = (scenarioId: string, solution: string) => {
    const scenario = gameScenarios.find(s => s.id === scenarioId);
    if (!scenario || scenario.solved) return;

    const isCorrect = solution === scenario.correctSolution;
    const newScore = isCorrect ? score + 20 : score;
    
    if (isCorrect) {
      setGameScenarios(prev => 
        prev.map(s => s.id === scenarioId ? { ...s, solved: true } : s)
      );
      toast.success(t('game.water.great.solution'));
    } else {
      toast.error(t('game.water.not.best.choice'));
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
  }, [gameScenarios, score, onScoreUpdate]);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">💧 {t('game.water.title')}</h3>
        <p className="text-muted-foreground">
          {t('game.water.instructions')}
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
          {t('game.water.reset.game')}
        </Button>
      </div>
    </div>
  );
}

export function WaterTreatmentGame({ onComplete }: { onComplete: () => void }) {
  const { t } = useLanguage();
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
        title={t('game.water.title')}
        description={t('game.water.description')}
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
