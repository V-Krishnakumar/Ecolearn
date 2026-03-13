import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface StoryPanel {
  id: string;
  title: string;
  description: string;
  image: string;
  correctPosition: number;
  currentPosition: number;
  category: 'problem' | 'solution';
}

const getStoryPanels = (t: (key: string) => string): StoryPanel[] => [
  {
    id: "1",
    title: t('game.deforestation.healthy.forest'),
    description: t('game.deforestation.healthy.forest.desc'),
    image: "🌳🦅🐿️",
    correctPosition: 1,
    currentPosition: 0,
    category: 'problem'
  },
  {
    id: "2", 
    title: t('game.deforestation.logging.begins'),
    description: t('game.deforestation.logging.begins.desc'),
    image: "🪓🌳💔",
    correctPosition: 2,
    currentPosition: 0,
    category: 'problem'
  },
  {
    id: "3",
    title: t('game.deforestation.forest.destruction'),
    description: t('game.deforestation.forest.destruction.desc'),
    image: "🏗️💨🐾",
    correctPosition: 3,
    currentPosition: 0,
    category: 'problem'
  },
  {
    id: "4",
    title: t('game.deforestation.community.action'),
    description: t('game.deforestation.community.action.desc'),
    image: "👥🛡️🌳",
    correctPosition: 4,
    currentPosition: 0,
    category: 'solution'
  },
  {
    id: "5",
    title: t('game.deforestation.sustainable.practices'),
    description: t('game.deforestation.sustainable.practices.desc'),
    image: "♻️🌱📋",
    correctPosition: 5,
    currentPosition: 0,
    category: 'solution'
  },
  {
    id: "6",
    title: t('game.deforestation.forest.recovery'),
    description: t('game.deforestation.forest.recovery.desc'),
    image: "🌳🌿🦋",
    correctPosition: 6,
    currentPosition: 0,
    category: 'solution'
  }
];

