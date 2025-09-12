import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { DragDropProvider, useDragDrop } from "./DragDropContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface EnergySource {
  id: string;
  name: string;
  icon: string;
  output: number; // MW
  cost: number;
  efficiency: number; // %
  placed: boolean;
  position?: { x: number; y: number };
}

interface CityBuilding {
  id: string;
  name: string;
  icon: string;
  energyNeeded: number; // MW
  powered: boolean;
}

const energySources: EnergySource[] = [
  { id: "1", name: "Solar Panel", icon: "☀️", output: 20, cost: 100, efficiency: 85, placed: false },
  { id: "2", name: "Wind Turbine", icon: "💨", output: 35, cost: 150, efficiency: 90, placed: false },
  { id: "3", name: "Hydro Dam", icon: "🌊", output: 50, cost: 200, efficiency: 95, placed: false },
  { id: "4", name: "Solar Panel", icon: "☀️", output: 20, cost: 100, efficiency: 85, placed: false },
  { id: "5", name: "Wind Turbine", icon: "💨", output: 35, cost: 150, efficiency: 90, placed: false },
  { id: "6", name: "Geothermal", icon: "🌋", output: 40, cost: 180, efficiency: 93, placed: false }
];

const cityBuildings: CityBuilding[] = [
  { id: "1", name: "Homes", icon: "🏘️", energyNeeded: 30, powered: false },
  { id: "2", name: "School", icon: "🏫", energyNeeded: 25, powered: false },
  { id: "3", name: "Hospital", icon: "🏥", energyNeeded: 40, powered: false },
  { id: "4", name: "Office", icon: "🏢", energyNeeded: 35, powered: false },
  { id: "5", name: "Factory", icon: "🏭", energyNeeded: 50, powered: false },
  { id: "6", name: "Mall", icon: "🏬", energyNeeded: 20, powered: false }
];

const gridSlots = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  occupied: false,
  type: i < 2 ? 'mountain' : i < 4 ? 'field' : 'water' // terrain types
}));

function EnergySourceCard({ 
  source, 
  onDragStart 
}: { 
  source: EnergySource; 
  onDragStart: (source: EnergySource) => void 
}) {
  return (
    <Card 
      className={`
        transition-all duration-200 cursor-grab active:cursor-grabbing h-32
        ${source.placed ? 'opacity-50' : 'hover:scale-105 hover:shadow-glow'}
      `}
      draggable={!source.placed}
      onDragStart={() => onDragStart(source)}
    >
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div className="text-center">
          <div className="text-3xl mb-1">{source.icon}</div>
          <div className="text-sm font-medium">{source.name}</div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Output:</span>
            <span className="font-bold text-success">{source.output}MW</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Cost:</span>
            <span className="font-bold text-secondary">${source.cost}K</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Efficiency:</span>
            <span className="font-bold text-accent">{source.efficiency}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GridSlot({ 
  slot, 
  placedSource,
  onDrop 
}: { 
  slot: typeof gridSlots[0]; 
  placedSource?: EnergySource;
  onDrop: (slotId: number) => void;
}) {
  const { draggedOver, setDraggedOver } = useDragDrop();
  
  const getTerrainColor = () => {
    switch (slot.type) {
      case 'mountain': return 'bg-stone-200 border-stone-400';
      case 'field': return 'bg-green-200 border-green-400';
      case 'water': return 'bg-blue-200 border-blue-400';
      default: return 'bg-gray-200 border-gray-400';
    }
  };

  const getTerrainIcon = () => {
    switch (slot.type) {
      case 'mountain': return '⛰️';
      case 'field': return '🌾';
      case 'water': return '🌊';
      default: return '🏞️';
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!slot.occupied) setDraggedOver(slot.id.toString());
      }}
      onDragLeave={() => setDraggedOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        if (!slot.occupied) {
          onDrop(slot.id);
          setDraggedOver(null);
        }
      }}
      className={`
        relative min-h-[120px] p-4 rounded-lg border-2 border-dashed transition-all duration-200
        ${getTerrainColor()}
        ${draggedOver === slot.id.toString() && !slot.occupied ? 'scale-105 shadow-glow' : ''}
      `}
    >
      {!placedSource ? (
        <div className="flex flex-col items-center justify-center h-full opacity-60">
          <div className="text-2xl mb-1">{getTerrainIcon()}</div>
          <div className="text-xs text-center">
            {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="text-4xl mb-2 animate-bounce-gentle">{placedSource.icon}</div>
          <Badge className="bg-success text-success-foreground text-xs">
            {placedSource.output}MW
          </Badge>
        </div>
      )}
    </div>
  );
}

