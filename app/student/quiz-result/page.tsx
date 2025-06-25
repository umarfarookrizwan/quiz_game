"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ChevronDown, ChevronUp, Clock, Download, Home, XCircle } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useQuiz, type Quiz } from "@/context/quiz-context"
import { useRouter } from "next/navigation"

export default function QuizResult() {
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [result, setResult] = useState<any | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [questionOrder, setQuestionOrder] = useState<number[]>([])
  const [correctCount, setCorrectCount] = useState(0)
  const { getQuizById, currentUser } = useQuiz()
  const router = useRouter()

  useEffect(() => {
    // Get the quiz ID from session storage
    const quizId = sessionStorage.getItem("lastQuizId")
    const storedAnswers = sessionStorage.getItem("lastQuizAnswers")
    const storedQuestionOrder = sessionStorage.getItem("lastQuizQuestionOrder")

    if (!quizId || !currentUser) {
      router.push("/student/dashboard")
      return
    }

    const foundQuiz = getQuizById(quizId)

    if (!foundQuiz) {
      router.push("/student/dashboard")
      return
    }

    setQuiz(foundQuiz)

    // Find the student's result
    const studentResult = foundQuiz.students.find((s) => s.studentId === currentUser.id)

    if (studentResult) {
      setResult(studentResult)

      // Use stored answers and question order if available
      if (storedAnswers) {
        try {
          setUserAnswers(JSON.parse(storedAnswers))
        } catch (e) {
          console.error("Error parsing stored answers:", e)
        }
      } else if (studentResult.answers) {
        setUserAnswers(studentResult.answers)
      }

      if (storedQuestionOrder) {
        try {
          setQuestionOrder(JSON.parse(storedQuestionOrder))
        } catch (e) {
          console.error("Error parsing stored question order:", e)
        }
      } else if (studentResult.questionOrder) {
        setQuestionOrder(studentResult.questionOrder)
      }
    } else {
      router.push("/student/dashboard")
    }
  }, [getQuizById, currentUser, router])

  // Calculate correct answers count
  useEffect(() => {
    if (!quiz || userAnswers.length === 0 || questionOrder.length === 0) return

    let count = 0
    userAnswers.forEach((answer, shuffledIndex) => {
      if (wasAnswerCorrect(shuffledIndex)) {
        count++
      }
    })

    setCorrectCount(count)
  }, [quiz, userAnswers, questionOrder])

  // Helper function to determine if an answer was correct
  const wasAnswerCorrect = (shuffledIndex: number) => {
    if (!quiz || !userAnswers || questionOrder.length === 0) return false

    // Get the original question index
    const originalIndex = questionOrder[shuffledIndex]

    // Get the selected answer for this question
    const selectedAnswer = userAnswers[shuffledIndex]

    // Get the correct answer for the original question
    const correctAnswer = quiz.questions[originalIndex].correctAnswer

    // Compare the selected answer with the correct answer
    return selectedAnswer === correctAnswer
  }

  // Get the question and options in the order they were presented to the user
  const getShuffledQuestion = (shuffledIndex: number) => {
    if (!quiz || questionOrder.length === 0) return null

    // Get the original question index
    const originalIndex = questionOrder[shuffledIndex]

    // Return the original question
    return quiz.questions[originalIndex]
  }

  if (!quiz || !result || userAnswers.length === 0 || questionOrder.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Loading Results...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
            <p>Please wait while we load your quiz results...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate the percentage score
  const scorePercentage = Math.round((correctCount / quiz.questions.length) * 100)
  const incorrectCount = quiz.questions.length - correctCount

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Link href="/student/dashboard">
            <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quiz Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-pink-400 stroke-current"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - scorePercentage / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold">{scorePercentage}%</span>
                  <span className="text-xs text-muted-foreground">Your Score</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {correctCount} out of {quiz.questions.length} correct
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Quiz Title</p>
                <p className="font-medium">{quiz.title}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Time Taken</p>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <p className="font-medium">{result.timeTaken}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Completion Date</p>
                <p className="font-medium">{new Date(result.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm">Accuracy</p>
                  <p className="font-medium">{scorePercentage}%</p>
                </div>
                <Progress value={scorePercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-xl font-bold">{correctCount}</span>
                  <span className="text-xs text-muted-foreground">Correct</span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 bg-red-500/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-xl font-bold">{incorrectCount}</span>
                  <span className="text-xs text-muted-foreground">Incorrect</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
          <CardDescription>Review your answers and see the correct solutions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userAnswers.slice(0, showAllQuestions ? userAnswers.length : 2).map((selectedAnswer, shuffledIndex) => {
            const question = getShuffledQuestion(shuffledIndex)
            if (!question) return null

            const isCorrect = wasAnswerCorrect(shuffledIndex)
            const originalIndex = questionOrder[shuffledIndex]

            return (
              <Collapsible key={shuffledIndex} className="border rounded-lg">
                <div
                  className={`p-4 flex items-center justify-between ${
                    isCorrect
                      ? "bg-green-500/5 border-b border-green-500/10"
                      : "bg-red-500/5 border-b border-red-500/10"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">Question {shuffledIndex + 1}</span>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <div className="p-4 space-y-4">
                    <p>{question.text}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg ${
                            optIndex === question.correctAnswer
                              ? "bg-green-500/10 border border-green-500/20"
                              : optIndex === selectedAnswer && !isCorrect
                                ? "bg-red-500/10 border border-red-500/20"
                                : "bg-card"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {optIndex === question.correctAnswer && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {optIndex === selectedAnswer && !isCorrect && <XCircle className="h-4 w-4 text-red-500" />}
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!isCorrect && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium">Explanation</p>
                        <p className="text-sm text-muted-foreground">
                          The correct answer is: {question.options[question.correctAnswer]}
                        </p>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )
          })}

          {!showAllQuestions && userAnswers.length > 2 && (
            <Button variant="outline" className="w-full" onClick={() => setShowAllQuestions(true)}>
              Show All Questions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          )}

          {showAllQuestions && (
            <Button variant="outline" className="w-full" onClick={() => setShowAllQuestions(false)}>
              Show Less
              <ChevronUp className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full flex justify-between">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Results
            </Button>
            <Link href="/student/dashboard">
              <Button className="bg-pink-600 hover:bg-pink-700">Back to Dashboard</Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
