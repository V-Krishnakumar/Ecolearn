import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, ArrowRight, Clock, BookOpen, TreePine, Bug, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BiodiversityGame } from "@/components/games/BiodiversityGame";
const biodiversityImg = "/images/lesson-biodiversity.jpg";

export default function Biodiversity() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration] = useState(20); // 20 seconds
  const [isVideoCompleted, setIsVideoCompleted] = useState(false);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Quiz questions
  const quizQuestions = [
    {
      question: "What is biodiversity?",
      options: [
        "Only the number of species",
        "The variety of life on Earth at all levels",
        "Only plants and animals",
        "Only endangered species"
      ],
      correct: 1,
      explanation: "Biodiversity refers to the variety of life on Earth, including genetic diversity, species diversity, and ecosystem diversity."
    },
    {
      question: "What is the main threat to biodiversity today?",
      options: [
        "Natural disasters",
        "Climate change",
        "Habitat loss and degradation",
        "Predator-prey relationships"
      ],
      correct: 2,
      explanation: "Habitat loss and degradation, often caused by human activities, is the primary threat to biodiversity worldwide."
    },
    {
      question: "What are ecosystem services?",
      options: [
        "Services provided by ecosystems to humans",
        "Tourism in natural areas",
        "Government environmental programs",
        "Commercial logging operations"
      ],
      correct: 0,
      explanation: "Ecosystem services are the benefits that humans receive from ecosystems, such as clean air, water, pollination, and climate regulation."
    }
  ];


  // Video controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
  };

  // Simulate video progress
  useEffect(() => {
    if (isPlaying && progress < 100) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          const newProgress = (newTime / videoDuration) * 100;
          setProgress(newProgress);
          
          if (newProgress >= 100) {
            setIsVideoCompleted(true);
            setIsPlaying(false);
          }
          
          return newTime;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, progress, videoDuration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz functions
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      if (parseInt(selectedAnswer) === quizQuestions[currentQuestion].correct) {
        setScore(score + 1);
      }
      
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setQuizCompleted(true);
        setShowResults(true);
      }
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setShowResults(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <Badge variant="secondary" className="mb-4">
            {t('advanced.common.advanced')}
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('advanced.biodiversity.title')}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {t('advanced.biodiversity.description')}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>20 {t('advanced.common.seconds')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{t('advanced.common.advanced')} {t('advanced.common.module')}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video">📹 {t('advanced.common.video')}</TabsTrigger>
            <TabsTrigger value="game">🎮 {t('advanced.common.game')}</TabsTrigger>
            <TabsTrigger value="content">📚 {t('advanced.common.content')}</TabsTrigger>
          </TabsList>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-card mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>{t('advanced.biodiversity.video.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative rounded-lg overflow-hidden h-64 mb-4">
                      <img 
                        src={biodiversityImg} 
                        alt="Biodiversity and Conservation" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white">
                          <TreePine className="w-16 h-16 mx-auto mb-4 opacity-75" />
                          <h3 className="text-xl font-semibold mb-2">{t('advanced.biodiversity.title')}</h3>
                          <p className="text-sm opacity-75">{t('advanced.common.advanced')} {t('advanced.common.module')} {t('advanced.common.video')}</p>
                        </div>
                      </div>

                      {/* Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <div className="flex items-center space-x-3">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handlePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleRestart}
                            className="text-white hover:bg-white/20"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <div className="flex-1">
                            <Progress value={progress} className="h-2" />
                          </div>
                          <span className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(videoDuration)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        📹 This is a simulated video player. In a real implementation, you would embed actual educational videos here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Game Tab */}
          <TabsContent value="game" className="space-y-6">
            <BiodiversityGame />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>{t('advanced.common.module.overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('advanced.biodiversity.content.overview')}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold mb-2">{t('advanced.biodiversity.content.topics.title')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('advanced.biodiversity.content.topics.1')}</li>
                      <li>• {t('advanced.biodiversity.content.topics.2')}</li>
                      <li>• {t('advanced.biodiversity.content.topics.3')}</li>
                      <li>• {t('advanced.biodiversity.content.topics.4')}</li>
                      <li>• {t('advanced.biodiversity.content.topics.5')}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('advanced.biodiversity.content.outcomes.title')}</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• {t('advanced.biodiversity.content.outcomes.1')}</li>
                      <li>• {t('advanced.biodiversity.content.outcomes.2')}</li>
                      <li>• {t('advanced.biodiversity.content.outcomes.3')}</li>
                      <li>• {t('advanced.biodiversity.content.outcomes.4')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>{t('advanced.common.quick.facts')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    t('advanced.biodiversity.facts.1'),
                    t('advanced.biodiversity.facts.2'),
                    t('advanced.biodiversity.facts.3'),
                    t('advanced.biodiversity.facts.4'),
                    t('advanced.biodiversity.facts.5')
                  ].map((fact, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-emerald-800">{fact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">{t('advanced.common.your.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{t('advanced.common.video.progress')}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {isVideoCompleted ? t('advanced.common.video.completed') : t('advanced.common.watch.complete')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Section */}
          {isVideoCompleted && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">{t('advanced.common.ready.quiz')}</CardTitle>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {t('advanced.common.test.knowledge')}
                    </p>
                    <div className="space-y-3">
                      <p className="text-sm font-medium">
                        {t('advanced.common.question')} {currentQuestion + 1} {t('advanced.common.of')} {quizQuestions.length}
                      </p>
                      <p className="text-sm">{quizQuestions[currentQuestion].question}</p>
                      <div className="space-y-2">
                        {quizQuestions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                              selectedAnswer === index.toString()
                                ? 'border-green-500 bg-green-50 text-green-800'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <Button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null}
                        className="w-full"
                      >
                        {currentQuestion < quizQuestions.length - 1 ? t('advanced.common.next.question') : t('advanced.common.view.results')}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">{t('advanced.common.quiz.complete')}</h3>
                    <p className="text-sm">
                      {t('advanced.common.you.scored')} {score} {t('advanced.common.out.of')} {quizQuestions.length} {t('advanced.common.questions.correctly')}
                    </p>
                    <div className="space-y-2">
                      {quizQuestions.map((q, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium">{q.question}</p>
                          <p className="text-xs text-muted-foreground mt-1">{q.explanation}</p>
                        </div>
                      ))}
                    </div>
                    <Button onClick={handleRetakeQuiz} variant="outline" className="w-full">
                      {t('advanced.common.retake.quiz')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Button onClick={() => navigate("/dashboard")} className="mt-4">
          {t('advanced.common.back.dashboard')}
        </Button>
      </main>
    </div>
  );
}
