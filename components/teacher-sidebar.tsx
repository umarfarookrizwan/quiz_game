"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, BookOpen, Home, LogOut, PlusCircle, Settings, User, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useQuiz } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"

const teacherNavItems = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: Home,
  },
  {
    title: "Create Quiz",
    href: "/teacher/create-quiz",
    icon: PlusCircle,
  },
  {
    title: "My Quizzes",
    href: "/teacher/quizzes",
    icon: BookOpen,
  },
  {
    title: "Results",
    href: "/teacher/results",
    icon: BarChart3,
  },
  {
    title: "Students",
    href: "/teacher/students",
    icon: Users,
  },
  {
    title: "Profile",
    href: "/teacher/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/teacher/settings",
    icon: Settings,
  },
]

export function TeacherSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, currentUser } = useQuiz()
  const { toast } = useToast()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  return (
    <div className="h-screen border-r border-border flex flex-col bg-card/50">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-purple-400">QuizMaster</h2>
        <p className="text-sm text-muted-foreground">
          {currentUser ? `Welcome, ${currentUser.name}` : "Teacher Dashboard"}
        </p>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        {teacherNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              pathname === item.href ? "bg-purple-500/10 text-purple-400 font-medium" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-border">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
