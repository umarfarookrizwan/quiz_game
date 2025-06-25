"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Flag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuiz, type Quiz, type QuizQuestion } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"
import { AntiCheatWrapper } from "@/components/anti-cheat-wrapper"

export default function TakeQuiz() {
  const router = useRouter()
  const { getQuizById, submitQuizResult, currentUser, getShuffledQuestions } = useQuiz()
  const { toast } = useToast()

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])
  const [questionOrder, setQuestionOrder] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(new Date())
  const [exitAttempts, setExitAttempts] = useState(0)

  useEffect(() => {
    // Get the quiz ID from session storage
    const quizId = sessionStorage.getItem("currentQuizId")

    if (!quizId) {
      toast({
        title: "Quiz not found",
        description: "Please join a quiz first.",
        variant: "destructive",
      })
      router.push("/student/join-quiz")
      return
    }

    const foundQuiz = getQuizById(quizId)

    if (!foundQuiz) {
      toast({
        title: "Quiz not found",
        description: "The quiz you're trying to take doesn't exist.",
        variant: "destructive",
      })
      router.push("/student/join-quiz")
      return
    }

    setQuiz(foundQuiz)

    // Get shuffled questions if enabled
    const { questions, order } = getShuffledQuestions(quizId)
    setShuffledQuestions(questions)
    setQuestionOrder(order)

    setTimeLeft(foundQuiz.timeLimit * 60)
    setSelectedAnswers(Array(foundQuiz.questions.length).fill(-1))
    setFlaggedQuestions(Array(foundQuiz.questions.length).fill(false))
  }, [getQuizById, getShuffledQuestions, router, toast])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Timer effect
  useEffect(() => {
    if (!quiz) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz])

  const handleAnswerSelect = (value: string) => {
    if (!quiz) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setSelectedAnswers(newAnswers)
  }

  const handleFlagQuestion = () => {
    if (!quiz) return

    const newFlags = [...flaggedQuestions]
    newFlags[currentQuestion] = !newFlags[currentQuestion]
    setFlaggedQuestions(newFlags)
  }

  const handleNextQuestion = () => {
    if (!quiz) return

    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    if (!quiz) return 0

    let correctCount = 0

    // For each question in the shuffled order
    selectedAnswers.forEach((selectedAnswer, shuffledIndex) => {
      // Get the original question index from the order array
      const originalIndex = questionOrder[shuffledIndex]

      // Get the correct answer for the original question
      const correctAnswer = quiz.questions[originalIndex].correctAnswer

      // Compare with the selected answer
      if (selectedAnswer === correctAnswer) {
        correctCount++
      }
    })

    return Math.round((correctCount / quiz.questions.length) * 100)
  }

  const handleSubmitQuiz = () => {
    if (!quiz || !currentUser) return

    setIsSubmitting(true)

    const endTime = new Date()
    const timeTaken = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    const minutes = Math.floor(timeTaken / 60)
    const seconds = timeTaken % 60
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

    const score = calculateScore()

    // Submit the result with both the shuffled answers and the question order
    submitQuizResult(quiz.id, {
      studentId: currentUser.id,
      studentName: currentUser.name,
      score,
      timeTaken: formattedTime,
      submittedAt: new Date().toISOString(),
      answers: selectedAnswers,
      questionOrder: questionOrder,
    })

    // Store additional data for the result page
    sessionStorage.setItem("lastQuizId", quiz.id)
    sessionStorage.setItem("lastQuizScore", score.toString())
    sessionStorage.setItem("lastQuizAnswers", JSON.stringify(selectedAnswers))
    sessionStorage.setItem("lastQuizQuestionOrder", JSON.stringify(questionOrder))

    // Navigate to the result page
    setTimeout(() => {
      router.push("/student/quiz-result")
    }, 1500)
  }

  const handleExitAttempt = () => {
    setExitAttempts((prev) => prev + 1)

    toast({
      title: "Warning!",
      description: `Attempting to exit the quiz is not allowed. Warning ${exitAttempts + 1} of 3.`,
      variant: "destructive",
    })

    if (exitAttempts >= 2) {
      toast({
        title: "Quiz submission forced",
        description: "Due to multiple exit attempts, your quiz will be submitted automatically.",
        variant: "destructive",
      })

      setTimeout(() => {
        handleSubmitQuiz()
      }, 2000)
    }
  }

  if (!quiz || shuffledQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Loading Quiz...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
            <p>Please wait while we load your quiz...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Submitting Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
            <p>Please wait while we process your answers...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = shuffledQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100
  const allQuestionsAnswered = selectedAnswers.every((answer) => answer !== -1)

  // Time warning when less than 5 minutes left
  const timeWarning = timeLeft < 300

  return (
    <AntiCheatWrapper onAttemptedExit={handleExitAttempt} maxWarnings={3} onMaxWarningsReached={handleSubmitQuiz}>
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              timeWarning ? "bg-red-500/20 text-red-400" : "bg-card text-muted-foreground"
            }`}
          >
            <Clock className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>
              Question {currentQuestion + 1} of {shuffledQuestions.length}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl">{question.text}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFlagQuestion}
                className={flaggedQuestions[currentQuestion] ? "text-amber-500" : "text-muted-foreground"}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-pink-500 bg-pink-500/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleAnswerSelect(index.toString())}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestion === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestion < shuffledQuestions.length - 1 ? (
              <Button onClick={handleNextQuestion} className="bg-pink-600 hover:bg-pink-700">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700"
                disabled={!allQuestionsAnswered}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Quiz
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="grid grid-cols-5 gap-2">
          {shuffledQuestions.map((_, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className={`h-10 ${
                index === currentQuestion
                  ? "border-pink-500 bg-pink-500/10"
                  : selectedAnswers[index] !== -1
                    ? "bg-muted"
                    : ""
              } ${flaggedQuestions[index] ? "border-amber-500" : ""}`}
              onClick={() => setCurrentQuestion(index)}
            >
              {index + 1}
              {flaggedQuestions[index] && <Flag className="ml-1 h-3 w-3 text-amber-500" />}
            </Button>
          ))}
        </div>

        {!allQuestionsAnswered && (
          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-500">Some questions are unanswered</p>
              <p className="text-sm text-muted-foreground">
                Make sure to answer all questions before submitting the quiz.
              </p>
            </div>
          </div>
        )}
      </div>
    </AntiCheatWrapper>
  )
}
