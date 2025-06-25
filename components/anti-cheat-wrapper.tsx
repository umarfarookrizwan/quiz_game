"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { AlertCircle, Maximize, Minimize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AntiCheatWrapperProps {
  children: React.ReactNode
  onAttemptedExit?: () => void
  maxWarnings?: number
  onMaxWarningsReached?: () => void
}

export function AntiCheatWrapper({
  children,
  onAttemptedExit,
  maxWarnings = 3,
  onMaxWarningsReached,
}: AntiCheatWrapperProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [warningCount, setWarningCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (wrapperRef.current?.requestFullscreen) {
        wrapperRef.current
          .requestFullscreen()
          .then(() => setIsFullscreen(true))
          .catch((err) => console.error(`Error attempting to enable fullscreen: ${err.message}`))
      }
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => console.error(`Error attempting to exit fullscreen: ${err.message}`))
      }
    }
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)

      // If exiting fullscreen, count as a warning
      if (!document.fullscreenElement) {
        handleWarning("Fullscreen mode was exited")
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleWarning("Tab switching detected")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  // Handle window blur (switching to another window)
  useEffect(() => {
    const handleWindowBlur = () => {
      handleWarning("Window focus lost")
    }

    window.addEventListener("blur", handleWindowBlur)
    return () => window.removeEventListener("blur", handleWindowBlur)
  }, [])

  // Handle warning
  const handleWarning = (reason: string) => {
    if (onAttemptedExit) {
      onAttemptedExit()
    }

    setWarningCount((prev) => {
      const newCount = prev + 1

      if (newCount >= maxWarnings && onMaxWarningsReached) {
        onMaxWarningsReached()
      }

      return newCount
    })

    setShowWarning(true)

    // Hide warning after 5 seconds
    setTimeout(() => {
      setShowWarning(false)
    }, 5000)
  }

  return (
    <div ref={wrapperRef} className="relative min-h-screen">
      {showWarning && (
        <Alert variant="destructive" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>
            Attempting to exit the quiz is not allowed. Warning {warningCount} of {maxWarnings}.
            {warningCount >= maxWarnings && " Your quiz may be automatically submitted."}
          </AlertDescription>
        </Alert>
      )}

      <div className="fixed top-4 right-4 z-40">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-full bg-background/80 backdrop-blur-sm"
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      {children}
    </div>
  )
}
