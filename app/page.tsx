import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MurshiQuiz</h1>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Welcome to MurshiQuiz
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            The ultimate platform for creating and taking interactive quizzes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="border-purple-500/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-purple-400">For Teachers</CardTitle>
                <CardDescription className="text-center">
                  Create and manage quizzes, track student performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 p-1 rounded-full">✓</span>
                    Create unlimited quizzes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 p-1 rounded-full">✓</span>
                    Add various question types
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 p-1 rounded-full">✓</span>
                    Monitor student performance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-purple-500/20 text-purple-400 p-1 rounded-full">✓</span>
                    Generate detailed reports
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login?role=teacher" className="w-full">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Teacher Login</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border-pink-500/20 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-pink-400">For Students</CardTitle>
                <CardDescription className="text-center">
                  Take quizzes, track your progress, improve your knowledge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-500/20 text-pink-400 p-1 rounded-full">✓</span>
                    Join quizzes with access codes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-500/20 text-pink-400 p-1 rounded-full">✓</span>
                    Interactive quiz interface
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-500/20 text-pink-400 p-1 rounded-full">✓</span>
                    View detailed results
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="bg-pink-500/20 text-pink-400 p-1 rounded-full">✓</span>
                    Track your performance over time
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/login?role=student" className="w-full">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">Student Login</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Register an Account</h3>
              <p className="text-muted-foreground">Sign up as a teacher or student to get started</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Create or Join Quizzes</h3>
              <p className="text-muted-foreground">Teachers create quizzes, students join with access codes</p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card/50 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">View detailed analytics and improve over time</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 MurshiQuiz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
