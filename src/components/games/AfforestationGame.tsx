import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { DragDropProvider, useDragDrop } from "./DragDropContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

interface Tree {
  id: string;
  type: string;
  icon: string;
  growth: number; // 0-100
  planted: boolean;
  position: { x: number; y: number };
  soilType: 'good' | 'poor' | 'wet';
  watered: boolean;
}

interface Seed {
  id: string;
  type: string;
  icon: string;
  name: string;
  preferredSoil: 'good' | 'poor' | 'wet';
  used: boolean;
}

const getSeeds = (t: (key: string) => string): Seed[] => [
  { id: "1", type: "oak", icon: "🌰", name: t('game.afforestation.oak'), preferredSoil: "good", used: false },
  { id: "2", type: "pine", icon: "🌲", name: t('game.afforestation.pine'), preferredSoil: "poor", used: false },
  { id: "3", type: "willow", icon: "🌿", name: t('game.afforestation.willow'), preferredSoil: "wet", used: false },
  { id: "4", type: "maple", icon: "🍁", name: t('game.afforestation.maple'), preferredSoil: "good", used: false },
  { id: "5", type: "birch", icon: "🌳", name: t('game.afforestation.birch'), preferredSoil: "poor", used: false },
  { id: "6", type: "cypress", icon: "🌲", name: t('game.afforestation.cypress'), preferredSoil: "wet", used: false }
];

const getSoilPlots = (t: (key: string) => string) => [
  { id: "1", type: "good", color: "bg-amber-100 border-amber-300", label: t('game.afforestation.rich.soil'), icon: "🟤" },
  { id: "2", type: "poor", color: "bg-stone-100 border-stone-300", label: t('game.afforestation.rocky.soil'), icon: "⚪" },
  { id: "3", type: "wet", color: "bg-blue-100 border-blue-300", label: t('game.afforestation.wetland'), icon: "🔵" },
  { id: "4", type: "good", color: "bg-amber-100 border-amber-300", label: t('game.afforestation.rich.soil'), icon: "🟤" },
  { id: "5", type: "poor", color: "bg-stone-100 border-stone-300", label: t('game.afforestation.rocky.soil'), icon: "⚪" },
  { id: "6", type: "wet", color: "bg-blue-100 border-blue-300", label: t('game.afforestation.wetland'), icon: "🔵" }
];

function SeedItem({ seed, onDragStart }: { seed: Seed; onDragStart: (seed: Seed) => void }) {
  const { t } = useLanguage();
  return (
    <div
      draggable={!seed.used}
      onDragStart={() => onDragStart(seed)}
      className={`
        p-3 rounded-lg border-2 border-dashed border-border bg-card
        cursor-grab active:cursor-grabbing
        hover:shadow-glow transition-all duration-200
        flex flex-col items-center space-y-1
        ${seed.used ? 'opacity-30 pointer-events-none' : 'hover:scale-105'}
      `}
    >
      <div className="text-2xl">{seed.icon}</div>
      <div className="text-xs font-medium text-center">{seed.name}</div>
      <Badge variant="outline" className="text-xs">
        {seed.preferredSoil} {t('game.afforestation.soil')}
      </Badge>
    </div>
  );
}

