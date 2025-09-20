import React from 'react';
import { Sun, Moon, Trees, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { 
    timeOfDay, 
    environment, 
    toggleTimeOfDay, 
    toggleEnvironment,
    isDay,
    isRainforest 
  } = useTheme();

  console.log('ThemeToggle rendering:', { timeOfDay, environment, isDay, isRainforest });

  return (
    <div className="flex flex-col gap-2 border border-red-500 p-1">
      {/* Time of Day Toggle */}
      <Button
        onClick={toggleTimeOfDay}
        variant="outline"
        size="sm"
        className={`
          flex items-center space-x-2 transition-all duration-500 ease-in-out
          ${isDay 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300 shadow-lg hover:shadow-xl' 
            : 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white border-indigo-400 shadow-lg hover:shadow-xl'
          }
          hover:scale-105 active:scale-95
        `}
        title={`Switch to ${isDay ? 'Night' : 'Day'} mode`}
      >
        {isDay ? (
          <>
            <Sun className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Day Mode</span>
          </>
        ) : (
          <>
            <Moon className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">Night Mode</span>
          </>
        )}
      </Button>

      {/* Environment Toggle */}
      <Button
        onClick={toggleEnvironment}
        variant="outline"
        size="sm"
        className={`
          flex items-center space-x-2 transition-all duration-500 ease-in-out
          ${isRainforest 
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-300 shadow-lg hover:shadow-xl' 
            : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-amber-300 shadow-lg hover:shadow-xl'
          }
          hover:scale-105 active:scale-95
        `}
        title={`Switch to ${isRainforest ? 'Savannah' : 'Rainforest'} environment`}
      >
        {isRainforest ? (
          <>
            <Trees className="h-4 w-4" />
            <span className="text-sm font-medium">Rainforest</span>
          </>
        ) : (
          <>
            <Mountain className="h-4 w-4" />
            <span className="text-sm font-medium">Savannah</span>
          </>
        )}
      </Button>
    </div>
  );
};

export const ThemeToggleCompact: React.FC = () => {
  const { 
    timeOfDay, 
    environment, 
    toggleTimeOfDay, 
    toggleEnvironment,
    isDay,
    isRainforest 
  } = useTheme();

  return (
    <div className="flex flex-col gap-1">
      {/* Compact Time Toggle */}
      <Button
        onClick={toggleTimeOfDay}
        variant="ghost"
        size="sm"
        className={`
          p-2 transition-all duration-300 ease-in-out
          ${isDay 
            ? 'text-yellow-500 hover:bg-yellow-100 hover:text-yellow-600' 
            : 'text-indigo-500 hover:bg-indigo-100 hover:text-indigo-600'
          }
          hover:scale-110 active:scale-95
        `}
        title={`Switch to ${isDay ? 'Night' : 'Day'} mode`}
      >
        {isDay ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Compact Environment Toggle */}
      <Button
        onClick={toggleEnvironment}
        variant="ghost"
        size="sm"
        className={`
          p-2 transition-all duration-300 ease-in-out
          ${isRainforest 
            ? 'text-green-500 hover:bg-green-100 hover:text-green-600' 
            : 'text-amber-500 hover:bg-amber-100 hover:text-amber-600'
          }
          hover:scale-110 active:scale-95
        `}
        title={`Switch to ${isRainforest ? 'Savannah' : 'Rainforest'} environment`}
      >
        {isRainforest ? <Trees className="h-4 w-4" /> : <Mountain className="h-4 w-4" />}
      </Button>
    </div>
  );
};
