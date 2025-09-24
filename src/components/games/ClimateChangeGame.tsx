import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Thermometer, Zap, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function ClimateChangeGame() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [temperature, setTemperature] = useState(15); // Starting temperature in Celsius
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const climateFactors = [
    { id: "fossil-fuels", name: t('game.climate.simulator.fossil.fuels'), impact: +2, correct: true, description: t('game.climate.simulator.fossil.fuels.desc') },
    { id: "deforestation", name: t('game.climate.simulator.deforestation'), impact: +1.5, correct: true, description: t('game.climate.simulator.deforestation.desc') },
    { id: "renewable-energy", name: t('game.climate.simulator.renewable.energy'), impact: -1, correct: false, description: t('game.climate.simulator.renewable.energy.desc') },
    { id: "industrial-emissions", name: t('game.climate.simulator.industrial.emissions'), impact: +2.5, correct: true, description: t('game.climate.simulator.industrial.emissions.desc') },
    { id: "transportation", name: t('game.climate.simulator.transportation'), impact: +1.8, correct: true, description: t('game.climate.simulator.transportation.desc') },
    { id: "agriculture", name: t('game.climate.simulator.agriculture'), impact: +1.2, correct: true, description: t('game.climate.simulator.agriculture.desc') },
    { id: "reforestation", name: t('game.climate.simulator.reforestation'), impact: -0.8, correct: false, description: t('game.climate.simulator.reforestation.desc') },
    { id: "carbon-capture", name: t('game.climate.simulator.carbon.capture'), impact: -1.5, correct: false, description: t('game.climate.simulator.carbon.capture.desc') }
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
    if (temp < 17) return t('game.climate.simulator.excellent');
    if (temp < 19) return t('game.climate.simulator.good');
    if (temp < 21) return t('game.climate.simulator.needs.improvement');
    if (temp < 23) return t('game.climate.simulator.needs.improvement');
    return t('game.climate.simulator.needs.improvement');
  };

  if (gameCompleted) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>{t('game.climate.simulator.simulation.results')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="text-4xl font-bold text-green-600">🎉 {t('game.complete.celebration')}</div>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Thermometer className="w-8 h-8 text-orange-500" />
                <span className={`text-3xl font-bold ${getTemperatureColor(temperature)}`}>
                  {temperature.toFixed(1)}°C
                </span>
              </div>
              <p className="text-lg font-medium mb-2">{t('game.climate.simulator.final.temperature').replace('{temperature}', temperature.toFixed(1))}</p>
              <p className={`text-sm ${getTemperatureColor(temperature)}`}>
                {getTemperatureMessage(temperature)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">{t('game.score')}</p>
                <p className="text-2xl font-bold text-blue-800">{score}/4</p>
                <p className="text-xs text-blue-600">{t('game.climate.simulator.correct.factors').replace('{count}', score.toString())}</p>
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
              {t('game.climate.simulator.restart')}
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
          <span>{t('game.climate.simulator.title')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {currentStep === 0 ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">{t('game.climate.simulator.select.factors')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('game.climate.simulator.choose.factors')}
              </p>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Thermometer className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">{t('game.climate.simulator.current.temperature').replace('{temperature}', temperature.toString())}</span>
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
                {t('game.climate.simulator.correct.factors').replace('{count}', selectedFactors.length.toString())}
              </p>
              <Button 
                onClick={handleNext} 
                disabled={selectedFactors.length === 0}
                className="w-full"
              >
                {t('game.climate.simulator.run.model')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">{t('game.climate.simulator.simulation.results')}</h3>
              
              <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg mb-6">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <Thermometer className="w-12 h-12 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t('game.climate.simulator.new.temperature')}</p>
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
                  <p className="text-sm text-blue-600 font-medium">{t('game.score')}</p>
                  <p className="text-2xl font-bold text-blue-800">{score}/4</p>
                  <p className="text-xs text-blue-600">{t('game.climate.simulator.correct.factors').replace('{count}', score.toString())}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">{t('game.climate.simulator.impact')}</p>
                  <p className={`text-2xl font-bold ${getTemperatureColor(temperature)}`}>
                    {temperature < 19 ? t('game.climate.simulator.impact.low') : temperature < 23 ? t('game.climate.simulator.impact.medium') : t('game.climate.simulator.impact.high')}
                  </p>
                  <p className="text-xs text-green-600">{t('game.climate.simulator.climate.impact')}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <h4 className="font-semibold">{t('game.climate.simulator.your.selections')}</h4>
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
                {t('game.climate.simulator.view.final.results')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

