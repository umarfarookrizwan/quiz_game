import type React from "react"
import { TeacherSidebar } from "@/components/teacher-sidebar"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-background">
      <TeacherSidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
