import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, BookOpen, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Murshitha!</h1>
          <p className="text-muted-foreground">Ready to test your knowledge today?</p>
        </div>
        <Link href="/student/join-quiz">
          <Button className="bg-pink-600 hover:bg-pink-700">Join New Quiz</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Taken</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Quizzes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Next one in 2 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Quizzes</TabsTrigger>
          <TabsTrigger value="recent">Recent Results</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AvailableQuizCard
              title="Introduction to Biology"
              teacher="Prof. Pavithra"
              timeLimit="45 minutes"
              questions={20}
              dueDate="Today, 11:59 PM"
              urgent
            />
            <AvailableQuizCard
              title="Advanced Mathematics"
              teacher="Prof. Sangeetha"
              timeLimit="60 minutes"
              questions={15}
              dueDate="Tomorrow, 3:00 PM"
            />
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ResultCard
              title="Chemistry Fundamentals"
              date="Completed 2 days ago"
              score={85}
              totalQuestions={25}
              correctAnswers={21}
            />
            <ResultCard
              title="Literary Analysis"
              date="Completed 1 week ago"
              score={92}
              totalQuestions={15}
              correctAnswers={14}
            />
            <ResultCard
              title="Computer Science Basics"
              date="Completed 2 weeks ago"
              score={78}
              totalQuestions={30}
              correctAnswers={23}
            />
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Your average scores by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Mathematics</span>
                  <span className="font-medium">82%</span>
                </div>
                <Progress value={82} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Science</span>
                  <span className="font-medium">75%</span>
                </div>
                <Progress value={75} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Literature</span>
                  <span className="font-medium">90%</span>
                </div>
                <Progress value={90} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>History</span>
                  <span className="font-medium">68%</span>
                </div>
                <Progress value={68} className="h-2 bg-muted" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Available Quiz Card Component
function AvailableQuizCard({
  title,
  teacher,
  timeLimit,
  questions,
  dueDate,
  urgent,
}: {
  title: string
  teacher: string
  timeLimit: string
  questions: number
  dueDate: string
  urgent?: boolean
}) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-pink-500/30 transition-all">
      <CardHeader className="bg-card/50 p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {urgent && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">Due Soon</span>}
        </div>
        <CardDescription>{teacher}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Time Limit</span>
            <span className="font-medium">{timeLimit}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Questions</span>
            <span className="font-medium">{questions}</span>
          </div>
        </div>

        <div className="text-sm mt-2">
          <span className="text-xs text-muted-foreground">Due: </span>
          <span className={urgent ? "text-red-400" : ""}>{dueDate}</span>
        </div>

        <div className="flex justify-end mt-4">
          <Button className="w-full bg-pink-600 hover:bg-pink-700">Start Quiz</Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Result Card Component
function ResultCard({
  title,
  date,
  score,
  totalQuestions,
  correctAnswers,
}: {
  title: string
  date: string
  score: number
  totalQuestions: number
  correctAnswers: number
}) {
  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="bg-card/50 p-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        <div className="flex items-center justify-center mt-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
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
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="absolute text-2xl font-bold">{score}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Questions</span>
            <span className="font-medium">{totalQuestions}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Correct</span>
            <span className="font-medium">{correctAnswers}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