function BuildingCard({ building }: { building: CityBuilding }) {
  return (
    <Card className={`transition-all duration-300 ${building.powered ? 'bg-success/20 border-success' : 'bg-destructive/20 border-destructive'}`}>
      <CardContent className="p-4 text-center">
        <div className="text-3xl mb-2">{building.icon}</div>
        <div className="text-sm font-medium mb-1">{building.name}</div>
        <Badge variant={building.powered ? "default" : "destructive"} className="text-xs">
          {building.powered ? "⚡ Powered" : `❌ Needs ${building.energyNeeded}MW`}
        </Badge>
      </CardContent>
    </Card>
  );
}

function RenewableGameContent({ onScoreUpdate }: { onScoreUpdate: (score: number, progress: number) => void }) {
  const [gameSources, setGameSources] = useState<EnergySource[]>(energySources);
  const [gameBuildings, setGameBuildings] = useState<CityBuilding[]>(cityBuildings);
  const [gameSlots, setGameSlots] = useState(gridSlots);
  const [score, setScore] = useState(0);
  const [budget, setBudget] = useState(1000); // $1000K budget
  const { draggedItem, setDraggedItem } = useDragDrop();

  const handleDragStart = (source: EnergySource) => {
    setDraggedItem(source);
  };

  const handleDrop = (slotId: number) => {
    if (!draggedItem || budget < draggedItem.cost) {
      if (budget < draggedItem.cost) {
        toast.error("Not enough budget!");
      }
      return;
    }
    
    const slot = gameSlots.find(s => s.id === slotId);
    if (!slot || slot.occupied) return;

    // Place the energy source
    setGameSources(prev => 
      prev.map(s => s.id === draggedItem.id ? { ...s, placed: true, position: { x: slotId, y: 0 } } : s)
    );
    
    setGameSlots(prev => 
      prev.map(s => s.id === slotId ? { ...s, occupied: true } : s)
    );

    setBudget(prev => prev - draggedItem.cost);
    const newScore = score + 20;
    setScore(newScore);

    toast.success(`${draggedItem.name} installed! +20 points`);
    setDraggedItem(null);

    // Calculate total energy and update building power status
    const totalEnergy = calculateTotalEnergy();
    const newTotalEnergy = totalEnergy + draggedItem.output;
    updateBuildingPower(newTotalEnergy);

    const progress = (newTotalEnergy / getTotalEnergyNeeded()) * 100;
    onScoreUpdate(newScore, Math.min(100, progress));
  };

  const calculateTotalEnergy = () => {
    return gameSources
      .filter(source => source.placed)
      .reduce((total, source) => total + source.output, 0);
  };

  const getTotalEnergyNeeded = () => {
    return cityBuildings.reduce((total, building) => total + building.energyNeeded, 0);
  };

  const updateBuildingPower = (totalEnergy: number) => {
    let remainingEnergy = totalEnergy;
    
    setGameBuildings(prev => 
      prev.map(building => {
        if (remainingEnergy >= building.energyNeeded) {
          remainingEnergy -= building.energyNeeded;
          return { ...building, powered: true };
        }
        return { ...building, powered: false };
      })
    );
  };

  const restart = () => {
    setGameSources(energySources.map(s => ({ ...s, placed: false, position: undefined })));
    setGameBuildings(cityBuildings.map(b => ({ ...b, powered: false })));
    setGameSlots(gridSlots.map(s => ({ ...s, occupied: false })));
    setScore(0);
    setBudget(1000);
    onScoreUpdate(0, 0);
  };

  const totalEnergy = calculateTotalEnergy();
  const totalNeeded = getTotalEnergyNeeded();
  const poweredBuildings = gameBuildings.filter(b => b.powered).length;
  const allPowered = poweredBuildings === gameBuildings.length;

  useEffect(() => {
    updateBuildingPower(totalEnergy);
    const progress = (totalEnergy / totalNeeded) * 100;
    onScoreUpdate(score, Math.min(100, progress));
  }, []);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">⚡ Power Up!</h3>
        <p className="text-muted-foreground">
          Build renewable energy sources to power the entire city with clean energy!
        </p>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{totalEnergy}</div>
            <div className="text-xs text-muted-foreground">MW Generated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{totalNeeded}</div>
            <div className="text-xs text-muted-foreground">MW Needed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">${budget}K</div>
            <div className="text-xs text-muted-foreground">Budget Left</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{poweredBuildings}/{gameBuildings.length}</div>
            <div className="text-xs text-muted-foreground">Buildings Powered</div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">City Power Level</span>
            <Badge variant={allPowered ? "default" : "secondary"} className={allPowered ? "bg-success" : ""}>
              {Math.round((totalEnergy / totalNeeded) * 100)}%
            </Badge>
          </div>
          <Progress value={(totalEnergy / totalNeeded) * 100} className="h-3" />
        </CardContent>
      </Card>

      {/* Game Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Energy Sources */}
        <div>
          <h4 className="font-semibold mb-4">⚡ Renewable Sources:</h4>
          <div className="grid grid-cols-1 gap-3">
            {gameSources.filter(source => !source.placed).map((source) => (
              <EnergySourceCard
                key={source.id}
                source={source}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Construction Grid */}
        <div>
          <h4 className="font-semibold mb-4">🏗️ Build Here:</h4>
          <div className="grid grid-cols-2 gap-3">
            {gameSlots.map((slot) => {
              const placedSource = gameSources.find(s => s.position?.x === slot.id);
              return (
                <GridSlot
                  key={slot.id}
                  slot={slot}
                  placedSource={placedSource}
                  onDrop={handleDrop}
                />
              );
            })}
          </div>
        </div>

        {/* City Buildings */}
        <div>
          <h4 className="font-semibold mb-4">🏙️ City Buildings:</h4>
          <div className="grid grid-cols-1 gap-3">
            {gameBuildings.map((building) => (
              <BuildingCard key={building.id} building={building} />
            ))}
          </div>
        </div>
      </div>

      {allPowered && (
        <div className="text-center p-6 bg-success/20 rounded-lg animate-bounce-gentle">
          <div className="text-4xl mb-2">🎉</div>
          <div className="text-xl font-bold text-success mb-2">City Fully Powered!</div>
          <div className="text-muted-foreground">
            100% renewable energy achieved! The city is now carbon neutral!
          </div>
        </div>
      )}

      {/* Restart Button */}
      <div className="text-center">
        <Button onClick={restart} variant="outline">
          Rebuild City
        </Button>
      </div>
    </div>
  );
}

export function RenewableEnergyGame({ onComplete }: { onComplete: () => void }) {
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
        title="Power Up!"
        description="Build renewable energy sources to power an eco-friendly city"
        score={score}
        maxScore={200}
        progress={progress}
        onRestart={handleRestart}
        onComplete={onComplete}
        isCompleted={progress >= 100}
        gameIcon="⚡"
      >
        <RenewableGameContent key={key} onScoreUpdate={handleScoreUpdate} />
      </GameWrapper>
    </DragDropProvider>
  );
}