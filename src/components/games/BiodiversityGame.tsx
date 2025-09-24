import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, Bug, CheckCircle, XCircle, Heart } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function BiodiversityGame() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [biodiversityScore, setBiodiversityScore] = useState(100); // Starting biodiversity score
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctActions, setCorrectActions] = useState(0);

  const conservationActions = [
    { 
      id: "protect-habitat", 
      name: t('game.ecosystem.predator.protect.habitat'), 
      impact: +20, 
      correct: true, 
      description: t('game.ecosystem.predator.protect.habitat.desc'),
      icon: "🌳"
    },
    { 
      id: "reduce-pollution", 
      name: t('game.ecosystem.predator.reduce.pollution'), 
      impact: +15, 
      correct: true, 
      description: t('game.ecosystem.predator.reduce.pollution.desc'),
      icon: "🌿"
    },
    { 
      id: "sustainable-farming", 
      name: t('game.ecosystem.predator.sustainable.farming'), 
      impact: +12, 
      correct: true, 
      description: t('game.ecosystem.predator.sustainable.farming.desc'),
      icon: "🚜"
    },
    { 
      id: "marine-protection", 
      name: t('game.ecosystem.predator.marine.protection'), 
      impact: +18, 
      correct: true, 
      description: t('game.ecosystem.predator.marine.protection.desc'),
      icon: "🐠"
    },
    { 
      id: "deforestation", 
      name: t('game.ecosystem.predator.deforestation'), 
      impact: -25, 
      correct: false, 
      description: t('game.ecosystem.predator.deforestation.desc'),
      icon: "🪓"
    },
    { 
      id: "overfishing", 
      name: t('game.ecosystem.predator.overfishing'), 
      impact: -20, 
      correct: false, 
      description: t('game.ecosystem.predator.overfishing.desc'),
      icon: "🎣"
    },
    { 
      id: "urban-sprawl",
      name: t('game.ecosystem.predator.urban.sprawl'), 
      impact: -15, 
      correct: false, 
      description: t('game.ecosystem.predator.urban.sprawl.desc'),
      icon: "🏙️"
    },
    { 
      id: "invasive-species", 
      name: t('game.ecosystem.predator.invasive.species'), 
      impact: -18, 
      correct: false, 
      description: t('game.ecosystem.predator.invasive.species.desc'),
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
    if (score >= 150) return t('game.ecosystem.predator.excellent.ecosystem');
    if (score >= 120) return t('game.ecosystem.predator.good.biodiversity');
    if (score >= 90) return t('game.ecosystem.predator.fair.species');
    if (score >= 60) return t('game.ecosystem.predator.concerning.species');
    return t('game.ecosystem.predator.critical.ecosystem');
  };

  const getScoreLevel = (score: number) => {
    if (score >= 150) return t('game.ecosystem.predator.thriving');
    if (score >= 120) return t('game.ecosystem.predator.healthy');
    if (score >= 90) return t('game.ecosystem.predator.stable');
    if (score >= 60) return t('game.ecosystem.predator.at.risk');
    return t('game.ecosystem.predator.critical');
  };

  if (gameCompleted) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>{t('game.ecosystem.predator.conservation.results')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold text-green-600">🎉 {t('game.complete.celebration')}</div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Heart className="w-8 h-8 text-green-500" />
                <span className={`text-3xl font-bold ${getScoreColor(biodiversityScore)}`}>
                  {biodiversityScore}/200
                </span>
              </div>
              <p className="text-lg font-medium mb-2">{t('game.ecosystem.predator.final.biodiversity').replace('{score}', biodiversityScore.toString())}</p>
              <p className={`text-sm ${getScoreColor(biodiversityScore)}`}>
                {getScoreMessage(biodiversityScore)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">{t('game.ecosystem.predator.conservation.score')}</p>
                <p className="text-2xl font-bold text-green-800">{correctActions}/4</p>
                <p className="text-xs text-green-600">{t('game.ecosystem.predator.correct.actions').replace('{count}', correctActions.toString())}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">{t('game.ecosystem.predator.ecosystem.status')}</p>
                <p className={`text-2xl font-bold ${getScoreColor(biodiversityScore)}`}>
                  {getScoreLevel(biodiversityScore)}
                </p>
                <p className="text-xs text-blue-600">{t('game.ecosystem.predator.biodiversity.level')}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">{t('game.ecosystem.predator.your.actions')}</h4>
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
              {t('game.ecosystem.predator.restart')}
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
          <span>{t('game.ecosystem.predator.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 0 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('game.ecosystem.predator.select.actions')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('game.ecosystem.predator.choose.actions')}
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Heart className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-green-600">{t('game.ecosystem.predator.biodiversity.score').replace('{score}', biodiversityScore.toString())}</span>
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
                {t('game.ecosystem.predator.correct.actions').replace('{count}', selectedActions.length.toString())}
              </p>
              <Button 
                onClick={handleNext} 
                disabled={selectedActions.length === 0}
                className="w-full"
              >
                {t('game.ecosystem.predator.assess.impact')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">{t('game.ecosystem.predator.conservation.results')}</h3>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Heart className="w-12 h-12 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('game.ecosystem.predator.final.biodiversity').replace('{score}', biodiversityScore.toString())}</p>
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
                  <p className="text-sm text-green-600 font-medium">{t('game.ecosystem.predator.conservation.score')}</p>
                  <p className="text-2xl font-bold text-green-800">{correctActions}/4</p>
                  <p className="text-xs text-green-600">{t('game.ecosystem.predator.correct.choices')}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">{t('game.ecosystem.predator.ecosystem.status')}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(biodiversityScore)}`}>
                    {getScoreLevel(biodiversityScore)}
                  </p>
                  <p className="text-xs text-blue-600">{t('game.ecosystem.predator.biodiversity.level')}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="font-semibold">{t('game.ecosystem.predator.your.actions')}</h4>
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
                {t('game.ecosystem.predator.view.final.assessment')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

