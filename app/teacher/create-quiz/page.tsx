"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, ChevronLeft, ChevronRight, Plus, Trash2, Upload, Sparkles } from "lucide-react"
import { useQuiz, type QuizQuestion } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"
import { DocumentParser } from "@/components/document-parser"
import { AIQuestionGenerator } from "@/components/ai-question-generator"
import { ShortAnswerQuestion } from "@/components/short-answer-question"
import type { QuizQuestionWithAI } from "@/types/quiz-types"

export default function CreateQuiz() {
  const router = useRouter()
  const { addQuiz, currentUser } = useQuiz()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [showImportQuestions, setShowImportQuestions] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  // Quiz details state
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [subject, setSubject] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [timeLimit, setTimeLimit] = useState("30")
  const [passingScore, setPassingScore] = useState("70")

  // Questions state
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      text: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ])

  // Settings state
  const [generateAccessCode, setGenerateAccessCode] = useState(true)
  const [scheduleQuiz, setScheduleQuiz] = useState(false)
  const [showResultsImmediately, setShowResultsImmediately] = useState(true)
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(true)
  const [allowRetakes, setAllowRetakes] = useState(false)
  const [shuffleQuestions, setShuffleQuestions] = useState(false)
  const [enableRealTimeMode, setEnableRealTimeMode] = useState(false)

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: "",
      type: "multiple-choice",
      options: ["", "", "", ""],
      correctAnswer: 0,
    }
    setQuestions([...questions, newQuestion])
  }

  const addShortAnswerQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: "",
      type: "short-answer" as const,
      options: [],
      correctAnswer: "",
      modelAnswer: "",
      keywords: [],
      similarityThreshold: 70,
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const updateOption = (questionId: number, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt: string, idx: number) => (idx === optionIndex ? value : opt)),
            }
          : q,
      ),
    )
  }

  const handleQuestionsImported = (importedQuestions: QuizQuestion[]) => {
    setQuestions(importedQuestions)
    setShowImportQuestions(false)

    toast({
      title: "Questions imported",
      description: `${importedQuestions.length} questions have been imported successfully.`,
    })
  }

  const handleAIQuestionsGenerated = (generatedQuestions: QuizQuestionWithAI[]) => {
    // Convert AI questions to regular quiz questions
    const newQuestions = generatedQuestions.map((q, index) => ({
      id: questions.length + index + 1,
      text: q.text,
      type: q.type,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      modelAnswer: q.modelAnswer,
      keywords: q.keywords,
      similarityThreshold: q.similarityThreshold,
    }))

    setQuestions([...questions, ...newQuestions])
    setShowAIGenerator(false)

    toast({
      title: "Questions generated",
      description: `${newQuestions.length} questions have been generated successfully.`,
    })
  }

  const handlePublishQuiz = () => {
    if (!quizTitle) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your quiz.",
        variant: "destructive",
      })
      setCurrentStep(1)
      return
    }

    if (questions.some((q) => !q.text || (q.type === "multiple-choice" && q.options.some((opt) => !opt)))) {
      toast({
        title: "Incomplete questions",
        description: "Please ensure all questions and options are filled out.",
        variant: "destructive",
      })
      setCurrentStep(2)
      return
    }

    const accessCode = addQuiz({
      title: quizTitle,
      description: quizDescription,
      subject,
      gradeLevel,
      timeLimit: Number.parseInt(timeLimit),
      passingScore: Number.parseInt(passingScore),
      questions,
      status: "active",
      createdBy: currentUser?.id || "unknown",
      shuffleQuestions,
    })

    toast({
      title: "Quiz published successfully!",
      description: `Your quiz access code is: ${accessCode}`,
    })

    router.push("/teacher/quizzes")
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline">Save as Draft</Button>
          <Button className="bg-purple-600 hover:bg-purple-700" onClick={handlePublishQuiz}>
            Publish Quiz
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Button
          variant={currentStep === 1 ? "default" : "outline"}
          className={currentStep === 1 ? "bg-purple-600 hover:bg-purple-700" : ""}
          onClick={() => setCurrentStep(1)}
        >
          1. Quiz Details
        </Button>
        <Button
          variant={currentStep === 2 ? "default" : "outline"}
          className={currentStep === 2 ? "bg-purple-600 hover:bg-purple-700" : ""}
          onClick={() => setCurrentStep(2)}
        >
          2. Add Questions
        </Button>
        <Button
          variant={currentStep === 3 ? "default" : "outline"}
          className={currentStep === 3 ? "bg-purple-600 hover:bg-purple-700" : ""}
          onClick={() => setCurrentStep(3)}
        >
          3. Review & Settings
        </Button>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
            <CardDescription>Enter the basic information about your quiz</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                placeholder="Enter quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter a description of the quiz"
                className="min-h-[100px]"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathematics</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elementary">Elementary School</SelectItem>
                    <SelectItem value="middle">Middle School</SelectItem>
                    <SelectItem value="high">High School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                <Input
                  id="time-limit"
                  type="number"
                  min="1"
                  placeholder="e.g., 30"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passing-score">Passing Score (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g., 70"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <Label htmlFor="real-time-mode">Real-Time Quiz Mode</Label>
                <p className="text-sm text-muted-foreground">Enable Kahoot-style real-time quiz functionality</p>
              </div>
              <Switch id="real-time-mode" checked={enableRealTimeMode} onCheckedChange={setEnableRealTimeMode} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => setCurrentStep(2)} className="bg-purple-600 hover:bg-purple-700">
              Next: Add Questions
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          {showImportQuestions ? (
            <DocumentParser onQuestionsExtracted={handleQuestionsImported} />
          ) : showAIGenerator ? (
            <AIQuestionGenerator onQuestionsGenerated={handleAIQuestionsGenerated} />
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Add Questions</CardTitle>
                  <CardDescription>Create questions for your quiz</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowImportQuestions(true)}>
                    <Upload className="mr-2 h-4 w-4" />
                    Import Questions
                  </Button>
                  <Button variant="outline" onClick={() => setShowAIGenerator(true)}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Generate
                  </Button>
                  <div className="flex gap-1">
                    <Button onClick={addQuestion} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add MCQ
                    </Button>
                    <Button onClick={addShortAnswerQuestion} className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Short Answer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        disabled={questions.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                      <Textarea
                        id={`question-${question.id}`}
                        placeholder="Enter your question"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`question-type-${question.id}`}>Question Type</Label>
                      <Select
                        value={question.type}
                        onValueChange={(value) => updateQuestion(question.id, "type", value)}
                      >
                        <SelectTrigger id={`question-type-${question.id}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                          <SelectItem value="true-false">True/False</SelectItem>
                          <SelectItem value="short-answer">Short Answer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {question.type === "multiple-choice" && (
                      <div className="space-y-4">
                        <Label>Answer Options</Label>
                        <RadioGroup
                          value={question.correctAnswer.toString()}
                          onValueChange={(value) =>
                            updateQuestion(question.id, "correctAnswer", Number.parseInt(value))
                          }
                        >
                          {question.options.map((option: string, optIndex: number) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={optIndex.toString()} id={`q${question.id}-opt${optIndex}`} />
                              <Input
                                placeholder={`Option ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                className="flex-1"
                              />
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {question.type === "true-false" && (
                      <div className="space-y-4">
                        <Label>Correct Answer</Label>
                        <RadioGroup
                          value={question.correctAnswer.toString()}
                          onValueChange={(value) =>
                            updateQuestion(question.id, "correctAnswer", Number.parseInt(value))
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id={`q${question.id}-true`} />
                            <Label htmlFor={`q${question.id}-true`}>True</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id={`q${question.id}-false`} />
                            <Label htmlFor={`q${question.id}-false`}>False</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}

                    {question.type === "short-answer" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`model-answer-${question.id}`}>Model Answer</Label>
                          <Textarea
                            id={`model-answer-${question.id}`}
                            placeholder="Enter the model answer that will be used for grading"
                            value={question.modelAnswer || ""}
                            onChange={(e) => updateQuestion(question.id, "modelAnswer", e.target.value)}
                            className="min-h-[100px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`keywords-${question.id}`}>Keywords (comma separated)</Label>
                          <Input
                            id={`keywords-${question.id}`}
                            placeholder="e.g., photosynthesis, chlorophyll, energy"
                            value={question.keywords?.join(", ") || ""}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "keywords",
                                e.target.value
                                  .split(",")
                                  .map((k) => k.trim())
                                  .filter((k) => k),
                              )
                            }
                          />
                          <p className="text-xs text-muted-foreground">
                            Important concepts that should be present in a good answer
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`threshold-${question.id}`}>
                            Similarity Threshold: {question.similarityThreshold || 70}%
                          </Label>
                          <Input
                            id={`threshold-${question.id}`}
                            type="range"
                            min="50"
                            max="90"
                            value={question.similarityThreshold || 70}
                            onChange={(e) => updateQuestion(question.id, "similarityThreshold", Number(e.target.value))}
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimum similarity score required to consider an answer correct
                          </p>
                        </div>

                        <div className="p-4 border rounded-lg bg-muted/50">
                          <h4 className="font-medium mb-2">Preview</h4>
                          <ShortAnswerQuestion
                            question={{
                              id: question.id,
                              text: question.text || "Question text will appear here",
                              modelAnswer: question.modelAnswer || "Model answer will appear here",
                              keywords: question.keywords || [],
                              similarityThreshold: question.similarityThreshold || 70,
                            }}
                            onAnswerSubmit={() => {}}
                            isPreview={true}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} className="bg-purple-600 hover:bg-purple-700">
                  Next: Review & Settings
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
              <CardDescription>Configure additional settings for your quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Access Settings</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Generate Access Code</Label>
                    <p className="text-sm text-muted-foreground">Students will need this code to access the quiz</p>
                  </div>
                  <Switch checked={generateAccessCode} onCheckedChange={setGenerateAccessCode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Schedule Quiz</Label>
                    <p className="text-sm text-muted-foreground">Set a specific time window for the quiz</p>
                  </div>
                  <Switch checked={scheduleQuiz} onCheckedChange={setScheduleQuiz} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Shuffle Questions</Label>
                    <p className="text-sm text-muted-foreground">
                      Each student will see questions in a different order
                    </p>
                  </div>
                  <Switch checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Result Settings</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Results Immediately</Label>
                    <p className="text-sm text-muted-foreground">
                      Students will see their results right after submission
                    </p>
                  </div>
                  <Switch checked={showResultsImmediately} onCheckedChange={setShowResultsImmediately} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Correct Answers</Label>
                    <p className="text-sm text-muted-foreground">
                      Students can see which answers were correct/incorrect
                    </p>
                  </div>
                  <Switch checked={showCorrectAnswers} onCheckedChange={setShowCorrectAnswers} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Retakes</Label>
                    <p className="text-sm text-muted-foreground">Students can take the quiz multiple times</p>
                  </div>
                  <Switch checked={allowRetakes} onCheckedChange={setAllowRetakes} />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Quiz Summary</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Questions</p>
                    <p className="text-2xl font-bold">{questions.length}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Estimated Time</p>
                    <p className="text-2xl font-bold">{timeLimit} min</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handlePublishQuiz}>
                <Check className="mr-2 h-4 w-4" />
                Publish Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
