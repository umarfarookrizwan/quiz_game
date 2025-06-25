"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/file-upload"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import type { QuizQuestion } from "@/context/quiz-context"

interface DocumentParserProps {
  onQuestionsExtracted: (questions: QuizQuestion[]) => void
}

export function DocumentParser({ onQuestionsExtracted }: DocumentParserProps) {
  const [rawText, setRawText] = useState("")
  const [parsingStatus, setParsingStatus] = useState<"idle" | "parsing" | "success" | "error">("idle")
  const [parsedQuestions, setParsedQuestions] = useState<QuizQuestion[]>([])

  const handleFileUpload = (file: File) => {
    setParsingStatus("parsing")

    // For PDF files, we would use a PDF parsing library
    // For DOCX files, we would use a DOCX parsing library
    // For this demo, we'll just read the file as text

    const reader = new FileReader()

    reader.onload = (e) => {
      const text = e.target?.result as string
      setRawText(text)

      try {
        // Simple parsing logic - in a real app, this would be more sophisticated
        const extractedQuestions = parseQuestionsFromText(text)
        setParsedQuestions(extractedQuestions)
        setParsingStatus("success")
      } catch (error) {
        console.error("Error parsing questions:", error)
        setParsingStatus("error")
      }
    }

    reader.onerror = () => {
      setParsingStatus("error")
    }

    reader.readAsText(file)
  }

  const parseQuestionsFromText = (text: string): QuizQuestion[] => {
    // This is a simplified parser that looks for patterns like:
    // Q1: Question text
    // A) Option 1
    // B) Option 2
    // C) Option 3
    // D) Option 4
    // Answer: A

    const questions: QuizQuestion[] = []
    const questionBlocks = text.split(/Q\d+:|Question \d+:/g).filter((block) => block.trim().length > 0)

    questionBlocks.forEach((block, index) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (lines.length < 5) return // Not enough lines for a complete question

      const questionText = lines[0]
      const options: string[] = []
      let correctAnswer = 0

      // Extract options
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]

        // Check if this is an option line (A), B), etc.)
        if (/^[A-D]\)/.test(line)) {
          options.push(line.substring(2).trim())
        }

        // Check if this is the answer line
        if (/Answer:/.test(line)) {
          const answerLetter = line.substring(line.indexOf(":") + 1).trim()
          correctAnswer = "ABCD".indexOf(answerLetter)
        }
      }

      // Only add if we have a valid question
      if (questionText && options.length >= 2 && correctAnswer >= 0) {
        questions.push({
          id: index + 1,
          text: questionText,
          type: "multiple-choice",
          options,
          correctAnswer,
        })
      }
    })

    return questions
  }

  const handleManualParse = () => {
    setParsingStatus("parsing")

    try {
      const extractedQuestions = parseQuestionsFromText(rawText)
      setParsedQuestions(extractedQuestions)
      setParsingStatus("success")
    } catch (error) {
      console.error("Error parsing questions:", error)
      setParsingStatus("error")
    }
  }

  const handleUseQuestions = () => {
    onQuestionsExtracted(parsedQuestions)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Import Questions</CardTitle>
        <CardDescription>Upload a document or paste text to import questions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload Document</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 pt-4">
            <FileUpload onFileUpload={handleFileUpload} acceptedFileTypes=".pdf,.doc,.docx,.txt" />

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Supported Format</AlertTitle>
              <AlertDescription>
                Documents should have questions in the format:
                <br />
                Q1: Question text
                <br />
                A) Option 1<br />
                B) Option 2<br />
                C) Option 3<br />
                D) Option 4<br />
                Answer: A
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4 pt-4">
            <Textarea
              placeholder="Paste your questions here..."
              className="min-h-[200px]"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />

            <Button onClick={handleManualParse} disabled={!rawText.trim()} className="w-full">
              Parse Questions
            </Button>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Supported Format</AlertTitle>
              <AlertDescription>
                Text should have questions in the format:
                <br />
                Q1: Question text
                <br />
                A) Option 1<br />
                B) Option 2<br />
                C) Option 3<br />
                D) Option 4<br />
                Answer: A
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {parsingStatus === "success" && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Extracted Questions</h3>
              <span className="text-sm text-muted-foreground">{parsedQuestions.length} questions found</span>
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-4 border rounded-md p-4">
              {parsedQuestions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <p className="font-medium">
                    Q{index + 1}: {question.text}
                  </p>
                  <ul className="space-y-1 pl-5">
                    {question.options.map((option, optIndex) => (
                      <li key={optIndex} className="text-sm">
                        {String.fromCharCode(65 + optIndex)}) {option}
                        {optIndex === question.correctAnswer && <span className="ml-2 text-green-500">(Correct)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {parsingStatus === "error" && (
          <Alert className="mt-6" variant="destructive">
            <AlertTitle>Error parsing questions</AlertTitle>
            <AlertDescription>
              Could not extract questions from the provided content. Please check the format and try again.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      {parsingStatus === "success" && (
        <CardFooter>
          <Button onClick={handleUseQuestions} className="w-full bg-purple-600 hover:bg-purple-700">
            Use These Questions
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
