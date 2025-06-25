"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Loader2, Sparkles } from "lucide-react"
import { generateQuestions } from "@/lib/ai-question-generator"
import type { QuizQuestionWithAI } from "@/types/quiz-types"

interface AIQuestionGeneratorProps {
  onQuestionsGenerated: (questions: QuizQuestionWithAI[]) => void
}

export function AIQuestionGenerator({ onQuestionsGenerated }: AIQuestionGeneratorProps) {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate")
  const [questionCount, setQuestionCount] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [includeMultipleChoice, setIncludeMultipleChoice] = useState(true)
  const [includeShortAnswer, setIncludeShortAnswer] = useState(true)
  const [includeFillInBlank, setIncludeFillInBlank] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    if (!includeMultipleChoice && !includeShortAnswer && !includeFillInBlank) {
      setError("Please select at least one question type")
      return
    }

    setError(null)
    setIsGenerating(true)

    try {
      const questionTypes = []
      if (includeMultipleChoice) questionTypes.push("multiple-choice")
      if (includeShortAnswer) questionTypes.push("short-answer")
      if (includeFillInBlank) questionTypes.push("fill-in-blank")

      const questions = await generateQuestions({
        topic,
        difficulty,
        count: questionCount,
        questionTypes,
      })

      onQuestionsGenerated(questions)
    } catch (err) {
      console.error("Error generating questions:", err)
      setError("Failed to generate questions. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-500" />
          AI Question Generator
        </CardTitle>
        <CardDescription>Generate quiz questions using AI based on your topic and preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Photosynthesis, World War II, Algebra"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number of Questions: {questionCount}</Label>
              <Slider
                value={[questionCount]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setQuestionCount(value[0])}
              />
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 pt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Question Types</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="multiple-choice">Multiple Choice Questions</Label>
                  <p className="text-xs text-muted-foreground">Questions with several options</p>
                </div>
                <Switch
                  id="multiple-choice"
                  checked={includeMultipleChoice}
                  onCheckedChange={setIncludeMultipleChoice}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="short-answer">Short Answer Questions</Label>
                  <p className="text-xs text-muted-foreground">Questions requiring brief written responses</p>
                </div>
                <Switch id="short-answer" checked={includeShortAnswer} onCheckedChange={setIncludeShortAnswer} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="fill-in-blank">Fill in the Blank</Label>
                  <p className="text-xs text-muted-foreground">Sentences with missing words</p>
                </div>
                <Switch id="fill-in-blank" checked={includeFillInBlank} onCheckedChange={setIncludeFillInBlank} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerate} className="w-full bg-purple-600 hover:bg-purple-700" disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Questions
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
