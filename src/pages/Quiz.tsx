import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const quizData = {
  1: {
    title: "Waste Management Quiz",
    questions: [
      {
        question: "What are the 3 R's of waste management?",
        options: ["Reduce, Reuse, Recycle", "Read, Write, Remember", "Run, Rest, Repeat", "Rock, Roll, Rhythm"],
        correct: 0,
        explanation: "The 3 R's - Reduce, Reuse, and Recycle - are the fundamental principles of waste management that help minimize environmental impact."
      },
      {
        question: "Which material takes the longest to decompose in landfills?",
        options: ["Paper", "Glass", "Plastic bottles", "Food waste"],
        correct: 1,
        explanation: "Glass can take over 1 million years to decompose, making it crucial to recycle glass products properly."
      },
      {
        question: "What percentage of household waste can typically be composted?",
        options: ["10%", "20%", "30%", "50%"],
        correct: 2,
        explanation: "About 30% of household waste consists of organic materials that can be composted, significantly reducing landfill waste."
      }
    ]
  },
  2: {
    title: "Water Treatment Quiz",
    questions: [
      {
        question: "What is the first step in water treatment?",
        options: ["Disinfection", "Screening", "Filtration", "Sedimentation"],
        correct: 1,
        explanation: "Screening is the first step, where large debris and particles are removed from the water before further treatment."
      },
      {
        question: "Which chemical is commonly used to disinfect water?",
        options: ["Salt", "Chlorine", "Sugar", "Baking soda"],
        correct: 1,
        explanation: "Chlorine is widely used to disinfect water by killing harmful bacteria and viruses, making it safe for consumption."
      },
      {
        question: "How much of Earth's water is fresh and accessible?",
        options: ["10%", "5%", "3%", "Less than 1%"],
        correct: 3,
        explanation: "Less than 1% of Earth's water is fresh and accessible, making water conservation and treatment extremely important."
      }
    ]
  },
  3: {
    title: "Pollution-Free Zones Quiz",
    questions: [
      {
        question: "What is a major source of air pollution in cities?",
        options: ["Trees", "Vehicle emissions", "Rainfall", "Wind"],
        correct: 1,
        explanation: "Vehicle emissions are one of the largest sources of air pollution in urban areas, contributing to smog and health problems."
      },
      {
        question: "Which transportation method produces the least pollution?",
        options: ["Diesel bus", "Electric car", "Gasoline car", "Motorcycle"],
        correct: 1,
        explanation: "Electric vehicles produce zero direct emissions and are much cleaner than fossil fuel-powered vehicles."
      },
      {
        question: "What role do plants play in pollution-free zones?",
        options: ["They increase pollution", "They absorb CO₂ and produce oxygen", "They have no effect", "They block sunlight"],
        correct: 1,
        explanation: "Plants naturally filter air by absorbing carbon dioxide and producing oxygen, making them essential for clean environments."
      }
    ]
  },
  4: {
    title: "Afforestation Quiz",
    questions: [
      {
        question: "What is afforestation?",
        options: ["Cutting down forests", "Planting trees in new areas", "Moving forests", "Painting trees"],
        correct: 1,
        explanation: "Afforestation is the process of creating forests by planting trees in areas that were not previously forested."
      },
      {
        question: "How do trees help fight climate change?",
        options: ["They reflect heat", "They absorb carbon dioxide", "They create wind", "They block rain"],
        correct: 1,
        explanation: "Trees absorb CO₂ from the atmosphere during photosynthesis, helping to reduce greenhouse gas concentrations."
      },
      {
        question: "What's the best time to plant most trees?",
        options: ["Summer", "Winter", "Spring or Fall", "Any time"],
        correct: 2,
        explanation: "Spring and fall provide optimal conditions for tree planting, with moderate temperatures and adequate rainfall."
      }
    ]
  },
  5: {
    title: "Deforestation Quiz",
    questions: [
      {
        question: "What is the main cause of deforestation globally?",
        options: ["Natural disasters", "Agriculture expansion", "Urban development", "Disease"],
        correct: 1,
        explanation: "Agriculture expansion, particularly for livestock and crop production, is responsible for about 80% of global deforestation."
      },
      {
        question: "How does deforestation affect the water cycle?",
        options: ["No effect", "Reduces rainfall", "Increases rainfall", "Changes water color"],
        correct: 1,
        explanation: "Trees release water vapor through transpiration. Deforestation reduces this process, leading to decreased rainfall in the region."
      },
      {
        question: "Which ecosystem service is lost when forests are cleared?",
        options: ["Carbon storage", "Biodiversity habitat", "Soil protection", "All of the above"],
        correct: 3,
        explanation: "Forests provide all these services - they store carbon, provide habitat for wildlife, and protect soil from erosion."
      }
    ]
  },
  6: {
    title: "Renewable Energy Quiz",
    questions: [
      {
        question: "Which is NOT a renewable energy source?",
        options: ["Solar power", "Wind power", "Coal", "Hydroelectric"],
        correct: 2,
        explanation: "Coal is a fossil fuel that takes millions of years to form and produces harmful emissions when burned."
      },
      {
        question: "What makes solar panels work?",
        options: ["Heat from the sun", "Light from the sun", "Wind", "Rain"],
        correct: 1,
        explanation: "Solar panels convert light (photons) from the sun into electricity through the photovoltaic effect."
      },
      {
        question: "Which renewable energy source works best at night?",
        options: ["Solar", "Wind", "Hydroelectric", "Both B and C"],
        correct: 3,
        explanation: "Both wind and hydroelectric power can generate electricity 24/7, unlike solar power which only works during daylight."
      }
    ]
  }
};

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
          <h1 className="text-2xl font-bold text-destructive">Quiz not found</h1>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
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
      title: isCorrect ? "Correct! 🎉" : "Oops! 😅",
      description: isCorrect ? "Great job!" : "Don't worry, keep learning!",
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
    if (percentage >= 80) return { message: "Outstanding! You're an eco-expert! 🏆", color: "text-success" };
    if (percentage >= 60) return { message: "Great job! You're learning well! 🌟", color: "text-primary" };
    return { message: "Keep studying! You're on your way! 💪", color: "text-secondary" };
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
                <span>Quiz Complete!</span>
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
                <h3 className="font-semibold mb-3">Your Answers:</h3>
                <div className="space-y-2">
                  {quiz.questions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correct;
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">Question {index + 1}</span>
                        <div className="flex items-center space-x-2">
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <XCircle className="w-5 h-5 text-destructive" />
                          )}
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {isCorrect ? "Correct" : "Incorrect"}
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
                  <span>Retake Quiz</span>
                </Button>
                <Button
                  onClick={() => navigate("/scoreboard")}
                  className="bg-gradient-nature hover:opacity-90"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  View Achievements
                </Button>
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="secondary"
                >
                  Back to Dashboard
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
              {currentQuestion + 1} of {quiz.questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% Complete
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
                <h4 className="font-semibold text-foreground mb-2">Explanation:</h4>
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
                Back to Lesson
              </Button>
              
              {!showExplanation ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-nature hover:opacity-90"
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-nature hover:opacity-90"
                >
                  {currentQuestion < quiz.questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      View Results
                      <Trophy className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}