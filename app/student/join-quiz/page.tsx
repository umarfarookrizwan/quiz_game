"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Clock, FileText, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useQuiz } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"

export default function JoinQuiz() {
  const [quizCode, setQuizCode] = useState("")
  const [quizFound, setQuizFound] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<any>(null)
  const router = useRouter()
  const { getQuizByCode } = useQuiz()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Find quiz by code
    const quiz = getQuizByCode(quizCode)

    if (quiz) {
      setCurrentQuiz(quiz)
      setQuizFound(true)
    } else {
      toast({
        title: "Quiz not found",
        description: "Please check the access code and try again.",
        variant: "destructive",
      })
    }
  }

  const startQuiz = () => {
    // Store the current quiz ID in session storage for the quiz page to access
    if (currentQuiz) {
      sessionStorage.setItem("currentQuizId", currentQuiz.id)
      router.push("/student/take-quiz")
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Join a Quiz</h1>

      {!quizFound ? (
        <Card>
          <CardHeader>
            <CardTitle>Enter Quiz Code</CardTitle>
            <CardDescription>Enter the code provided by your teacher to access the quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quiz-code">Quiz Code</Label>
                <Input
                  id="quiz-code"
                  placeholder="Enter 6-digit code"
                  value={quizCode}
                  onChange={(e) => setQuizCode(e.target.value.toUpperCase())}
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              className="w-full bg-pink-600 hover:bg-pink-700"
              disabled={quizCode.length === 0}
            >
              Find Quiz
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Found: {currentQuiz.title}</CardTitle>
            <CardDescription>Created by Professor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-card/50 rounded-lg border border-border/50">
              <p className="text-sm text-muted-foreground mb-4">{currentQuiz.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time Limit</p>
                    <p className="text-sm text-muted-foreground">{currentQuiz.timeLimit} minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Questions</p>
                    <p className="text-sm text-muted-foreground">{currentQuiz.questions.length} questions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-500">Important Information</p>
                  <ul className="text-sm space-y-1 mt-2 list-disc list-inside text-muted-foreground">
                    <li>You must complete the quiz in one sitting</li>
                    <li>The timer will start as soon as you begin</li>
                    <li>Ensure you have a stable internet connection</li>
                    <li>Your results will be available immediately after submission</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button onClick={startQuiz} className="w-full bg-pink-600 hover:bg-pink-700">
              Start Quiz Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setQuizFound(false)} className="w-full">
              Enter Different Code
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
