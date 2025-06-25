"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { InfoIcon as InfoCircle } from "lucide-react"
import { calculateTextSimilarity } from "@/lib/text-similarity"

interface ShortAnswerQuestionProps {
  question: {
    id: number
    text: string
    modelAnswer: string
    keywords?: string[]
    similarityThreshold?: number
  }
  onAnswerSubmit: (answer: string, score: number) => void
  isPreview?: boolean
}

export function ShortAnswerQuestion({ question, onAnswerSubmit, isPreview = false }: ShortAnswerQuestionProps) {
  const [answer, setAnswer] = useState("")
  const [wordCount, setWordCount] = useState(0)
  const [similarityScore, setSimilarityScore] = useState<number | null>(null)
  const [showModelAnswer, setShowModelAnswer] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Calculate word count
  useEffect(() => {
    const words = answer
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0)
    setWordCount(words.length)
  }, [answer])

  const handleSubmit = () => {
    if (answer.trim() === "" || isPreview) return

    // Calculate similarity score
    const score = calculateTextSimilarity(answer, question.modelAnswer, question.keywords)
    setSimilarityScore(score)
    setIsSubmitted(true)
    onAnswerSubmit(answer, score)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{question.text}</CardTitle>
          <Badge variant="outline">Short Answer</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Type your answer here (30-50 words recommended)"
          className="min-h-[150px] resize-none"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={isSubmitted}
        />

        <div className="flex justify-between text-sm">
          <span className={wordCount < 30 ? "text-amber-500" : "text-muted-foreground"}>
            Word count: {wordCount} {wordCount < 30 && "(30-50 words recommended)"}
          </span>
          {similarityScore !== null && (
            <span className={getScoreColor(similarityScore)}>Similarity score: {similarityScore}%</span>
          )}
        </div>

        {isSubmitted && (
          <div className="mt-4 space-y-2">
            <Button variant="outline" size="sm" onClick={() => setShowModelAnswer(!showModelAnswer)} className="w-full">
              {showModelAnswer ? "Hide" : "Show"} Model Answer
            </Button>

            {showModelAnswer && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Model Answer:</p>
                <p className="text-sm">{question.modelAnswer}</p>
                {question.keywords && question.keywords.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Key concepts:</p>
                    <div className="flex flex-wrap gap-1">
                      {question.keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            className="w-full bg-pink-600 hover:bg-pink-700"
            disabled={wordCount < 10 || isPreview}
          >
            Submit Answer
          </Button>
        ) : (
          <div className="w-full p-3 bg-muted rounded-lg flex items-center gap-2">
            <InfoCircle className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Your answer has been submitted. The similarity score shows how closely your answer matches the expected
              response.
            </p>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