function StoryPanelCard({ 
  panel, 
  isCorrectPosition,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown
}: { 
  panel: StoryPanel;
  isCorrectPosition: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const { t } = useLanguage();
  return (
    <Card className={`
      transition-all duration-300 
      ${isCorrectPosition ? 'bg-success/20 border-success' : 'bg-card border-border'}
      ${panel.category === 'problem' ? 'border-l-4 border-l-destructive' : 'border-l-4 border-l-success'}
    `}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={panel.category === 'problem' ? 'destructive' : 'default'} className="text-xs">
                {panel.category === 'problem' ? t('game.deforestation.problem') : t('game.deforestation.solution')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {t('game.deforestation.position')} {panel.currentPosition || '?'}
              </Badge>
            </div>
            <h4 className="font-bold text-sm mb-2">{panel.title}</h4>
            <p className="text-xs text-muted-foreground mb-3">{panel.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-4xl">{panel.image}</div>
          <div className="flex flex-col space-y-1">
            <Button
              size="sm"
              variant="outline"
              onClick={onMoveUp}
              disabled={!canMoveUp}
              className="h-8 w-8 p-0"
            >
              <ArrowUp className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onMoveDown}
              disabled={!canMoveDown}
              className="h-8 w-8 p-0"
            >
              <ArrowDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
        
        {isCorrectPosition && (
          <div className="mt-3 text-center">
            <Badge className="bg-success text-success-foreground">
              ✅ {t('game.deforestation.correct.position')}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DeforestationGameContent({ onScoreUpdate }: { onScoreUpdate: (score: number, progress: number) => void }) {
  const { t } = useLanguage();
  const storyPanels = getStoryPanels(t);
  const [gamePanels, setGamePanels] = useState<StoryPanel[]>(() => {
    // Shuffle panels initially
    const shuffled = [...storyPanels].sort(() => Math.random() - 0.5);
    return shuffled.map((panel, index) => ({
      ...panel,
      currentPosition: index + 1
    }));
  });
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);

  // Update panels when language changes
  useEffect(() => {
    const shuffled = [...getStoryPanels(t)].sort(() => Math.random() - 0.5);
    setGamePanels(shuffled.map((panel, index) => ({
      ...panel,
      currentPosition: index + 1
    })));
  }, [t]);

  const movePanel = (panelId: string, direction: 'up' | 'down') => {
    setGamePanels(prev => {
      const newPanels = [...prev];
      const panelIndex = newPanels.findIndex(p => p.id === panelId);
      
      if (panelIndex === -1) return prev;
      
      let targetIndex;
      if (direction === 'up' && panelIndex > 0) {
        targetIndex = panelIndex - 1;
      } else if (direction === 'down' && panelIndex < newPanels.length - 1) {
        targetIndex = panelIndex + 1;
      } else {
        return prev;
      }
      
      // Swap panels
      [newPanels[panelIndex], newPanels[targetIndex]] = [newPanels[targetIndex], newPanels[panelIndex]];
      
      // Update positions
      return newPanels.map((panel, index) => ({
        ...panel,
        currentPosition: index + 1
      }));
    });
    
    setMoves(prev => prev + 1);
  };

  const restart = () => {
    const shuffled = [...storyPanels].sort(() => Math.random() - 0.5);
    setGamePanels(shuffled.map((panel, index) => ({
      ...panel,
      currentPosition: index + 1
    })));
    setScore(0);
    setMoves(0);
    onScoreUpdate(0, 0);
  };

  const checkWinCondition = () => {
    return gamePanels.every(panel => panel.currentPosition === panel.correctPosition);
  };

  const getCorrectCount = () => {
    return gamePanels.filter(panel => panel.currentPosition === panel.correctPosition).length;
  };

  const correctCount = getCorrectCount();
  const isComplete = checkWinCondition();
  const progress = (correctCount / storyPanels.length) * 100;

  useEffect(() => {
    const newScore = correctCount * 15 - Math.floor(moves / 2); // Penalty for too many moves
    const finalScore = Math.max(0, newScore);
    setScore(finalScore);
    onScoreUpdate(finalScore, progress);

    if (isComplete && moves > 0) {
      toast.success("Story completed! Forest conservation plan in order!");
    }
  }, [correctCount, moves, isComplete, progress]);

  useEffect(() => {
    onScoreUpdate(0, 0);
  }, []);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">🌲 {t('game.deforestation.title')}</h3>
        <p className="text-muted-foreground">
          {t('game.deforestation.instructions')}
        </p>
      </div>

      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{correctCount}</div>
            <div className="text-xs text-muted-foreground">{t('game.deforestation.correct.positions')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{moves}</div>
            <div className="text-xs text-muted-foreground">{t('game.deforestation.moves.made')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{Math.round(progress)}%</div>
            <div className="text-xs text-muted-foreground">{t('game.deforestation.progress')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Story Sequence Guide */}
      <Card className="bg-accent/10">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3 text-center">📖 {t('game.deforestation.correct.story.sequence')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-destructive/20 rounded">
              <div className="font-bold text-destructive">{t('game.deforestation.problems')}</div>
              <div>{t('game.deforestation.healthy.to.logging')} → {t('game.deforestation.logging.to.destruction')}</div>
            </div>
            <div className="text-center p-2 bg-accent/20 rounded">
              <div className="font-bold text-accent">{t('game.deforestation.action')}</div>
              <div>{t('game.deforestation.community.organizes')}</div>
            </div>
            <div className="text-center p-2 bg-success/20 rounded">
              <div className="font-bold text-success">{t('game.deforestation.solutions')}</div>
              <div>{t('game.deforestation.sustainable.to.recovery')}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Panels */}
      <div className="space-y-4">
        <h4 className="font-semibold text-center">📚 {t('game.deforestation.story.panels')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamePanels.map((panel, index) => (
            <StoryPanelCard
              key={panel.id}
              panel={panel}
              isCorrectPosition={panel.currentPosition === panel.correctPosition}
              onMoveUp={() => movePanel(panel.id, 'up')}
              onMoveDown={() => movePanel(panel.id, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < gamePanels.length - 1}
            />
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="text-center p-6 bg-success/20 rounded-lg animate-bounce-gentle">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-xl font-bold text-success mb-2">{t('game.deforestation.story.complete')}</div>
          <div className="text-muted-foreground">
            {t('game.deforestation.story.complete.desc')}
            {t('game.deforestation.completed.in.moves')} {moves} moves.
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="text-center">
        <Button onClick={restart} variant="outline">
          {t('game.deforestation.shuffle.story')}
        </Button>
      </div>
    </div>
  );
}

export function DeforestationGame({ onComplete }: { onComplete: () => void }) {
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
    <GameWrapper
      title={t('game.deforestation.title')}
      description={t('game.deforestation.description')}
      score={score}
      maxScore={90}
      progress={progress}
      onRestart={handleRestart}
      onComplete={onComplete}
      isCompleted={progress >= 100}
      gameIcon="🌲"
    >
      <DeforestationGameContent key={key} onScoreUpdate={handleScoreUpdate} />
    </GameWrapper>
  );
}
