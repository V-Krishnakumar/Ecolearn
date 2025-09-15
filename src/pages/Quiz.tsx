import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProgress } from "@/lib/localProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { AchievementNotification } from "@/components/AchievementNotification";

const getQuizData = (t: (key: string) => string) => ({
  1: {
    title: t('quiz.waste.management.title'),
    questions: [
      {
        question: t('quiz.waste.q1.question'),
        options: [
          t('quiz.waste.q1.option1'),
          t('quiz.waste.q1.option2'),
          t('quiz.waste.q1.option3'),
          t('quiz.waste.q1.option4')
        ],
        correct: 0,
        explanation: t('quiz.waste.q1.explanation')
      },
      {
        question: t('quiz.waste.q2.question'),
        options: [
          t('quiz.waste.q2.option1'),
          t('quiz.waste.q2.option2'),
          t('quiz.waste.q2.option3'),
          t('quiz.waste.q2.option4')
        ],
        correct: 1,
        explanation: t('quiz.waste.q2.explanation')
      },
      {
        question: t('quiz.waste.q3.question'),
        options: [
          t('quiz.waste.q3.option1'),
          t('quiz.waste.q3.option2'),
          t('quiz.waste.q3.option3'),
          t('quiz.waste.q3.option4')
        ],
        correct: 2,
        explanation: t('quiz.waste.q3.explanation')
      }
    ]
  },
  2: {
    title: t('quiz.water.treatment.title'),
    questions: [
      {
        question: t('quiz.water.q1.question'),
        options: [
          t('quiz.water.q1.option1'),
          t('quiz.water.q1.option2'),
          t('quiz.water.q1.option3'),
          t('quiz.water.q1.option4')
        ],
        correct: 1,
        explanation: t('quiz.water.q1.explanation')
      },
      {
        question: t('quiz.water.q2.question'),
        options: [
          t('quiz.water.q2.option1'),
          t('quiz.water.q2.option2'),
          t('quiz.water.q2.option3'),
          t('quiz.water.q2.option4')
        ],
        correct: 1,
        explanation: t('quiz.water.q2.explanation')
      },
      {
        question: t('quiz.water.q3.question'),
        options: [
          t('quiz.water.q3.option1'),
          t('quiz.water.q3.option2'),
          t('quiz.water.q3.option3'),
          t('quiz.water.q3.option4')
        ],
        correct: 3,
        explanation: t('quiz.water.q3.explanation')
      }
    ]
  },
  3: {
    title: t('quiz.pollution.free.title'),
    questions: [
      {
        question: t('quiz.pollution.q1.question'),
        options: [
          t('quiz.pollution.q1.option1'),
          t('quiz.pollution.q1.option2'),
          t('quiz.pollution.q1.option3'),
          t('quiz.pollution.q1.option4')
        ],
        correct: 1,
        explanation: t('quiz.pollution.q1.explanation')
      },
      {
        question: t('quiz.pollution.q2.question'),
        options: [
          t('quiz.pollution.q2.option1'),
          t('quiz.pollution.q2.option2'),
          t('quiz.pollution.q2.option3'),
          t('quiz.pollution.q2.option4')
        ],
        correct: 1,
        explanation: t('quiz.pollution.q2.explanation')
      },
      {
        question: t('quiz.pollution.q3.question'),
        options: [
          t('quiz.pollution.q3.option1'),
          t('quiz.pollution.q3.option2'),
          t('quiz.pollution.q3.option3'),
          t('quiz.pollution.q3.option4')
        ],
        correct: 1,
        explanation: t('quiz.pollution.q3.explanation')
      }
    ]
  },
  4: {
    title: t('quiz.afforestation.title'),
    questions: [
      {
        question: t('quiz.afforestation.q1.question'),
        options: [
          t('quiz.afforestation.q1.option1'),
          t('quiz.afforestation.q1.option2'),
          t('quiz.afforestation.q1.option3'),
          t('quiz.afforestation.q1.option4')
        ],
        correct: 1,
        explanation: t('quiz.afforestation.q1.explanation')
      },
      {
        question: t('quiz.afforestation.q2.question'),
        options: [
          t('quiz.afforestation.q2.option1'),
          t('quiz.afforestation.q2.option2'),
          t('quiz.afforestation.q2.option3'),
          t('quiz.afforestation.q2.option4')
        ],
        correct: 1,
        explanation: t('quiz.afforestation.q2.explanation')
      },
      {
        question: t('quiz.afforestation.q3.question'),
        options: [
          t('quiz.afforestation.q3.option1'),
          t('quiz.afforestation.q3.option2'),
          t('quiz.afforestation.q3.option3'),
          t('quiz.afforestation.q3.option4')
        ],
        correct: 2,
        explanation: t('quiz.afforestation.q3.explanation')
      }
    ]
  },
  5: {
    title: t('quiz.deforestation.title'),
    questions: [
      {
        question: t('quiz.deforestation.q1.question'),
        options: [
          t('quiz.deforestation.q1.option1'),
          t('quiz.deforestation.q1.option2'),
          t('quiz.deforestation.q1.option3'),
          t('quiz.deforestation.q1.option4')
        ],
        correct: 1,
        explanation: t('quiz.deforestation.q1.explanation')
      },
      {
        question: t('quiz.deforestation.q2.question'),
        options: [
          t('quiz.deforestation.q2.option1'),
          t('quiz.deforestation.q2.option2'),
          t('quiz.deforestation.q2.option3'),
          t('quiz.deforestation.q2.option4')
        ],
        correct: 1,
        explanation: t('quiz.deforestation.q2.explanation')
      },
      {
        question: t('quiz.deforestation.q3.question'),
        options: [
          t('quiz.deforestation.q3.option1'),
          t('quiz.deforestation.q3.option2'),
          t('quiz.deforestation.q3.option3'),
          t('quiz.deforestation.q3.option4')
        ],
        correct: 3,
        explanation: t('quiz.deforestation.q3.explanation')
      }
    ]
  },
  6: {
    title: t('quiz.renewable.energy.title'),
    questions: [
      {
        question: t('quiz.renewable.q1.question'),
        options: [
          t('quiz.renewable.q1.option1'),
          t('quiz.renewable.q1.option2'),
          t('quiz.renewable.q1.option3'),
          t('quiz.renewable.q1.option4')
        ],
        correct: 2,
        explanation: t('quiz.renewable.q1.explanation')
      },
      {
        question: t('quiz.renewable.q2.question'),
        options: [
          t('quiz.renewable.q2.option1'),
          t('quiz.renewable.q2.option2'),
          t('quiz.renewable.q2.option3'),
          t('quiz.renewable.q2.option4')
        ],
        correct: 1,
        explanation: t('quiz.renewable.q2.explanation')
      },
      {
        question: t('quiz.renewable.q3.question'),
        options: [
          t('quiz.renewable.q3.option1'),
          t('quiz.renewable.q3.option2'),
          t('quiz.renewable.q3.option3'),
          t('quiz.renewable.q3.option4')
        ],
        correct: 3,
        explanation: t('quiz.renewable.q3.explanation')
      }
    ]
  }
});

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { updateLessonProgress } = useProgress();
  const { updateProgress, newAchievements, dismissNotification } = useAchievements();
  
  const quizData = getQuizData(t);
  const quiz = id ? quizData[parseInt(id) as keyof typeof quizData] : null;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-destructive">{t('quiz.not.found')}</h1>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            {t('quiz.back.to.dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === quiz.questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    setShowExplanation(true);

    // Show result feedback
    toast({
      title: isCorrect ? t('quiz.correct.answer') : t('quiz.oops'),
      description: isCorrect ? t('quiz.great.job') : t('quiz.keep.learning'),
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz completed
      setShowResult(true);
      // Save quiz completion to progress
      if (id) {
        const percentage = (score / quiz.questions.length) * 100;
        updateLessonProgress(parseInt(id), { 
          quizCompleted: true, 
          quizScore: Math.round(percentage) 
        });
        
        // Update achievement progress
        updateProgress('lessons_completed', 1);
        if (percentage === 100) {
          updateProgress('quiz_perfect', 1);
        }
      }
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / quiz.questions.length) * 100;
    if (percentage >= 80) return { message: t('quiz.outstanding'), color: "text-success" };
    if (percentage >= 60) return { message: t('quiz.great.job.learning'), color: "text-primary" };
    return { message: t('quiz.keep.studying'), color: "text-secondary" };
  };

  if (showResult) {
    const scoreMessage = getScoreMessage();
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="shadow-card text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold flex items-center justify-center space-x-2">
                <Trophy className="w-8 h-8 text-accent" />
                <span>{t('quiz.complete')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-6xl font-bold text-primary">
                {score}/{quiz.questions.length}
              </div>
              
              <div className="space-y-2">
                <p className="text-xl font-semibold">
                  {Math.round((score / quiz.questions.length) * 100)}% Correct
                </p>
                <p className={`text-lg ${scoreMessage.color}`}>
                  {scoreMessage.message}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-3">{t('quiz.your.answers')}</h3>
                <div className="space-y-2">
                  {quiz.questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correct;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{t('quiz.question')} {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? t('quiz.correct') : t('quiz.incorrect')}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleRestartQuiz}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('quiz.retake.quiz')}</span>
                </Button>
                <Button
                  onClick={() => navigate("/scoreboard")}
                  className="bg-gradient-nature hover:opacity-90"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  {t('quiz.view.achievements')}
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="secondary"
                >
                  {t('quiz.back.to.dashboard')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + (showExplanation ? 1 : 0)) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">{quiz.title}</Badge>
            <span className="text-sm text-muted-foreground">
              {currentQuestion + 1} {t('quiz.of')} {quiz.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% {t('quiz.complete')}
          </p>
        </div>

        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correct;
                const showAnswerState = showExplanation;
                
                return (
                  <Button
                    key={index}
                    variant={
                      showAnswerState
                        ? isCorrect
                          ? "default"
                          : isSelected
                          ? "destructive"
                          : "outline"
                        : isSelected
                        ? "default"
                        : "outline"
                    }
                    className={`w-full text-left p-4 h-auto justify-start relative ${
                      showAnswerState && isCorrect
                        ? "bg-success hover:bg-success border-success"
                        : ""
                    }`}
                    onClick={() => !showExplanation && handleAnswerSelect(index)}
                    disabled={showExplanation}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm leading-relaxed">{option}</span>
                      {showAnswerState && (
                        <div className="ml-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-success-foreground" />
                          ) : isSelected ? (
                            <XCircle className="w-5 h-5 text-destructive-foreground" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="bg-muted rounded-lg p-4 animate-slide-up">
                <h4 className="font-semibold text-foreground mb-2">{t('quiz.explanation')}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/lesson/${id}`)}
              >
                {t('quiz.back.to.lesson')}
              </Button>
              
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-nature hover:opacity-90"
                >
                  {t('quiz.submit.answer')}
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-nature hover:opacity-90"
                >
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <>
                      {t('quiz.next.question')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      {t('quiz.view.results')}
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
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