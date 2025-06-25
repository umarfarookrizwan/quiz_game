"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [defaultRole, setDefaultRole] = useState("student")

  useEffect(() => {
    const role = searchParams.get("role")
    if (role === "teacher" || role === "student") {
      setDefaultRole(role)
    }
  }, [searchParams])

  const handleRegister = (role: string, e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would register the user here
    router.push("/login?role=" + role)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-muted/30">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Register to start using MurshiQuiz</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={defaultRole} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="teacher">Teacher</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={(e) => handleRegister("student", e)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student-first-name">First Name</Label>
                    <Input id="student-first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-last-name">Last Name</Label>
                    <Input id="student-last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-email">Email</Label>
                  <Input id="student-email" type="email" placeholder="student@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input id="student-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-confirm-password">Confirm Password</Label>
                  <Input id="student-confirm-password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="student-terms" required />
                  <label
                    htmlFor="student-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                  Register as Student
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="teacher">
              <form onSubmit={(e) => handleRegister("teacher", e)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher-first-name">First Name</Label>
                    <Input id="teacher-first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher-last-name">Last Name</Label>
                    <Input id="teacher-last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-email">Email</Label>
                  <Input id="teacher-email" type="email" placeholder="teacher@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-institution">Institution</Label>
                  <Input id="teacher-institution" placeholder="School/University Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-password">Password</Label>
                  <Input id="teacher-password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher-confirm-password">Confirm Password</Label>
                  <Input id="teacher-confirm-password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="teacher-terms" required />
                  <label
                    htmlFor="teacher-terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </label>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  Register as Teacher
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
          <Link href="/" className="text-center text-sm text-muted-foreground hover:underline">
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