function SoilPlot({ 
  plot, 
  tree, 
  onDrop,
  onWater 
}: { 
  plot: typeof getSoilPlots[0]; 
  tree?: Tree;
  onDrop: (plotId: string) => void;
  onWater: (plotId: string) => void;
}) {
  const { t } = useLanguage();
  const { draggedOver, setDraggedOver } = useDragDrop();
  
  const getGrowthStage = (growth: number) => {
    if (growth < 25) return "🌱"; // seedling
    if (growth < 50) return "🌿"; // young plant
    if (growth < 75) return "🌳"; // young tree
    return "🌳"; // mature tree
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!tree) setDraggedOver(plot.id);
      }}
      onDragLeave={() => setDraggedOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        if (!tree) {
          onDrop(plot.id);
          setDraggedOver(null);
        }
      }}
      className={`
        relative min-h-[140px] p-4 rounded-lg border-2 border-dashed transition-all duration-200
        ${plot.color}
        ${draggedOver === plot.id && !tree ? 'scale-105 shadow-glow' : ''}
        ${tree ? 'border-solid' : ''}
        flex flex-col items-center justify-center
      `}
    >
      {!tree ? (
        <>
          {/* Empty plot content */}
          <div className="text-center space-y-2">
            <div className="text-lg">{plot.icon}</div>
            <div className="text-xs font-medium">{plot.label}</div>
            <div className="text-xs text-muted-foreground opacity-50">
              {t('game.afforestation.drop.seed.here')}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Tree content */}
          <div className="text-center space-y-2">
            <div className="text-4xl animate-bounce-gentle">
              {getGrowthStage(tree.growth)}
            </div>
            <div className="text-xs font-medium">
              {t('game.afforestation.growth')} {tree.growth}%
            </div>
            {tree.growth < 100 && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => onWater(plot.id)}
                disabled={tree.watered}
              >
                {tree.watered ? `💧 ${t('game.afforestation.watered')}` : `💧 ${t('game.afforestation.water')}`}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function AfforestationGameContent({ onScoreUpdate }: { onScoreUpdate: (score: number, progress: number) => void }) {
  const { t } = useLanguage();
  const seeds = getSeeds(t);
  const soilPlots = getSoilPlots(t);
  const [gameSeeds, setGameSeeds] = useState<Seed[]>(seeds);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [score, setScore] = useState(0);
  const { draggedItem, setDraggedItem } = useDragDrop();

  // Update seeds when language changes
  useEffect(() => {
    setGameSeeds(getSeeds(t));
  }, [t]);

  const handleDragStart = (seed: Seed) => {
    setDraggedItem(seed);
  };

  const handleDrop = (plotId: string) => {
    if (!draggedItem) return;
    
    const plot = soilPlots.find(p => p.id === plotId);
    if (!plot) return;

    // Check if plot already has a tree
    if (trees.find(t => t.position.x.toString() === plotId)) return;
    
    const isOptimalSoil = draggedItem.preferredSoil === plot.type;
    const baseGrowth = isOptimalSoil ? 25 : 10;
    const points = isOptimalSoil ? 15 : 5;
    
    const newTree: Tree = {
      id: `tree-${Date.now()}`,
      type: draggedItem.type,
      icon: draggedItem.icon,
      growth: baseGrowth,
      planted: true,
      position: { x: parseInt(plotId), y: 0 },
      soilType: plot.type as 'good' | 'poor' | 'wet',
      watered: false
    };
    
    setTrees(prev => [...prev, newTree]);
    setGameSeeds(prev => 
      prev.map(s => s.id === draggedItem.id ? { ...s, used: true } : s)
    );
    
    const newScore = score + points;
    setScore(newScore);
    
    if (isOptimalSoil) {
      toast.success(t('game.afforestation.perfect.match'));
    } else {
      toast.success(t('game.afforestation.tree.planted'));
    }
    
    setDraggedItem(null);
    
    const progress = (trees.length + 1) / soilPlots.length * 100;
    onScoreUpdate(newScore, progress);
  };

  const handleWater = (plotId: string) => {
    const treeIndex = trees.findIndex(t => t.position.x.toString() === plotId);
    if (treeIndex === -1) return;
    
    const tree = trees[treeIndex];
    if (tree.watered || tree.growth >= 100) return;
    
    const newTrees = [...trees];
    newTrees[treeIndex] = {
      ...tree,
      growth: Math.min(100, tree.growth + 25),
      watered: true
    };
    
    setTrees(newTrees);
    setScore(prev => prev + 10);
    toast.success(t('game.afforestation.tree.watered'));
    
    // Reset watered status after a delay
    setTimeout(() => {
      setTrees(prev => 
        prev.map(t => t.id === tree.id ? { ...t, watered: false } : t)
      );
    }, 3000);
  };

  const restart = () => {
    setGameSeeds(seeds.map(s => ({ ...s, used: false })));
    setTrees([]);
    setScore(0);
    onScoreUpdate(0, 0);
  };

  const allTreesMature = trees.length === soilPlots.length && trees.every(t => t.growth >= 100);
  const carbonAbsorbed = trees.reduce((sum, tree) => sum + (tree.growth / 100) * 48, 0); // ~48kg CO2 per mature tree per year

  useEffect(() => {
    const progress = allTreesMature ? 100 : (trees.length / soilPlots.length) * 100;
    onScoreUpdate(score, progress);
  }, [trees, score]);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">🌳 {t('game.afforestation.title')}</h3>
        <p className="text-muted-foreground">
          {t('game.afforestation.instructions')}
        </p>
      </div>

      {/* Forest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{trees.length}</div>
            <div className="text-sm text-muted-foreground">{t('game.afforestation.trees.planted')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{Math.round(carbonAbsorbed)}</div>
            <div className="text-sm text-muted-foreground">{t('game.afforestation.co2.absorbed')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{trees.filter(t => t.growth >= 100).length}</div>
            <div className="text-sm text-muted-foreground">{t('game.afforestation.mature.trees')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Seeds to Plant */}
      <div>
        <h4 className="font-semibold mb-4">🌰 {t('game.afforestation.seeds.to.plant')}</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {gameSeeds.filter(seed => !seed.used).map((seed) => (
            <SeedItem
              key={seed.id}
              seed={seed}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
        {gameSeeds.every(seed => seed.used) && (
          <div className="text-center text-success font-medium mt-4 p-3 bg-success/10 rounded-lg">
            🎉 {t('game.afforestation.all.seeds.planted')}
          </div>
        )}
      </div>

      {/* Forest Grid */}
      <div>
        <h4 className="font-semibold mb-4">🌍 {t('game.afforestation.your.forest')}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {soilPlots.map((plot) => {
            const tree = trees.find(t => t.position.x.toString() === plot.id);
            return (
              <SoilPlot
                key={plot.id}
                plot={plot}
                tree={tree}
                onDrop={handleDrop}
                onWater={handleWater}
              />
            );
          })}
        </div>
      </div>

      {allTreesMature && (
        <div className="text-center p-6 bg-success/20 rounded-lg animate-bounce-gentle">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-xl font-bold text-success mb-2">{t('game.afforestation.forest.complete')}</div>
          <div className="text-muted-foreground">
            {t('game.afforestation.forest.complete.desc')}
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="text-center">
        <Button onClick={restart} variant="outline">
          {t('game.afforestation.plant.new.forest')}
        </Button>
      </div>
    </div>
  );
}

export function AfforestationGame({ onComplete }: { onComplete: () => void }) {
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
        title={t('game.afforestation.title')}
        description={t('game.afforestation.description')}
        score={score}
        maxScore={200}
        progress={progress}
        onRestart={handleRestart}
        onComplete={onComplete}
        isCompleted={progress >= 100}
        gameIcon="🌳"
      >
        <AfforestationGameContent key={key} onScoreUpdate={handleScoreUpdate} />
      </GameWrapper>
    </DragDropProvider>
  );
}
