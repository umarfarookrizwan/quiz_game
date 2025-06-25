"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Award, BookOpen, Home, LogOut, PlusCircle, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useQuiz } from "@/context/quiz-context"
import { useToast } from "@/components/ui/use-toast"

const studentNavItems = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: Home,
  },
  {
    title: "Join Quiz",
    href: "/student/join-quiz",
    icon: PlusCircle,
  },
  {
    title: "My Quizzes",
    href: "/student/quizzes",
    icon: BookOpen,
  },
  {
    title: "Leaderboard",
    href: "/student/leaderboard",
    icon: Award,
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
]

export function StudentSidebar() {
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
        <h2 className="text-2xl font-bold text-pink-400">QuizMaster</h2>
        <p className="text-sm text-muted-foreground">
          {currentUser ? `Welcome, ${currentUser.name}` : "Student Dashboard"}
        </p>
      </div>

      <div className="flex-1 px-3 py-2 space-y-1">
        {studentNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
              pathname === item.href ? "bg-pink-500/10 text-pink-400 font-medium" : "text-muted-foreground",
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
