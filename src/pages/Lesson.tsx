import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, RotateCcw, ArrowRight, Clock, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Import games
import { WasteManagementGame } from "@/components/games/WasteManagementGame";
import { WaterTreatmentGame } from "@/components/games/WaterTreatmentGame";
import { PollutionFreeGame } from "@/components/games/PollutionFreeGame";
import { AfforestationGame } from "@/components/games/AfforestationGame";
import { DeforestationGame } from "@/components/games/DeforestationGame";
import { RenewableEnergyGame } from "@/components/games/RenewableEnergyGame";

// Import lesson images
import wasteManagementImg from "@/assets/lesson-waste-management.jpg";
import waterTreatmentImg from "@/assets/lesson-water-treatment.jpg";
import pollutionFreeImg from "@/assets/lesson-pollution-free.jpg";
import afforestationImg from "@/assets/lesson-afforestation.jpg";
import deforestationImg from "@/assets/lesson-deforestation.jpg";
import renewableEnergyImg from "@/assets/lesson-renewable-energy.jpg";

const getLessonsData = (t: (key: string) => string) => ({
  1: {
    title: t('lesson.waste.management'),
    description: t('lesson.waste.management.desc'),
    image: wasteManagementImg,
    duration: `15 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    content:
      "Understanding waste management is crucial for environmental protection. This lesson covers the 3 R's: Reduce, Reuse, and Recycle. You'll learn about different types of waste, proper sorting techniques, composting methods, and how individuals and communities can implement effective waste management strategies.",
    videoDescription:
      "Watch this comprehensive guide to waste management practices and see real-world examples of successful recycling programs.",
  },
  2: {
    title: t('lesson.water.treatment'),
    description: t('lesson.water.treatment.desc'),
    image: waterTreatmentImg,
    duration: `12 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    content:
      "Water treatment is essential for public health and environmental sustainability. Learn about the multi-step process including screening, sedimentation, filtration, and disinfection. Understand how wastewater treatment plants work and the importance of protecting our water resources.",
    videoDescription:
      "Take a virtual tour of a water treatment facility and see the amazing technology that keeps our water clean.",
  },
  3: {
    title: t('lesson.pollution.free'),
    description: t('lesson.pollution.free.desc'),
    image: pollutionFreeImg,
    duration: `18 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate'),
    content:
      "Creating pollution-free zones requires understanding different types of pollution and implementing comprehensive solutions. Learn about air quality monitoring, green transportation, industrial emission controls, and community-based environmental protection initiatives.",
    videoDescription:
      "Discover successful pollution-free zone projects around the world and learn how communities are fighting pollution.",
  },
  4: {
    title: t('lesson.afforestation'),
    description: t('lesson.afforestation.desc'),
    image: afforestationImg,
    duration: `14 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    content:
      "Afforestation is the process of creating forests in areas that were not previously forested. Learn about tree species selection, planting techniques, forest ecosystem development, and the long-term benefits of afforestation for climate regulation and biodiversity conservation.",
    videoDescription:
      "Join forest restoration projects and witness the incredible transformation of barren land into thriving forests.",
  },
  5: {
    title: t('lesson.deforestation'),
    description: t('lesson.deforestation.desc'),
    image: deforestationImg,
    duration: `16 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate'),
    content:
      "Deforestation has far-reaching consequences for climate, biodiversity, and human communities. Understand the main drivers of forest loss, including agriculture, logging, and urban development. Learn about sustainable alternatives and conservation strategies.",
    videoDescription:
      "Explore the impact of deforestation and discover how communities are working to protect their forests.",
  },
  6: {
    title: t('lesson.renewable.energy'),
    description: t('lesson.renewable.energy.desc'),
    image: renewableEnergyImg,
    duration: `20 ${t('common.minutes')}`,
    difficulty: t('difficulty.advanced'),
    content:
      "Renewable energy is key to reducing greenhouse gas emissions and achieving energy independence. Learn about different renewable technologies, their efficiency, costs, and environmental benefits. Understand how renewable energy systems work and their role in the global energy transition.",
    videoDescription:
      "See cutting-edge renewable energy installations and learn how clean energy is revolutionizing our world.",
  },
});

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);

  const lessonsData = getLessonsData(t);
  const lesson = id
    ? lessonsData[parseInt(id) as keyof typeof lessonsData]
    : null;

  const videoDuration = 15; // Simulated 15-second video

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < videoDuration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 0.1;
          setProgress((newTime / videoDuration) * 100);
          if (newTime >= videoDuration) {
            setIsPlaying(false);
            return videoDuration;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, videoDuration]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleRestart = () => {
    setCurrentTime(0);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleStartQuiz = () => navigate(`/quiz/${id}`);

  const handleGameComplete = () => {
    console.log("Game completed! Quiz unlocked!");
  };

  const renderGame = () => {
    if (!id) return null;
    const gameProps = { onComplete: handleGameComplete };
    switch (parseInt(id)) {
      case 1:
        return <WasteManagementGame {...gameProps} />;
      case 2:
        return <WaterTreatmentGame {...gameProps} />;
      case 3:
        return <PollutionFreeGame {...gameProps} />;
      case 4:
        return <AfforestationGame {...gameProps} />;
      case 5:
        return <DeforestationGame {...gameProps} />;
      case 6:
        return <RenewableEnergyGame {...gameProps} />;
      default:
        return null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">
            {t('lesson.not.found')}
          </h1>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            {t('lesson.back.to.dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <Badge variant="secondary" className="mb-4">
            {lesson.difficulty}
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {lesson.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-4">
            {lesson.description}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-4 h-4" />
              <span>{t('lesson.interactive.lesson')}</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="video">{t('lesson.video')}</TabsTrigger>
            <TabsTrigger value="game">{t('lesson.game')}</TabsTrigger>
            <TabsTrigger value="content">{t('lesson.content')}</TabsTrigger>
          </TabsList>

          {/* Video Tab */}
          <TabsContent value="video" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-card mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-primary" />
                      <span>{t('lesson.video.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video Player Simulation */}
                    <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                      <img
                        src={lesson.image}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center">
                          <Button
                            size="lg"
                            onClick={handlePlayPause}
                            className="mb-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-white/30"
                          >
                            {isPlaying ? (
                              <Pause className="w-8 h-8" />
                            ) : (
                              <Play className="w-8 h-8" />
                            )}
                          </Button>
                          <p className="text-white text-sm opacity-80">
                            {lesson.videoDescription}
                          </p>
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
                            {formatTime(currentTime)} / {""}
                            {formatTime(videoDuration)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        {t('lesson.video.simulated')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">{/* optional sidebar */}</div>
            </div>
          </TabsContent>

          {/* Game Tab */}
          <TabsContent value="game" className="space-y-6">
            {renderGame()}
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>{t('lesson.overview')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {lesson.content}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">{t('lesson.your.progress')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>{t('lesson.video.progress')}</span>
                  <span>{Math.round(progress)}{t('common.percent')}</span>
                </div>
                <Progress value={progress} className="h-3" />

                {progress >= 100 ? (
                  <div className="text-center">
                    <div className="text-success text-2xl mb-2">🎉</div>
                    <p className="text-sm text-success font-medium">
                      {t('lesson.video.completed')}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {t('lesson.watch.complete')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">{t('lesson.ready.quiz')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {t('lesson.test.knowledge')}
              </p>
              <Button
                onClick={handleStartQuiz}
                disabled={progress < 100}
                className="w-full bg-gradient-nature hover:opacity-90 disabled:opacity-50"
              >
                {progress < 100 ? (
                  t('lesson.complete.video.first')
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t('lesson.start.quiz')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">{t('lesson.quick.facts')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lesson.title === "Waste Management" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">♻️</span>
                      <p className="text-sm">
                        {t('fact.recycling.trees')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🗑️</span>
                      <p className="text-sm">{t('fact.composting.waste')}</p>
                    </div>
                  </>
                )}
                {lesson.title === "Water Treatment" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">💧</span>
                      <p className="text-sm">{t('fact.clean.water.diseases')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🏭</span>
                      <p className="text-sm">
                        {t('fact.modern.plants.pollutants')}
                      </p>
                    </div>
                  </>
                )}
                {(lesson.title === "Pollution-Free Zones" ||
                  lesson.title === "Afforestation" ||
                  lesson.title === "Deforestation" ||
                  lesson.title === "Renewable Energy") && (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🌱</span>
                      <p className="text-sm">{t('fact.every.action.difference')}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">🌍</span>
                      <p className="text-sm">{t('fact.together.protect.planet')}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
