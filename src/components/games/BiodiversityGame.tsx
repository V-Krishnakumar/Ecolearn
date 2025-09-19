import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, Bug, CheckCircle, XCircle, Heart } from "lucide-react";

export function BiodiversityGame() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [biodiversityScore, setBiodiversityScore] = useState(100); // Starting biodiversity score
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctActions, setCorrectActions] = useState(0);

  const conservationActions = [
    { 
      id: "protect-habitat", 
      name: "Protect Natural Habitats", 
      impact: +20, 
      correct: true, 
      description: "Preserving ecosystems maintains species diversity",
      icon: "🌳"
    },
    { 
      id: "reduce-pollution", 
      name: "Reduce Pollution", 
      impact: +15, 
      correct: true, 
      description: "Cleaner environment helps all species thrive",
      icon: "🌿"
    },
    { 
      id: "sustainable-farming", 
      name: "Sustainable Agriculture", 
      impact: +12, 
      correct: true, 
      description: "Eco-friendly farming protects soil and wildlife",
      icon: "🚜"
    },
    { 
      id: "marine-protection", 
      name: "Marine Protection", 
      impact: +18, 
      correct: true, 
      description: "Protecting oceans preserves marine biodiversity",
      icon: "🐠"
    },
    { 
      id: "deforestation", 
      name: "Deforestation", 
      impact: -25, 
      correct: false, 
      description: "Cutting down forests destroys habitats",
      icon: "🪓"
    },
    { 
      id: "overfishing", 
      name: "Overfishing", 
      impact: -20, 
      correct: false, 
      description: "Excessive fishing depletes fish populations",
      icon: "🎣"
    },
    { 
      id: "urban-sprawl", 
      name: "Urban Sprawl", 
      impact: -15, 
      correct: false, 
      description: "City expansion destroys natural habitats",
      icon: "🏙️"
    },
    { 
      id: "invasive-species", 
      name: "Invasive Species", 
      impact: -18, 
      correct: false, 
      description: "Non-native species can harm local ecosystems",
      icon: "🦎"
    }
  ];

  const handleActionSelect = (actionId: string) => {
    if (selectedActions.includes(actionId)) {
      setSelectedActions(selectedActions.filter(id => id !== actionId));
    } else if (selectedActions.length < 4) {
      setSelectedActions([...selectedActions, actionId]);
    }
  };

  const calculateBiodiversityScore = () => {
    let newScore = 100; // Base biodiversity score
    selectedActions.forEach(actionId => {
      const action = conservationActions.find(a => a.id === actionId);
      if (action) {
        newScore += action.impact;
      }
    });
    return Math.max(0, Math.min(200, newScore)); // Keep score between 0-200
  };

  const handleNext = () => {
    if (currentStep === 0) {
      const newScore = calculateBiodiversityScore();
      setBiodiversityScore(newScore);
      
      // Count correct actions
      const correctCount = selectedActions.filter(id => {
        const action = conservationActions.find(a => a.id === id);
        return action?.correct;
      }).length;
      setCorrectActions(correctCount);
      
      setCurrentStep(1);
    } else {
      setGameCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setSelectedActions([]);
    setBiodiversityScore(100);
    setGameCompleted(false);
    setCorrectActions(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 150) return "text-green-600";
    if (score >= 120) return "text-blue-600";
    if (score >= 90) return "text-yellow-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number) => {
    if (score >= 150) return "Excellent! Ecosystem is thriving!";
    if (score >= 120) return "Good! Healthy biodiversity levels.";
    if (score >= 90) return "Fair. Some species at risk.";
    if (score >= 60) return "Concerning. Many species endangered.";
    return "Critical! Ecosystem collapse imminent.";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 150) return "Thriving";
    if (score >= 120) return "Healthy";
    if (score >= 90) return "Stable";
    if (score >= 60) return "At Risk";
    return "Critical";
  };

  if (gameCompleted) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Biodiversity Assessment Complete</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold text-green-600">🎉 Mission Complete!</div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Heart className="w-8 h-8 text-green-500" />
                <span className={`text-3xl font-bold ${getScoreColor(biodiversityScore)}`}>
                  {biodiversityScore}/200
                </span>
              </div>
              <p className="text-lg font-medium mb-2">Biodiversity Score</p>
              <p className={`text-sm ${getScoreColor(biodiversityScore)}`}>
                {getScoreMessage(biodiversityScore)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Conservation Actions</p>
                <p className="text-2xl font-bold text-green-800">{correctActions}/4</p>
                <p className="text-xs text-green-600">Correct Choices</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Ecosystem Status</p>
                <p className={`text-2xl font-bold ${getScoreColor(biodiversityScore)}`}>
                  {getScoreLevel(biodiversityScore)}
                </p>
                <p className="text-xs text-blue-600">Biodiversity Level</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Your Actions:</h4>
              {selectedActions.map(actionId => {
                const action = conservationActions.find(a => a.id === actionId);
                return (
                  <div key={actionId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <span className="text-lg">{action?.icon}</span>
                    {action?.correct ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm flex-1">{action?.name}</span>
                    <Badge variant={action?.impact > 0 ? "default" : "destructive"} className="text-xs">
                      {action?.impact > 0 ? `+${action.impact}` : `${action?.impact}`}
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
          <TreePine className="w-5 h-5" />
          <span>Ecosystem Protector</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 0 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Protect Biodiversity</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose up to 4 actions to protect biodiversity. Select conservation actions that help preserve species diversity.
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">Biodiversity: {biodiversityScore}/200</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {conservationActions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionSelect(action.id)}
                  disabled={!selectedActions.includes(action.id) && selectedActions.length >= 4}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedActions.includes(action.id)
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : selectedActions.length >= 4 && !selectedActions.includes(action.id)
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{action.icon}</span>
                      <span className="font-medium text-sm">{action.name}</span>
                    </div>
                    <Badge 
                      variant={action.impact > 0 ? "default" : "destructive"} 
                      className="text-xs"
                    >
                      {action.impact > 0 ? `+${action.impact}` : `${action.impact}`}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </button>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Selected: {selectedActions.length}/4 actions
              </p>
              <Button 
                onClick={handleNext} 
                disabled={selectedActions.length === 0}
                className="w-full"
              >
                Assess Biodiversity Impact
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">Biodiversity Assessment Results</h3>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Heart className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">New Biodiversity Score</p>
                    <p className={`text-4xl font-bold ${getScoreColor(biodiversityScore)}`}>
                      {biodiversityScore}/200
                    </p>
                  </div>
                </div>
                <p className={`text-lg font-medium ${getScoreColor(biodiversityScore)}`}>
                  {getScoreMessage(biodiversityScore)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">Conservation Score</p>
                  <p className="text-2xl font-bold text-green-800">{correctActions}/4</p>
                  <p className="text-xs text-green-600">Correct Actions</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">Ecosystem Status</p>
                  <p className={`text-2xl font-bold ${getScoreColor(biodiversityScore)}`}>
                    {getScoreLevel(biodiversityScore)}
                  </p>
                  <p className="text-xs text-blue-600">Biodiversity Level</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="font-semibold">Your Actions:</h4>
                {selectedActions.map(actionId => {
                  const action = conservationActions.find(a => a.id === actionId);
                  return (
                    <div key={actionId} className="flex items-center space-x-2 p-2 bg-gray-50 rounded text-sm">
                      <span className="text-base">{action?.icon}</span>
                      {action?.correct ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="flex-1">{action?.name}</span>
                      <Badge variant={action?.impact > 0 ? "default" : "destructive"} className="text-xs">
                        {action?.impact > 0 ? `+${action.impact}` : `${action?.impact}`}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleNext} className="w-full">
                View Final Assessment
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

