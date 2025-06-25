"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Download, FileText, Search, SlidersHorizontal, UserRound } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Sample results data
const quizResults = [
  {
    id: 1,
    title: "Introduction to Biology",
    totalStudents: 24,
    avgScore: 78,
    highestScore: 95,
    lowestScore: 52,
    dateCompleted: "2024-03-20",
    students: [
      { id: 1, name: "Alex Johnson", score: 85, timeTaken: "32:45", submittedAt: "2024-03-18 14:23" },
      { id: 2, name: "Jamie Smith", score: 92, timeTaken: "28:12", submittedAt: "2024-03-18 15:10" },
      { id: 3, name: "Taylor Brown", score: 65, timeTaken: "40:30", submittedAt: "2024-03-19 09:45" },
      { id: 4, name: "Jordan Lee", score: 78, timeTaken: "35:22", submittedAt: "2024-03-19 11:30" },
      { id: 5, name: "Casey Wilson", score: 52, timeTaken: "42:15", submittedAt: "2024-03-20 10:15" },
    ],
  },
  {
    id: 2,
    title: "Advanced Mathematics",
    totalStudents: 18,
    avgScore: 65,
    highestScore: 88,
    lowestScore: 42,
    dateCompleted: "2024-03-15",
    students: [
      { id: 6, name: "Riley Davis", score: 72, timeTaken: "45:10", submittedAt: "2024-03-14 13:20" },
      { id: 7, name: "Morgan White", score: 88, timeTaken: "38:45", submittedAt: "2024-03-14 14:05" },
      { id: 8, name: "Avery Martin", score: 63, timeTaken: "42:30", submittedAt: "2024-03-15 09:30" },
      { id: 9, name: "Quinn Thomas", score: 42, timeTaken: "50:15", submittedAt: "2024-03-15 10:45" },
    ],
  },
  {
    id: 3,
    title: "World History",
    totalStudents: 32,
    avgScore: 82,
    highestScore: 98,
    lowestScore: 60,
    dateCompleted: "2024-03-05",
    students: [
      { id: 10, name: "Sam Roberts", score: 90, timeTaken: "36:20", submittedAt: "2024-03-04 14:15" },
      { id: 11, name: "Jesse Garcia", score: 85, timeTaken: "39:45", submittedAt: "2024-03-04 15:30" },
      { id: 12, name: "Drew Anderson", score: 98, timeTaken: "32:10", submittedAt: "2024-03-05 09:20" },
      { id: 13, name: "Reese Campbell", score: 60, timeTaken: "44:30", submittedAt: "2024-03-05 11:45" },
    ],
  },
]

