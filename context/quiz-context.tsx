"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types
export type QuizQuestion = {
  id: number
  text: string
  type: "multiple-choice" | "true-false"
  options: string[]
  correctAnswer: number
}

export type Quiz = {
  id: string
  title: string
  description: string
  subject: string
  gradeLevel: string
  timeLimit: number
  passingScore: number
  questions: QuizQuestion[]
  accessCode: string
  status: "draft" | "active" | "completed" | "scheduled"
  dateCreated: string
  createdBy: string
  students: StudentResult[]
  shuffleQuestions: boolean // Added for question shuffling
}

export type StudentResult = {
  id: string
  studentId: string
  studentName: string
  score: number
  timeTaken: string
  submittedAt: string
  answers: number[]
  questionOrder?: number[] // Added to track the order of questions for each student
}

export type User = {
  id: string
  name: string
  email: string
  role: "teacher" | "student"
}

type QuizContextType = {
  quizzes: Quiz[]
  currentUser: User | null
  addQuiz: (quiz: Omit<Quiz, "id" | "dateCreated" | "accessCode" | "students">) => string
  getQuizByCode: (code: string) => Quiz | undefined
  getQuizById: (id: string) => Quiz | undefined
  submitQuizResult: (quizId: string, result: Omit<StudentResult, "id">) => void
  login: (email: string, password: string, role: "teacher" | "student") => boolean
  logout: () => void
  getShuffledQuestions: (quizId: string) => { questions: QuizQuestion[]; order: number[] }
}

// Sample data
const sampleQuizzes: Quiz[] = [
  {
    id: "quiz-1",
    title: "Introduction to Biology",
    description: "Basic concepts of cell biology and genetics",
    subject: "science",
    gradeLevel: "high",
    timeLimit: 45,
    passingScore: 70,
    status: "active",
    accessCode: "BIO101",
    dateCreated: "2024-03-15",
    createdBy: "teacher-1",
    shuffleQuestions: true, // Enable question shuffling
    questions: [
      {
        id: 1,
        text: "Which of the following is NOT a component of a cell?",
        type: "multiple-choice",
        options: ["Nucleus", "Mitochondria", "Ribosomes", "Carburetor"],
        correctAnswer: 3,
      },
      {
        id: 2,
        text: "DNA stands for:",
        type: "multiple-choice",
        options: [
          "Deoxyribonucleic Acid",
          "Diribonucleic Acid",
          "Deoxyribose Nucleic Acid",
          "Diribose Nucleotide Acid",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        text: "Which of the following is a function of mitochondria?",
        type: "multiple-choice",
        options: ["Protein synthesis", "Energy production", "Cell division", "Waste removal"],
        correctAnswer: 1,
      },
      {
        id: 4,
        text: "The process by which plants make their own food is called:",
        type: "multiple-choice",
        options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
        correctAnswer: 1,
      },
      {
        id: 5,
        text: "Which of the following is NOT a type of RNA?",
        type: "multiple-choice",
        options: ["mRNA", "tRNA", "rRNA", "dRNA"],
        correctAnswer: 3,
      },
    ],
    students: [
      {
        id: "result-1",
        studentId: "student-1",
        studentName: "Alex Johnson",
        score: 80,
        timeTaken: "32:45",
        submittedAt: "2024-03-18 14:23",
        answers: [3, 0, 1, 1, 2],
        questionOrder: [0, 1, 2, 3, 4], // Original order
      },
      {
        id: "result-2",
        studentId: "student-2",
        studentName: "Jamie Smith",
        score: 92,
        timeTaken: "28:12",
        submittedAt: "2024-03-18 15:10",
        answers: [3, 0, 1, 1, 3],
        questionOrder: [4, 2, 0, 1, 3], // Shuffled order
      },
    ],
  },
  {
    id: "quiz-2",
    title: "Advanced Mathematics",
    description: "Calculus and linear algebra problems",
    subject: "math",
    gradeLevel: "college",
    timeLimit: 60,
    passingScore: 60,
    status: "active",
    accessCode: "MATH202",
    dateCreated: "2024-03-10",
    createdBy: "teacher-1",
    shuffleQuestions: false, // No question shuffling
    questions: [
      {
        id: 1,
        text: "What is the derivative of f(x) = x²?",
        type: "multiple-choice",
        options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
        correctAnswer: 1,
      },
      {
        id: 2,
        text: "What is the integral of f(x) = 2x?",
        type: "multiple-choice",
        options: ["F(x) = x² + C", "F(x) = x² + 2C", "F(x) = x + C", "F(x) = 2x² + C"],
        correctAnswer: 0,
      },
    ],
    students: [],
  },
]

const sampleUsers: User[] = [
  {
    id: "teacher-1",
    name: "Professor Pavithra",
    email: "teacher@example.com",
    role: "teacher",
  },
  {
    id: "student-1",
    name: "Murshitha Parveen",
    email: "student@example.com",
    role: "student",
  },
]

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined)

