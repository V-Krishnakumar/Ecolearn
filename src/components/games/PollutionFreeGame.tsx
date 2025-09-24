import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { DragDropProvider, useDragDrop } from "./DragDropContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface PollutionSource {
  id: string;
  name: string;
  icon: string;
  type: string;
  matched: boolean;
}

interface Solution {
  id: string;
  name: string;
  icon: string;
  type: string;
  used: boolean;
}

const getPollutionSources = (t: (key: string) => string): PollutionSource[] => [
  { id: "1", name: t('game.pollution.car.emissions'), icon: "🚗💨", type: "transport", matched: false },
  { id: "2", name: t('game.pollution.factory.smoke'), icon: "🏭💨", type: "industrial", matched: false },
  { id: "3", name: t('game.pollution.plastic.waste'), icon: "🥤🗑️", type: "waste", matched: false },
  { id: "4", name: t('game.pollution.coal.plant'), icon: "⚡💨", type: "energy", matched: false },
  { id: "5", name: t('game.pollution.garbage.dump'), icon: "🗑️☠️", type: "waste", matched: false },
  { id: "6", name: t('game.pollution.truck.exhaust'), icon: "🚛💨", type: "transport", matched: false }
];

const getSolutions = (t: (key: string) => string): Solution[] => [
  { id: "1", name: t('game.pollution.electric.vehicle'), icon: "🔋🚗", type: "transport", used: false },
  { id: "2", name: t('game.pollution.green.factory'), icon: "🏭🌱", type: "industrial", used: false },
  { id: "3", name: t('game.pollution.recycling.center'), icon: "♻️🏢", type: "waste", used: false },
  { id: "4", name: t('game.pollution.solar.panels'), icon: "☀️⚡", type: "energy", used: false },
  { id: "5", name: t('game.pollution.composting'), icon: "🌱🗑️", type: "waste", used: false },
  { id: "6", name: t('game.pollution.electric.truck'), icon: "🔋🚛", type: "transport", used: false }
];

