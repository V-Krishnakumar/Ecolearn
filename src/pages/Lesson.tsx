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
import { useProgress } from "@/lib/localProgress";
import { useAchievements } from "@/hooks/useAchievements";
import VideoPlayer from "@/components/VideoPlayer";
import { AchievementNotification } from "@/components/AchievementNotification";

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
    content: t('lesson.waste.management.content'),
    sdgContent: {
      title: t('sdg.waste.management.title'),
      goals: [
        {
          number: "SDG 12",
          title: t('sdg.12.title'),
          description: t('sdg.12.desc')
        },
        {
          number: "SDG 11", 
          title: t('sdg.11.title'),
          description: t('sdg.11.desc')
        },
        {
          number: "SDG 13",
          title: t('sdg.13.title'), 
          description: t('sdg.13.desc')
        }
      ]
    },
    videoDescription: t('video.waste.management.desc'),
    videoSrc: "/videos/Waste Management.mp4",
  },
  2: {
    title: t('lesson.water.treatment'),
    description: t('lesson.water.treatment.desc'),
    image: waterTreatmentImg,
    duration: `12 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    content: t('lesson.water.treatment.content'),
    sdgContent: {
      title: t('sdg.water.treatment.title'),
      goals: [
        {
          number: "SDG 6",
          title: t('sdg.6.title'),
          description: t('sdg.6.desc')
        },
        {
          number: "SDG 3", 
          title: t('sdg.3.title'),
          description: t('sdg.3.desc')
        },
        {
          number: "SDG 14",
          title: t('sdg.14.title'), 
          description: t('sdg.14.desc')
        }
      ]
    },
    videoDescription: t('video.water.treatment.desc'),
    videoSrc: "/videos/Water Treatment.mp4",
  },
  3: {
    title: t('lesson.pollution.free'),
    description: t('lesson.pollution.free.desc'),
    image: pollutionFreeImg,
    duration: `18 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate'),
    content: t('lesson.pollution.free.content'),
    sdgContent: {
      title: t('sdg.pollution.free.title'),
      goals: [
        {
          number: "SDG 11",
          title: t('sdg.11.title'),
          description: t('sdg.11.desc')
        },
        {
          number: "SDG 13", 
          title: t('sdg.13.title'),
          description: t('sdg.13.desc')
        },
        {
          number: "SDG 15",
          title: t('sdg.15.title'), 
          description: t('sdg.15.desc')
        }
      ]
    },
    videoDescription: t('video.pollution.free.desc'),
    videoSrc: "/videos/Pollution - Free Zones.mp4",
  },
  4: {
    title: t('lesson.afforestation'),
    description: t('lesson.afforestation.desc'),
    image: afforestationImg,
    duration: `14 ${t('common.minutes')}`,
    difficulty: t('difficulty.beginner'),
    content: t('lesson.afforestation.content'),
    sdgContent: {
      title: t('sdg.afforestation.title'),
      goals: [
        {
          number: "SDG 13",
          title: t('sdg.13.title'),
          description: t('sdg.13.desc')
        },
        {
          number: "SDG 15", 
          title: t('sdg.15.title'),
          description: t('sdg.15.desc')
        },
        {
          number: "SDG 6",
          title: t('sdg.6.title'), 
          description: t('sdg.6.desc')
        }
      ]
    },
    videoDescription: t('video.afforestation.desc'),
    videoSrc: "/videos/Afforestation.mp4",
  },
  5: {
    title: t('lesson.deforestation'),
    description: t('lesson.deforestation.desc'),
    image: deforestationImg,
    duration: `16 ${t('common.minutes')}`,
    difficulty: t('difficulty.intermediate'),
    content: t('lesson.deforestation.content'),
    sdgContent: {
      title: t('sdg.deforestation.title'),
      goals: [
        {
          number: "SDG 15",
          title: t('sdg.15.title'),
          description: t('sdg.15.desc')
        },
        {
          number: "SDG 13", 
          title: t('sdg.13.title'),
          description: t('sdg.13.desc')
        },
        {
          number: "SDG 6",
          title: t('sdg.6.title'), 
          description: t('sdg.6.desc')
        }
      ]
    },
    videoDescription: t('video.deforestation.desc'),
    videoSrc: "/videos/Deforestation.mp4",
  },
  6: {
    title: t('lesson.renewable.energy'),
    description: t('lesson.renewable.energy.desc'),
    image: renewableEnergyImg,
    duration: `20 ${t('common.minutes')}`,
    difficulty: t('difficulty.advanced'),
    content: t('lesson.renewable.energy.content'),
    sdgContent: {
      title: t('sdg.renewable.energy.title'),
      goals: [
        {
          number: "SDG 7",
          title: t('sdg.7.title'),
          description: t('sdg.7.desc')
        },
        {
          number: "SDG 13", 
          title: t('sdg.13.title'),
          description: t('sdg.13.desc')
        },
        {
          number: "SDG 9",
          title: t('sdg.9.title'), 
          description: t('sdg.9.desc')
        }
      ]
    },
    videoDescription: t('video.renewable.energy.desc'),
    videoSrc: "/videos/Renewable Energy.mp4",
  },
});

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { updateLessonProgress, getLessonProgress } = useProgress();
  const { updateProgress, newAchievements, dismissNotification } = useAchievements();
  const [progress, setProgress] = useState(0);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  const lessonsData = getLessonsData(t);
  const lesson = id
    ? lessonsData[parseInt(id) as keyof typeof lessonsData]
    : null;

  useEffect(() => {
    if (id) {
      const progressData = getLessonProgress(parseInt(id));
      setLessonProgress(progressData);
      setProgress(progressData.videoProgress);
    }
  }, [id, getLessonProgress]);

  const handleVideoProgress = (videoProgress: number) => {
    setProgress(videoProgress);
    if (id) {
      updateLessonProgress(parseInt(id), { videoProgress });
    }
  };

  const handleVideoComplete = () => {
    if (id) {
      updateLessonProgress(parseInt(id), { videoProgress: 100 });
      // Update achievement progress
      updateProgress('video_watched', 1);
      updateProgress('lessons_completed', 1);
    }
  };

  const handleStartQuiz = () => navigate(`/quiz/${id}`);

  const handleGameComplete = () => {
    console.log("Game completed! Quiz unlocked!");
    if (id) {
      updateLessonProgress(parseInt(id), { gameCompleted: true });
      // Update achievement progress
      updateProgress('games_won', 1);
    }
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

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          {/* Main Content */}
          <div className="w-full max-w-6xl">
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
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                <Card className="shadow-card mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Play className="w-5 h-5 text-primary" />
                      <span>{t('lesson.video.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Video Player */}
                    <VideoPlayer
                      src={lesson.videoSrc}
                      title={lesson.title}
                      description={lesson.videoDescription}
                      onProgress={handleVideoProgress}
                      onComplete={handleVideoComplete}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
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

            {/* SDG Content Section */}
            {lesson.sdgContent && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-green-700">
                    {lesson.sdgContent.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('sdg.aligns.with')}
                    </p>
                    <div className="grid gap-4 md:grid-cols-1">
                      {lesson.sdgContent.goals.map((goal, index) => (
                        <div
                          key={index}
                          className="border border-green-200 rounded-lg p-4 bg-green-50/50 hover:bg-green-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[60px] text-center">
                              {goal.number}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-green-800 mb-1">
                                {goal.title}
                              </h4>
                              <p className="text-sm text-green-700">
                                {goal.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Progress and Quiz Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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
                {id === "1" && (
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
                {id === "2" && (
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
                {(id === "3" || id === "4" || id === "5" || id === "6") && (
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
          </div>
        </div>
      </main>

      {/* Achievement Notifications */}
      {newAchievements.map((achievement) => (
        <AchievementNotification
          key={achievement.id}
          achievement={achievement}
          onClose={() => dismissNotification(achievement.id)}
        />
      ))}
    </div>
  );
}
