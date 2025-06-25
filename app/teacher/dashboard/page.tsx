import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, CheckCircle, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function TeacherDashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, Professor!</h1>
          <p className="text-muted-foreground">Here's what's happening with your quizzes today.</p>
        </div>
        <Link href="/teacher/create-quiz">
          <Button className="bg-purple-600 hover:bg-purple-700">Create New Quiz</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Quizzes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Ending in 2 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+5 new students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Quizzes</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Quizzes</TabsTrigger>
          <TabsTrigger value="popular">Popular Quizzes</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Recent Quiz Cards */}
            <QuizCard
              title="Introduction to Biology"
              description="Basic concepts of cell biology and genetics"
              date="Created 2 days ago"
              students={24}
              avgScore={78}
            />
            <QuizCard
              title="Advanced Mathematics"
              description="Calculus and linear algebra problems"
              date="Created 5 days ago"
              students={18}
              avgScore={65}
            />
            <QuizCard
              title="World History"
              description="Major historical events and their impact"
              date="Created 1 week ago"
              students={32}
              avgScore={82}
            />
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Popular Quiz Cards */}
            <QuizCard
              title="Chemistry Fundamentals"
              description="Atomic structure and periodic table"
              date="Created 3 weeks ago"
              students={56}
              avgScore={75}
            />
            <QuizCard
              title="Literary Analysis"
              description="Analyzing classic literature and themes"
              date="Created 1 month ago"
              students={42}
              avgScore={88}
            />
            <QuizCard
              title="Computer Science Basics"
              description="Programming concepts and algorithms"
              date="Created 2 months ago"
              students={38}
              avgScore={72}
            />
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Upcoming Quiz Cards */}
            <QuizCard
              title="Physics Mechanics"
              description="Newton's laws and motion concepts"
              date="Scheduled for next week"
              students={0}
              avgScore={0}
              status="Scheduled"
            />
            <QuizCard
              title="Art History"
              description="Renaissance and modern art movements"
              date="Scheduled for next month"
              students={0}
              avgScore={0}
              status="Draft"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Quiz Card Component
function QuizCard({
  title,
  description,
  date,
  students,
  avgScore,
  status,
}: {
  title: string
  description: string
  date: string
  students: number
  avgScore: number
  status?: string
}) {
  return (
    <Card className="overflow-hidden border-border/50 hover:border-purple-500/30 transition-all">
      <CardHeader className="bg-card/50 p-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="text-sm text-muted-foreground">{date}</div>

        {status ? (
          <div className="flex items-center mt-2">
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === "Scheduled" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"
              }`}
            >
              {status}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Students</span>
              <span className="font-medium">{students}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Avg. Score</span>
              <span className="font-medium">{avgScore}%</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            Results
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
