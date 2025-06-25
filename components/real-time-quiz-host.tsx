"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Crown, Users } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useQuiz } from "@/context/quiz-context"
import type { RealTimeQuizSession, RealTimeParticipant } from "@/types/quiz-types"

interface RealTimeQuizHostProps {
  quizId: string
}

export function RealTimeQuizHost({ quizId }: RealTimeQuizHostProps) {
  const { getQuizById } = useQuiz()
  const { toast } = useToast()
  const [session, setSession] = useState<RealTimeQuizSession | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)

  // Initialize quiz session
  useEffect(() => {
    const foundQuiz = getQuizById(quizId)
    if (!foundQuiz) return

    setQuiz(foundQuiz)

    // Create a new session
    const newSession: RealTimeQuizSession = {
      id: `session-${Date.now()}`,
      quizId,
      hostId: "teacher-1", // In a real app, this would be the current user's ID
      status: "waiting",
      roomCode: generateRoomCode(),
      participants: [],
      currentQuestionIndex: 0,
    }

    setSession(newSession)

    // In a real app, you would connect to a WebSocket or real-time database here
    // For demo purposes, we'll simulate participants joining
    simulateParticipantsJoining(newSession)
  }, [quizId, getQuizById])

  // Simulate participants joining
  const simulateParticipantsJoining = (newSession: RealTimeQuizSession) => {
    const mockParticipants: RealTimeParticipant[] = [
      { id: "p1", name: "Alex", score: 0, answers: [] },
      { id: "p2", name: "Jamie", score: 0, answers: [] },
      { id: "p3", name: "Taylor", score: 0, answers: [] },
      { id: "p4", name: "Jordan", score: 0, answers: [] },
      { id: "p5", name: "Casey", score: 0, answers: [] },
    ]

    // Add participants one by one with delays
    let count = 0
    const interval = setInterval(() => {
      if (count < mockParticipants.length) {
        setSession((prev) => {
          if (!prev) return prev
          const updatedParticipants = [...prev.participants, mockParticipants[count]]
          return { ...prev, participants: updatedParticipants }
        })
        count++
      } else {
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }

  // Start the quiz
  const startQuiz = () => {
    if (!session) return

    setSession({ ...session, status: "active", startTime: new Date().toISOString() })
    setCurrentQuestion(0)
    setTimeLeft(15)
    setShowLeaderboard(false)

    toast({
      title: "Quiz started!",
      description: "The first question has been sent to all participants.",
    })
  }

  // Timer effect for questions
  useEffect(() => {
    if (!session || session.status !== "active" || showLeaderboard) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleQuestionEnd()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [session, currentQuestion, showLeaderboard])

  // Handle question end
  const handleQuestionEnd = () => {
    setShowLeaderboard(true)

    // Simulate participant answers
    if (session) {
      const updatedParticipants = session.participants.map((participant) => {
        // Randomly determine if the answer is correct (70% chance)
        const isCorrect = Math.random() < 0.7

        // Random time to answer between 1-15 seconds
        const timeToAnswer = Math.floor(Math.random() * 15000) + 1000

        // Add this answer to the participant's answers
        const updatedAnswers = [
          ...participant.answers,
          {
            questionIndex: currentQuestion,
            answer: isCorrect ? 0 : 1, // Simplified for demo
            timeToAnswer,
            isCorrect,
          },
        ]

        // Calculate new score
        // Correct answers get 1000 points, with bonus for speed
        const scoreForThisQuestion = isCorrect ? Math.round(1000 * (1 - timeToAnswer / 15000 / 2)) : 0

        return {
          ...participant,
          answers: updatedAnswers,
          score: participant.score + scoreForThisQuestion,
        }
      })

      // Sort participants by score
      const sortedParticipants = [...updatedParticipants].sort((a, b) => b.score - a.score)

      setSession({
        ...session,
        participants: sortedParticipants,
        currentQuestionIndex: currentQuestion,
      })
    }
  }

  // Move to next question
  const nextQuestion = () => {
    if (!quiz || !session) return

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeLeft(15)
      setShowLeaderboard(false)
    } else {
      // End of quiz
      setSession({
        ...session,
        status: "completed",
        endTime: new Date().toISOString(),
      })

      toast({
        title: "Quiz completed!",
        description: "All questions have been answered.",
      })
    }
  }

  // Generate a random room code
  const generateRoomCode = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
  }

  if (!session || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Real-Time Quiz: {quiz.title}</CardTitle>
            <CardDescription>
              {session.status === "waiting"
                ? "Waiting for participants to join"
                : session.status === "active"
                  ? "Quiz in progress"
                  : "Quiz completed"}
            </CardDescription>
          </div>
          <Badge className="text-lg px-4 py-2">Room Code: {session.roomCode}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {session.status === "waiting" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-medium">Participants: {session.participants.length}</span>
              </div>
              <Button
                onClick={startQuiz}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={session.participants.length === 0}
              >
                Start Quiz
              </Button>
            </div>

            <div className="border rounded-lg p-4 max-h-[300px] overflow-y-auto">
              <h3 className="font-medium mb-2">Participants</h3>
              {session.participants.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Waiting for participants to join...</p>
              ) : (
                <ul className="space-y-2">
                  {session.participants.map((participant) => (
                    <li key={participant.id} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        {participant.name.charAt(0)}
                      </div>
                      <span>{participant.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {session.status === "active" && !showLeaderboard && quiz.questions[currentQuestion] && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono">{timeLeft}s</span>
              </div>
            </div>

            <Progress value={(timeLeft / 15) * 100} className="h-2" />

            <div className="p-6 border rounded-lg bg-card/50">
              <h3 className="text-xl font-medium mb-4">{quiz.questions[currentQuestion].text}</h3>

              <div className="grid grid-cols-2 gap-3">
                {quiz.questions[currentQuestion].options.map((option: string, index: number) => (
                  <div key={index} className="p-3 border rounded-md bg-muted/50">
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Participants answering: {Math.floor(Math.random() * session.participants.length)}
              </span>
              <Button variant="outline" onClick={handleQuestionEnd}>
                Skip Timer
              </Button>
            </div>
          </div>
        )}

        {session.status === "active" && showLeaderboard && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-center">Leaderboard</h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {session.participants.slice(0, 5).map((participant, index) => (
                <div
                  key={participant.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index === 0 ? "bg-yellow-500/20 border border-yellow-500/30" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                      {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                      {index !== 0 && <span>{index + 1}</span>}
                    </div>
                    <span className="font-medium">{participant.name}</span>
                  </div>
                  <span className="font-mono font-bold">{participant.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {session.status === "completed" && (
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-center">Final Results</h3>

            <div className="p-6 border rounded-lg bg-yellow-500/10 border-yellow-500/20">
              <div className="flex flex-col items-center mb-4">
                <Crown className="h-8 w-8 text-yellow-500 mb-2" />
                <h4 className="text-lg font-medium">{session.participants[0]?.name || "No winner"}</h4>
                <p className="text-sm text-muted-foreground">
                  Winner with {session.participants[0]?.score || 0} points
                </p>
              </div>

              <div className="space-y-3 mt-6">
                {session.participants.slice(0, 5).map((participant, index) => (
                  <div key={participant.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span>{index + 1}</span>
                      </div>
                      <span className="font-medium">{participant.name}</span>
                    </div>
                    <span className="font-mono font-bold">{participant.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {session.status === "active" && showLeaderboard && currentQuestion < quiz.questions.length - 1 && (
          <Button onClick={nextQuestion} className="w-full bg-purple-600 hover:bg-purple-700">
            Next Question
          </Button>
        )}

        {session.status === "active" && showLeaderboard && currentQuestion >= quiz.questions.length - 1 && (
          <Button
            onClick={() => setSession({ ...session, status: "completed", endTime: new Date().toISOString() })}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            End Quiz
          </Button>
        )}

        {session.status === "completed" && (
          <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
            Start New Session
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
