"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BarChart3, Copy, Edit, Eye, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useQuiz } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"

export default function TeacherQuizzes() {
  const [searchTerm, setSearchTerm] = useState("")
  const { quizzes } = useQuiz()
  const { toast } = useToast()

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500"
      case "completed":
        return "bg-blue-500/20 text-blue-500"
      case "draft":
        return "bg-amber-500/20 text-amber-500"
      case "scheduled":
        return "bg-purple-500/20 text-purple-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const copyAccessCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Access code copied",
      description: `The access code ${code} has been copied to your clipboard.`,
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
        <Link href="/teacher/create-quiz">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" />
            Create New Quiz
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quizzes..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Quizzes</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                statusColor={getStatusColor(quiz.status)}
                onCopyCode={copyAccessCode}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes
              .filter((quiz) => quiz.status === "active")
              .map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  statusColor={getStatusColor(quiz.status)}
                  onCopyCode={copyAccessCode}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes
              .filter((quiz) => quiz.status === "completed")
              .map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  statusColor={getStatusColor(quiz.status)}
                  onCopyCode={copyAccessCode}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes
              .filter((quiz) => quiz.status === "draft" || quiz.status === "scheduled")
              .map((quiz) => (
                <QuizCard
                  key={quiz.id}
                  quiz={quiz}
                  statusColor={getStatusColor(quiz.status)}
                  onCopyCode={copyAccessCode}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Quiz Card Component
function QuizCard({
  quiz,
  statusColor,
  onCopyCode,
}: {
  quiz: any
  statusColor: string
  onCopyCode: (code: string) => void
}) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-purple-500/30 transition-all">
      <CardHeader className="bg-card/50 p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{quiz.title}</CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </div>
          <Badge className={statusColor}>{quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Questions</span>
            <span className="font-medium">{quiz.questions.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Students</span>
            <span className="font-medium">{quiz.students.length}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Avg. Score</span>
            <span className="font-medium">
              {quiz.students.length > 0
                ? `${Math.round(quiz.students.reduce((acc: number, s: any) => acc + s.score, 0) / quiz.students.length)}%`
                : "N/A"}
            </span>
          </div>
        </div>

        {quiz.accessCode && (
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div>
              <span className="text-xs text-muted-foreground">Access Code</span>
              <div className="font-mono font-medium">{quiz.accessCode}</div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onCopyCode(quiz.accessCode)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Quiz
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Results
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}