export default function TeacherResults() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null)

  const filteredQuizzes = quizResults.filter((quiz) => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedQuizData = selectedQuiz !== null ? quizResults.find((quiz) => quiz.id === selectedQuiz) : null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quiz Results</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            className="max-w-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={selectedQuiz?.toString() || "all"}
          onValueChange={(value) => setSelectedQuiz(value === "all" ? null : value ? Number.parseInt(value) : null)}
        >
          <SelectTrigger className="w-full md:w-[250px]">
            <SelectValue placeholder="Select a quiz" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Quizzes</SelectItem>
            {quizResults.map((quiz) => (
              <SelectItem key={quiz.id} value={quiz.id.toString()}>
                {quiz.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline" size="icon" className="ml-auto">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {selectedQuizData ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedQuizData.title}</h2>
              <p className="text-muted-foreground">
                Completed on {new Date(selectedQuizData.dateCompleted).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedQuiz(null)}>
              View All Quizzes
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedQuizData.totalStudents}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedQuizData.avgScore}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedQuizData.highestScore}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedQuizData.lowestScore}%</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>Student performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>90-100%</span>
                    <span>{selectedQuizData.students.filter((s) => s.score >= 90).length} students</span>
                  </div>
                  <Progress
                    value={
                      (selectedQuizData.students.filter((s) => s.score >= 90).length / selectedQuizData.totalStudents) *
                      100
                    }
                    className="h-2 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>80-89%</span>
                    <span>
                      {selectedQuizData.students.filter((s) => s.score >= 80 && s.score < 90).length} students
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedQuizData.students.filter((s) => s.score >= 80 && s.score < 90).length /
                        selectedQuizData.totalStudents) *
                      100
                    }
                    className="h-2 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>70-79%</span>
                    <span>
                      {selectedQuizData.students.filter((s) => s.score >= 70 && s.score < 80).length} students
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedQuizData.students.filter((s) => s.score >= 70 && s.score < 80).length /
                        selectedQuizData.totalStudents) *
                      100
                    }
                    className="h-2 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>60-69%</span>
                    <span>
                      {selectedQuizData.students.filter((s) => s.score >= 60 && s.score < 70).length} students
                    </span>
                  </div>
                  <Progress
                    value={
                      (selectedQuizData.students.filter((s) => s.score >= 60 && s.score < 70).length /
                        selectedQuizData.totalStudents) *
                      100
                    }
                    className="h-2 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Below 60%</span>
                    <span>{selectedQuizData.students.filter((s) => s.score < 60).length} students</span>
                  </div>
                  <Progress
                    value={
                      (selectedQuizData.students.filter((s) => s.score < 60).length / selectedQuizData.totalStudents) *
                      100
                    }
                    className="h-2 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Results</CardTitle>
              <CardDescription>Individual student performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Time Taken</TableHead>
                    <TableHead>Submitted At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedQuizData.students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`${
                              student.score >= 80
                                ? "text-green-500"
                                : student.score >= 60
                                  ? "text-amber-500"
                                  : "text-red-500"
                            }`}
                          >
                            {student.score}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{student.timeTaken}</TableCell>
                      <TableCell>{student.submittedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View Details</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="summary" className="space-y-4">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quizResults.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {quizResults.reduce((acc, quiz) => acc + quiz.totalStudents, 0)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(quizResults.reduce((acc, quiz) => acc + quiz.avgScore, 0) / quizResults.length)}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Math.max(...quizResults.map((quiz) => quiz.highestScore))}%</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Quizzes</CardTitle>
                  <CardDescription>Latest quiz results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quiz</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Avg. Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizResults
                        .sort((a, b) => new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime())
                        .slice(0, 5)
                        .map((quiz) => (
                          <TableRow key={quiz.id}>
                            <TableCell className="font-medium">{quiz.title}</TableCell>
                            <TableCell>{quiz.totalStudents}</TableCell>
                            <TableCell>{quiz.avgScore}%</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedQuiz(quiz.id)}>
                                <BarChart3 className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Students</CardTitle>
                  <CardDescription>Students with highest average scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Jamie Smith", avgScore: 90, quizzesTaken: 3 },
                      { name: "Drew Anderson", avgScore: 88, quizzesTaken: 4 },
                      { name: "Morgan White", avgScore: 85, quizzesTaken: 2 },
                      { name: "Sam Roberts", avgScore: 82, quizzesTaken: 5 },
                      { name: "Alex Johnson", avgScore: 80, quizzesTaken: 3 },
                    ].map((student, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                            <UserRound className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium leading-none">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.quizzesTaken} quizzes</p>
                          </div>
                        </div>
                        <div className="font-medium">{student.avgScore}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quizzes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Quizzes</CardTitle>
                <CardDescription>Complete list of quiz results</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz Title</TableHead>
                      <TableHead>Date Completed</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Highest</TableHead>
                      <TableHead>Lowest</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuizzes.map((quiz) => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-medium">{quiz.title}</TableCell>
                        <TableCell>{new Date(quiz.dateCompleted).toLocaleDateString()}</TableCell>
                        <TableCell>{quiz.totalStudents}</TableCell>
                        <TableCell>{quiz.avgScore}%</TableCell>
                        <TableCell>{quiz.highestScore}%</TableCell>
                        <TableCell>{quiz.lowestScore}%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedQuiz(quiz.id)}>
                            <BarChart3 className="h-4 w-4" />
                            <span className="sr-only">View Details</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>Overall student performance across all quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Quizzes Taken</TableHead>
                      <TableHead>Avg. Score</TableHead>
                      <TableHead>Highest Score</TableHead>
                      <TableHead>Lowest Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, name: "Alex Johnson", quizzesTaken: 3, avgScore: 80, highestScore: 85, lowestScore: 72 },
                      { id: 2, name: "Jamie Smith", quizzesTaken: 3, avgScore: 90, highestScore: 92, lowestScore: 85 },
                      { id: 3, name: "Taylor Brown", quizzesTaken: 2, avgScore: 68, highestScore: 72, lowestScore: 65 },
                      { id: 4, name: "Jordan Lee", quizzesTaken: 3, avgScore: 75, highestScore: 78, lowestScore: 70 },
                      { id: 5, name: "Casey Wilson", quizzesTaken: 2, avgScore: 62, highestScore: 72, lowestScore: 52 },
                      { id: 6, name: "Riley Davis", quizzesTaken: 2, avgScore: 70, highestScore: 72, lowestScore: 68 },
                      { id: 7, name: "Morgan White", quizzesTaken: 2, avgScore: 85, highestScore: 88, lowestScore: 82 },
                      {
                        id: 8,
                        name: "Drew Anderson",
                        quizzesTaken: 3,
                        avgScore: 88,
                        highestScore: 98,
                        lowestScore: 75,
                      },
                    ].map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.quizzesTaken}</TableCell>
                        <TableCell>{student.avgScore}%</TableCell>
                        <TableCell>{student.highestScore}%</TableCell>
                        <TableCell>{student.lowestScore}%</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <UserRound className="h-4 w-4" />
                            <span className="sr-only">View Student</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
