import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Zap, CheckCircle, XCircle } from "lucide-react";

export function ClimateChangeGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [temperature, setTemperature] = useState(15); // Starting temperature in Celsius
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const climateFactors = [
    { id: "fossil-fuels", name: "Fossil Fuel Usage", impact: +2, correct: true, description: "Burning fossil fuels releases CO₂" },
    { id: "deforestation", name: "Deforestation", impact: +1.5, correct: true, description: "Trees absorb CO₂ from atmosphere" },
    { id: "renewable-energy", name: "Renewable Energy", impact: -1, correct: false, description: "Clean energy reduces emissions" },
    { id: "industrial-emissions", name: "Industrial Emissions", impact: +2.5, correct: true, description: "Factories release greenhouse gases" },
    { id: "transportation", name: "Transportation", impact: +1.8, correct: true, description: "Cars and planes emit CO₂" },
    { id: "agriculture", name: "Agriculture", impact: +1.2, correct: true, description: "Livestock and fertilizers emit methane" },
    { id: "reforestation", name: "Reforestation", impact: -0.8, correct: false, description: "Planting trees absorbs CO₂" },
    { id: "carbon-capture", name: "Carbon Capture", impact: -1.5, correct: false, description: "Technology removes CO₂ from air" }
  ];

  const handleFactorSelect = (factorId: string) => {
    if (selectedFactors.includes(factorId)) {
      setSelectedFactors(selectedFactors.filter(id => id !== factorId));
    } else if (selectedFactors.length < 4) {
      setSelectedFactors([...selectedFactors, factorId]);
    }
  };

  const calculateTemperature = () => {
    let newTemp = 15; // Base temperature
    selectedFactors.forEach(factorId => {
      const factor = climateFactors.find(f => f.id === factorId);
      if (factor) {
        newTemp += factor.impact;
      }
    });
    return Math.max(10, Math.min(25, newTemp)); // Keep temperature between 10-25°C
  };

  const handleNext = () => {
    if (currentStep === 0) {
      setTemperature(calculateTemperature());
      setCurrentStep(1);
      
      // Calculate score based on correct factor selection
      const correctSelections = selectedFactors.filter(id => {
        const factor = climateFactors.find(f => f.id === id);
        return factor?.correct;
      }).length;
      setScore(correctSelections);
    } else {
      setGameCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedFactors([]);
    setTemperature(15);
    setGameCompleted(false);
    setScore(0);
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 17) return "text-blue-600";
    if (temp < 19) return "text-green-600";
    if (temp < 21) return "text-yellow-600";
    if (temp < 23) return "text-orange-600";
    return "text-red-600";
  };

  const getTemperatureMessage = (temp: number) => {
    if (temp < 17) return "Excellent! Low carbon footprint.";
    if (temp < 19) return "Good! Moderate climate impact.";
    if (temp < 21) return "Fair. Some room for improvement.";
    if (temp < 23) return "Concerning. High emissions.";
    return "Critical! Immediate action needed.";
  };

  if (gameCompleted) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Climate Model Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold text-green-600">🎉 Game Complete!</div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <span className={`text-3xl font-bold ${getTemperatureColor(temperature)}`}>
                  {temperature.toFixed(1)}°C
                </span>
              </div>
              <p className="text-lg font-medium mb-2">Global Average Temperature</p>
              <p className={`text-sm ${getTemperatureColor(temperature)}`}>
                {getTemperatureMessage(temperature)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Score</p>
                <p className="text-2xl font-bold text-blue-800">{score}/4</p>
                <p className="text-xs text-blue-600">Correct Factors</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Impact</p>
                <p className={`text-2xl font-bold ${getTemperatureColor(temperature)}`}>
                  {temperature < 19 ? "Low" : temperature < 23 ? "Medium" : "High"}
                </p>
                <p className="text-xs text-green-600">Climate Impact</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Selected Factors:</h4>
              {selectedFactors.map(factorId => {
                const factor = climateFactors.find(f => f.id === factorId);
                return (
                  <div key={factorId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    {factor?.correct ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm">{factor?.name}</span>
                    <Badge variant={factor?.correct ? "default" : "destructive"} className="text-xs">
                      {factor?.impact > 0 ? `+${factor.impact}°C` : `${factor?.impact}°C`}
                    </Badge>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleRestart} className="w-full">
              Play Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Thermometer className="w-5 h-5" />
          <span>Climate Model Simulator</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 0 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Select Climate Factors</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose up to 4 factors that affect global temperature. Select the ones that contribute to climate change.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Thermometer className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">Current: {temperature}°C</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {climateFactors.map((factor) => (
                <button
                  key={factor.id}
                  onClick={() => handleFactorSelect(factor.id)}
                  disabled={!selectedFactors.includes(factor.id) && selectedFactors.length >= 4}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedFactors.includes(factor.id)
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : selectedFactors.length >= 4 && !selectedFactors.includes(factor.id)
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{factor.name}</span>
                    <Badge 
                      variant={factor.impact > 0 ? "destructive" : "default"} 
                      className="text-xs"
                    >
                      {factor.impact > 0 ? `+${factor.impact}°C` : `${factor.impact}°C`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{factor.description}</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedFactors.length}/4 factors
              </p>
              <Button 
                onClick={handleNext} 
                disabled={selectedFactors.length === 0}
                className="w-full"
              >
                Run Climate Model
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Climate Model Results</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Thermometer className="w-12 h-12 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">New Global Temperature</p>
                    <p className={`text-4xl font-bold ${getTemperatureColor(temperature)}`}>
                      {temperature.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-medium ${getTemperatureColor(temperature)}`}>
                  {getTemperatureMessage(temperature)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Score</p>
                  <p className="text-2xl font-bold text-blue-800">{score}/4</p>
                  <p className="text-xs text-blue-600">Correct Factors</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Impact</p>
                  <p className={`text-2xl font-bold ${getTemperatureColor(temperature)}`}>
                    {temperature < 19 ? "Low" : temperature < 23 ? "Medium" : "High"}
                  </p>
                  <p className="text-xs text-green-600">Climate Impact</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="font-semibold">Your Selections:</h4>
                {selectedFactors.map(factorId => {
                  const factor = climateFactors.find(f => f.id === factorId);
                  return (
                    <div key={factorId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                      {factor?.correct ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span>{factor?.name}</span>
                      <Badge variant={factor?.correct ? "default" : "destructive"} className="text-xs">
                        {factor?.impact > 0 ? `+${factor.impact}°C` : `${factor?.impact}°C`}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleNext} className="w-full">
                View Final Results
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

