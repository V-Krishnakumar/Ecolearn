import { createContext, useContext, useState, ReactNode } from "react";

interface DragDropContextType {
  draggedItem: any | null;
  setDraggedItem: (item: any | null) => void;
  draggedOver: string | null;
  setDraggedOver: (id: string | null) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<any | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  return (
    <DragDropContext.Provider value={{
      draggedItem,
      setDraggedItem,
      draggedOver,
      setDraggedOver
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error("useDragDrop must be used within DragDropProvider");
  }
  return context;
}