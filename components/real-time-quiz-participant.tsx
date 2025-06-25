"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Clock, Crown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RealTimeQuizParticipant() {
  const { toast } = useToast()
  const [name, setName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [joined, setJoined] = useState(false)
  const [waiting, setWaiting] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerSubmitted, setAnswerSubmitted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [score, setScore] = useState(0)
  const [rank, setRank] = useState(0)

  const handleJoin = () => {
    if (!name.trim() || !roomCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name and room code",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would connect to a WebSocket or real-time database here
    setJoined(true)

    toast({
      title: "Joined successfully!",
      description: `You've joined room ${roomCode}. Waiting for the host to start the quiz.`,
    })

    // Simulate quiz starting after a delay
    setTimeout(() => {
      setWaiting(false)
      startQuestion()
    }, 5000)
  }

  const startQuestion = () => {
    // Simulate receiving a question
    const mockQuestion = {
      text: "Which of the following is NOT a component of a cell?",
      options: ["Nucleus", "Mitochondria", "Ribosomes", "Carburetor"],
    }

    setCurrentQuestion(mockQuestion)
    setTimeLeft(15)
    setSelectedAnswer(null)
    setAnswerSubmitted(false)
    setShowResults(false)
  }

  // Timer effect
  useEffect(() => {
    if (!joined || waiting || showResults || answerSubmitted || !currentQuestion) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [joined, waiting, currentQuestion, showResults, answerSubmitted])

  const handleSelectAnswer = (index: number) => {
    if (answerSubmitted) return

    setSelectedAnswer(index)
    setAnswerSubmitted(true)

    // Calculate score based on time left (faster = more points)
    const newPoints = Math.round(1000 * (timeLeft / 15))
    setScore((prev) => prev + newPoints)

    toast({
      title: "Answer submitted!",
      description: `+${newPoints} points`,
    })

    // Show results after a short delay
    setTimeout(() => {
      showQuestionResults()
    }, 1500)
  }

  const handleTimeUp = () => {
    if (!answerSubmitted) {
      setAnswerSubmitted(true)
      toast({
        title: "Time's up!",
        description: "You didn't answer in time",
        variant: "destructive",
      })

      // Show results after a short delay
      setTimeout(() => {
        showQuestionResults()
      }, 1500)
    }
  }

  const showQuestionResults = () => {
    setShowResults(true)

    // Generate mock leaderboard
    const mockLeaderboard = [
      { name: "Alex", score: Math.floor(Math.random() * 5000) + 3000 },
      { name: "Jamie", score: Math.floor(Math.random() * 4000) + 2000 },
      { name: "Taylor", score: Math.floor(Math.random() * 3000) + 1000 },
      { name: "Jordan", score: Math.floor(Math.random() * 2000) + 500 },
      { name: "Casey", score: Math.floor(Math.random() * 1000) },
    ]

    // Add the current user with their actual score
    const userEntry = { name, score }
    const combinedLeaderboard = [...mockLeaderboard, userEntry]

    // Sort by score
    const sortedLeaderboard = combinedLeaderboard.sort((a, b) => b.score - a.score)

    // Find user's rank
    const userRank = sortedLeaderboard.findIndex((entry) => entry.name === name) + 1

    setLeaderboard(sortedLeaderboard.slice(0, 5))
    setRank(userRank)

    // Simulate next question after a delay
    setTimeout(() => {
      startQuestion()
    }, 5000)
  }

  if (!joined) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Join Quiz</CardTitle>
          <CardDescription>Enter your name and the room code to join</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-code">Room Code</Label>
            <Input
              id="room-code"
              placeholder="Enter 6-digit code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="text-center text-xl tracking-widest font-mono"
              maxLength={6}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleJoin} className="w-full bg-pink-600 hover:bg-pink-700">
            Join Quiz
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (waiting) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Waiting for Quiz to Start</CardTitle>
          <CardDescription>The host will start the quiz soon</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-center text-muted-foreground">
            You've joined as <span className="font-medium text-foreground">{name}</span>
          </p>
        </CardContent>
      </Card>
    )
  }

  if (showResults) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
          <CardDescription>Top 5 players</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  player.name === name ? "bg-pink-500/20 border border-pink-500/30" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                    {index !== 0 && <span>{index + 1}</span>}
                  </div>
                  <span className="font-medium">{player.name}</span>
                </div>
                <span className="font-mono font-bold">{player.score}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span>Your rank:</span>
              <span className="font-medium">
                {rank} of {leaderboard.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Your score:</span>
              <span className="font-medium">{score}</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">Next question in a few seconds...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question</CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-mono">{timeLeft}s</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={(timeLeft / 15) * 100} className="h-2" />

        <div className="p-4 border rounded-lg">
          <p className="text-lg font-medium mb-4">{currentQuestion?.text}</p>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion?.options.map((option: string, index: number) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`h-auto py-4 justify-start text-left ${
                  selectedAnswer === index ? "bg-pink-600 hover:bg-pink-700" : ""
                }`}
                onClick={() => handleSelectAnswer(index)}
                disabled={answerSubmitted}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>

        {answerSubmitted && (
          <div className="text-center text-sm text-muted-foreground">
            Answer submitted! Waiting for other players...
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm">
          <span className="text-muted-foreground">Score: </span>
          <span className="font-medium">{score}</span>
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Rank: </span>
          <span className="font-medium">{rank > 0 ? `${rank}/${leaderboard.length}` : "N/A"}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
