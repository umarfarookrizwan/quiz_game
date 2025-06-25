// Extended quiz types to support new question types
export type QuestionType = "multiple-choice" | "true-false" | "short-answer" | "fill-in-blank"

export type QuizQuestion = {
  id: number
  text: string
  type: QuestionType
  options: string[] // For multiple choice
  correctAnswer: number | string // Number for multiple choice, string for short answer/fill in blank
  modelAnswer?: string // For short answer questions
  similarityThreshold?: number // Minimum similarity score to consider correct (0-100)
  keywords?: string[] // Important keywords for short answer grading
}

export type QuizQuestionWithAI = QuizQuestion & {
  explanation?: string // AI-generated explanation
  difficulty?: "beginner" | "intermediate" | "advanced"
}

export type StudentAnswer = {
  questionId: number
  answer: number | string // Number for multiple choice, string for short answer
  score?: number // For partial credit in short answers (0-100)
}

export type RealTimeQuizSession = {
  id: string
  quizId: string
  hostId: string
  status: "waiting" | "active" | "completed"
  roomCode: string
  participants: RealTimeParticipant[]
  currentQuestionIndex: number
  startTime?: string
  endTime?: string
}

export type RealTimeParticipant = {
  id: string
  name: string
  score: number
  answers: {
    questionIndex: number
    answer: number | string
    timeToAnswer: number // in milliseconds
    isCorrect: boolean
  }[]
}