function PollutionSourceCard({ 
  source, 
  matchedSolution 
}: { 
  source: PollutionSource; 
  matchedSolution?: Solution 
}) {
  const { t } = useLanguage();
  const { draggedOver, setDraggedOver } = useDragDrop();
  
  return (
    <Card 
      className={`
        transition-all duration-300 h-32
        ${source.matched ? 'bg-success/10 border-success' : 'border-destructive/50'}
        ${draggedOver === source.id && !source.matched ? 'scale-105 shadow-glow' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        if (!source.matched) setDraggedOver(source.id);
      }}
      onDragLeave={() => setDraggedOver(null)}
    >
      <CardContent className="p-4 h-full flex flex-col items-center justify-center">
        <div className="text-3xl mb-2">{source.icon}</div>
        <div className="text-sm font-medium text-center">{source.name}</div>
        {source.matched && matchedSolution && (
          <div className="mt-2">
            <Badge className="bg-success text-success-foreground text-xs">
              ✅ {t('game.pollution.fixed.with')} {matchedSolution.name}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SolutionCard({ 
  solution, 
  onDragStart 
}: { 
  solution: Solution; 
  onDragStart: (solution: Solution) => void 
}) {
  const { t } = useLanguage();
  return (
    <Card 
      className={`
        transition-all duration-200 h-32 cursor-grab active:cursor-grabbing
        ${solution.used ? 'opacity-50' : 'hover:scale-105 hover:shadow-glow'}
      `}
      draggable={!solution.used}
      onDragStart={() => onDragStart(solution)}
    >
      <CardContent className="p-4 h-full flex flex-col items-center justify-center">
        <div className="text-3xl mb-2">{solution.icon}</div>
        <div className="text-sm font-medium text-center">{solution.name}</div>
        {solution.used && (
          <Badge variant="outline" className="mt-2 text-xs">
            {t('game.pollution.used')}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function PollutionGameContent({ onScoreUpdate }: { onScoreUpdate: (score: number, progress: number) => void }) {
  const { t } = useLanguage();
  const pollutionSources = getPollutionSources(t);
  const solutions = getSolutions(t);
  const [gameSources, setGameSources] = useState<PollutionSource[]>(pollutionSources);
  const [gameSolutions, setGameSolutions] = useState<Solution[]>(solutions);
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [score, setScore] = useState(0);
  const [airQuality, setAirQuality] = useState(0); // 0-100, higher is better
  const { draggedItem, setDraggedItem, setDraggedOver } = useDragDrop();

  const handleDragStart = (solution: Solution) => {
    setDraggedItem(solution);
  };

  const handleDrop = (e: React.DragEvent, sourceId: string) => {
    e.preventDefault();
    setDraggedOver(null);
    
    if (!draggedItem) return;
    
    const source = gameSources.find(s => s.id === sourceId);
    if (!source || source.matched) return;
    
    const isCorrectMatch = draggedItem.type === source.type;
    
    if (isCorrectMatch) {
      // Correct match
      setGameSources(prev => 
        prev.map(s => s.id === sourceId ? { ...s, matched: true } : s)
      );
      setGameSolutions(prev => 
        prev.map(s => s.id === draggedItem.id ? { ...s, used: true } : s)
      );
      setMatches(prev => ({ ...prev, [sourceId]: draggedItem.id }));
      
      const newScore = score + 15;
      setScore(newScore);
      setAirQuality(prev => Math.min(100, prev + 16.67)); // Each match improves air quality
      
      toast.success(t('game.pollution.perfect.match'));
    } else {
      // Wrong match
      toast.error(t('game.pollution.wrong.match'));
    }
    
    setDraggedItem(null);
    
    const matchedCount = gameSources.filter(s => s.matched).length + (isCorrectMatch ? 1 : 0);
    const progress = (matchedCount / pollutionSources.length) * 100;
    
    onScoreUpdate(isCorrectMatch ? score + 15 : score, progress);
  };

  const restart = () => {
    setGameSources(pollutionSources.map(s => ({ ...s, matched: false })));
    setGameSolutions(solutions.map(s => ({ ...s, used: false })));
    setMatches({});
    setScore(0);
    setAirQuality(0);
    onScoreUpdate(0, 0);
  };

  const getAirQualityColor = () => {
    if (airQuality >= 80) return "text-success";
    if (airQuality >= 50) return "text-accent";
    if (airQuality >= 20) return "text-secondary";
    return "text-destructive";
  };

  const getAirQualityLabel = () => {
    if (airQuality >= 80) return t('game.pollution.excellent');
    if (airQuality >= 50) return t('game.pollution.good');
    if (airQuality >= 20) return t('game.pollution.moderate');
    return t('game.pollution.poor');
  };

  const allMatched = gameSources.every(s => s.matched);

  useEffect(() => {
    const matchedCount = gameSources.filter(s => s.matched).length;
    const progress = (matchedCount / pollutionSources.length) * 100;
    onScoreUpdate(score, progress);
  }, [gameSources, score, onScoreUpdate]);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">🌬️ {t('game.pollution.title')}</h3>
        <p className="text-muted-foreground">
          {t('game.pollution.instructions')}
        </p>
      </div>

      {/* Air Quality Monitor */}
      <Card className="bg-gradient-to-r from-secondary/10 to-success/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">🌡️ {t('game.pollution.air.quality.monitor')}</h4>
            <Badge className={`${getAirQualityColor().replace('text-', 'bg-')} text-white`}>
              {getAirQualityLabel()}
            </Badge>
          </div>
          <Progress value={airQuality} className="h-4 mb-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('game.pollution.poor')}</span>
            <span className={`font-bold ${getAirQualityColor()}`}>
              {Math.round(airQuality)}% {t('game.pollution.clean')}
            </span>
            <span className="text-muted-foreground">{t('game.pollution.excellent')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pollution Sources */}
        <div>
          <h4 className="font-semibold mb-4 text-destructive">☠️ {t('game.pollution.pollution.sources')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gameSources.map((source) => (
              <div
                key={source.id}
                onDrop={(e) => handleDrop(e, source.id)}
              >
                <PollutionSourceCard
                  source={source}
                  matchedSolution={matches[source.id] ? gameSolutions.find(s => s.id === matches[source.id]) : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold mb-4 text-success">🌱 {t('game.pollution.eco.solutions')}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gameSolutions.map((solution) => (
              <SolutionCard
                key={solution.id}
                solution={solution}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>
      </div>

      {allMatched && (
        <div className="text-center p-6 bg-success/20 rounded-lg animate-bounce-gentle">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-xl font-bold text-success mb-2">{t('game.pollution.city.cleaned')}</div>
          <div className="text-muted-foreground">
            {t('game.pollution.city.cleaned.desc')}
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="text-center">
        <Button onClick={restart} variant="outline">
          {t('game.pollution.reset.city')}
        </Button>
      </div>
    </div>
  );
}

export function PollutionFreeGame({ onComplete }: { onComplete: () => void }) {
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
        title={t('game.pollution.title')}
        description={t('game.pollution.description')}
        score={score}
        maxScore={90}
        progress={progress}
        onRestart={handleRestart}
        onComplete={onComplete}
        isCompleted={progress >= 100}
        gameIcon="🌬️"
      >
        <PollutionGameContent key={key} onScoreUpdate={handleScoreUpdate} />
      </GameWrapper>
    </DragDropProvider>
  );
}
