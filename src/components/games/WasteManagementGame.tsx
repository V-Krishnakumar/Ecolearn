import { useState, useEffect } from "react";
import { GameWrapper } from "./GameWrapper";
import { DragDropProvider, useDragDrop } from "./DragDropContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface WasteItem {
  id: string;
  name: string;
  icon: string;
  category: "recycle" | "compost" | "trash";
  placed: boolean;
}

const wasteItems: WasteItem[] = [
  { id: "1", name: "Plastic Bottle", icon: "🍼", category: "recycle", placed: false },
  { id: "2", name: "Banana Peel", icon: "🍌", category: "compost", placed: false },
  { id: "3", name: "Newspaper", icon: "📰", category: "recycle", placed: false },
  { id: "4", name: "Chip Bag", icon: "🍟", category: "trash", placed: false },
  { id: "5", name: "Apple Core", icon: "🍎", category: "compost", placed: false },
  { id: "6", name: "Glass Jar", icon: "🫙", category: "recycle", placed: false },
  { id: "7", name: "Used Tissue", icon: "🧻", category: "trash", placed: false },
  { id: "8", name: "Coffee Grounds", icon: "☕", category: "compost", placed: false },
  { id: "9", name: "Aluminum Can", icon: "🥤", category: "recycle", placed: false },
  { id: "10", name: "Candy Wrapper", icon: "🍬", category: "trash", placed: false }
];

const bins = [
  { id: "recycle", name: "Recycling", icon: "♻️", color: "bg-secondary/20 border-secondary", category: "recycle" },
  { id: "compost", name: "Compost", icon: "🌱", color: "bg-success/20 border-success", category: "compost" },
  { id: "trash", name: "Trash", icon: "🗑️", color: "bg-muted border-border", category: "trash" }
];

function DraggableItem({ item, onDragStart }: { item: WasteItem; onDragStart: (item: WasteItem) => void }) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(item)}
      className={`
        p-4 rounded-lg border-2 border-dashed border-border bg-card
        cursor-grab active:cursor-grabbing
        hover:shadow-glow transition-all duration-200
        flex flex-col items-center space-y-2
        ${item.placed ? 'opacity-50 pointer-events-none' : 'hover:scale-105'}
      `}
    >
      <div className="text-3xl">{item.icon}</div>
      <div className="text-sm font-medium text-center">{item.name}</div>
    </div>
  );
}

function DropZone({ 
  bin, 
  droppedItems, 
  onDrop 
}: { 
  bin: typeof bins[0]; 
  droppedItems: WasteItem[]; 
  onDrop: (binId: string) => void 
}) {
  const { draggedOver, setDraggedOver } = useDragDrop();
  
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDraggedOver(bin.id);
      }}
      onDragLeave={() => setDraggedOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(bin.id);
        setDraggedOver(null);
      }}
      className={`
        min-h-[200px] p-6 rounded-lg border-2 border-dashed transition-all duration-200
        ${bin.color}
        ${draggedOver === bin.id ? 'scale-105 shadow-glow' : ''}
      `}
    >
      <div className="text-center mb-4">
        <div className="text-4xl mb-2">{bin.icon}</div>
        <h3 className="font-bold text-lg">{bin.name}</h3>
        <Badge variant="outline" className="mt-1">
          {droppedItems.length}/10 items
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {droppedItems.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center space-x-2 p-2 bg-card rounded border text-xs"
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function WasteGameContent({ onScoreUpdate }: { onScoreUpdate: (score: number, progress: number) => void }) {
  const [items, setItems] = useState<WasteItem[]>(wasteItems);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { draggedItem, setDraggedItem } = useDragDrop();

  const getBinItems = (category: string) => 
    items.filter(item => item.placed && item.category === category);

  const handleDragStart = (item: WasteItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (binId: string) => {
    if (!draggedItem) return;
    
    const isCorrect = draggedItem.category === binId;
    const newScore = isCorrect ? score + 10 : Math.max(0, score - 5);
    
    setItems(items.map(item => 
      item.id === draggedItem.id ? { ...item, placed: true } : item
    ));
    
    setScore(newScore);
    
    if (isCorrect) {
      setFeedback(`✅ Correct! ${draggedItem.name} goes in ${binId}!`);
      toast.success(`Great job! +10 points`);
    } else {
      setFeedback(`❌ Oops! ${draggedItem.name} should go in ${draggedItem.category}`);
      toast.error(`Not quite right. Try again!`);
    }
    
    setDraggedItem(null);
    
    const remainingItems = items.filter(item => !item.placed && item.id !== draggedItem.id);
    const progress = ((wasteItems.length - remainingItems.length) / wasteItems.length) * 100;
    
    onScoreUpdate(newScore, progress);
    
    setTimeout(() => setFeedback(""), 3000);
  };

  const restart = () => {
    setItems(wasteItems.map(item => ({ ...item, placed: false })));
    setScore(0);
    setFeedback("");
    onScoreUpdate(0, 0);
  };

  useEffect(() => {
    onScoreUpdate(score, ((wasteItems.length - items.filter(item => !item.placed).length) / wasteItems.length) * 100);
  }, []);

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="text-center p-4 bg-muted rounded-lg">
        <h3 className="font-bold text-lg mb-2">🎯 Sort It Right!</h3>
        <p className="text-muted-foreground">
          Drag each waste item to the correct bin. Get +10 points for correct sorting, -5 for mistakes!
        </p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="text-center p-3 bg-accent/20 rounded-lg animate-bounce-gentle">
          <div className="font-medium">{feedback}</div>
        </div>
      )}

      {/* Waste Items */}
      <div>
        <h4 className="font-semibold mb-3">Items to Sort:</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {items.filter(item => !item.placed).map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      {/* Bins */}
      <div>
        <h4 className="font-semibold mb-3">Sorting Bins:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bins.map((bin) => (
            <DropZone
              key={bin.id}
              bin={bin}
              droppedItems={getBinItems(bin.category)}
              onDrop={handleDrop}
            />
          ))}
        </div>
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

export function WasteManagementGame({ onComplete }: { onComplete: () => void }) {
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
        title="Sort It Right!"
        description="Learn waste management by sorting items into the correct bins"
        score={score}
        maxScore={100}
        progress={progress}
        onRestart={handleRestart}
        onComplete={onComplete}
        isCompleted={progress >= 100}
        gameIcon="♻️"
      >
        <WasteGameContent key={key} onScoreUpdate={handleScoreUpdate} />
      </GameWrapper>
    </DragDropProvider>
  );
}