// Generate a random 6-character access code
const generateAccessCode = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: any[]) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Load data from localStorage on mount
  useEffect(() => {
    const storedQuizzes = localStorage.getItem("quizzes")
    const storedUser = localStorage.getItem("currentUser")

    if (storedQuizzes) {
      setQuizzes(JSON.parse(storedQuizzes))
    } else {
      setQuizzes(sampleQuizzes)
      localStorage.setItem("quizzes", JSON.stringify(sampleQuizzes))
    }

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    if (quizzes.length > 0) {
      localStorage.setItem("quizzes", JSON.stringify(quizzes))
    }
  }, [quizzes])

  // Add a new quiz
  const addQuiz = (quizData: Omit<Quiz, "id" | "dateCreated" | "accessCode" | "students">) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      dateCreated: new Date().toISOString().split("T")[0],
      accessCode: generateAccessCode(),
      students: [],
      shuffleQuestions: quizData.shuffleQuestions || false,
    }

    setQuizzes((prev) => [...prev, newQuiz])
    return newQuiz.accessCode
  }

  // Get quiz by access code
  const getQuizByCode = (code: string) => {
    return quizzes.find((quiz) => quiz.accessCode === code)
  }

  // Get quiz by ID
  const getQuizById = (id: string) => {
    return quizzes.find((quiz) => quiz.id === id)
  }

  // Get shuffled questions for a quiz
  const getShuffledQuestions = (quizId: string) => {
    const quiz = getQuizById(quizId)

    if (!quiz) {
      return { questions: [], order: [] }
    }

    // If shuffling is disabled, return original order
    if (!quiz.shuffleQuestions) {
      return {
        questions: quiz.questions,
        order: quiz.questions.map((_, index) => index),
      }
    }

    // Create an array of indices and shuffle it
    const indices = quiz.questions.map((_, index) => index)
    const shuffledIndices = shuffleArray(indices)

    // Create a new array of questions in the shuffled order
    const shuffledQuestions = shuffledIndices.map((index) => quiz.questions[index])

    return {
      questions: shuffledQuestions,
      order: shuffledIndices,
    }
  }

  // Submit quiz result
  const submitQuizResult = (quizId: string, result: Omit<StudentResult, "id">) => {
    setQuizzes((prev) =>
      prev.map((quiz) => {
        if (quiz.id === quizId) {
          return {
            ...quiz,
            students: [...quiz.students, { ...result, id: `result-${Date.now()}` }],
          }
        }
        return quiz
      }),
    )
  }

  // Login function
  const login = (email: string, password: string, role: "teacher" | "student") => {
    // In a real app, you would validate credentials against a database
    // For this demo, we'll just check if the email matches our sample users
    const user = sampleUsers.find((u) => u.email === email && u.role === role)

    if (user) {
      setCurrentUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return true
    }
    return false
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        currentUser,
        addQuiz,
        getQuizByCode,
        getQuizById,
        submitQuizResult,
        login,
        logout,
        getShuffledQuestions,
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

// Custom hook to use the quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider")
  }
  return context
}
