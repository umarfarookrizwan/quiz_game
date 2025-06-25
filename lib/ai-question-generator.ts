import type { QuizQuestionWithAI } from "@/types/quiz-types"

interface GenerateQuestionsParams {
  topic: string
  difficulty: "beginner" | "intermediate" | "advanced"
  count: number
  questionTypes: string[]
}

// This is a mock implementation - in a real app, you would call an AI API
export async function generateQuestions(params: GenerateQuestionsParams): Promise<QuizQuestionWithAI[]> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real implementation, you would call an AI API here
  // For example:
  // const response = await fetch('https://api.openai.com/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     model: "gpt-4",
  //     messages: [
  //       {
  //         role: "system",
  //         content: "You are a helpful assistant that generates quiz questions."
  //       },
  //       {
  //         role: "user",
  //         content: `Generate ${params.count} ${params.difficulty} level quiz questions about ${params.topic}.
  //                   Include question types: ${params.questionTypes.join(', ')}.`
  //       }
  //     ]
  //   })
  // });
  // const data = await response.json();
  // Then parse the response to extract questions

  // For now, we'll return mock data based on the parameters
  return generateMockQuestions(params)
}

// Generate mock questions based on the topic and parameters
function generateMockQuestions(params: GenerateQuestionsParams): QuizQuestionWithAI[] {
  const questions: QuizQuestionWithAI[] = []
  const { topic, difficulty, count, questionTypes } = params

  // Sample questions for different topics
  const topicQuestions: Record<string, any> = {
    photosynthesis: {
      "multiple-choice": [
        {
          text: "Which of the following is NOT a product of photosynthesis?",
          options: ["Oxygen", "Glucose", "Carbon dioxide", "ATP"],
          correctAnswer: 2,
          explanation:
            "Carbon dioxide is a reactant in photosynthesis, not a product. The products are oxygen, glucose, and ATP.",
        },
        {
          text: "Where does the light-dependent reaction of photosynthesis take place?",
          options: ["Stroma", "Thylakoid membrane", "Cell wall", "Mitochondria"],
          correctAnswer: 1,
          explanation: "The light-dependent reactions occur in the thylakoid membrane of the chloroplast.",
        },
      ],
      "short-answer": [
        {
          text: "Explain the role of chlorophyll in photosynthesis.",
          modelAnswer:
            "Chlorophyll is the primary pigment that absorbs light energy in photosynthesis. It captures photons from sunlight and converts them into chemical energy that drives the synthesis of carbohydrates from carbon dioxide and water.",
          keywords: ["pigment", "absorbs", "light", "energy", "photons", "chemical energy"],
          similarityThreshold: 70,
        },
      ],
      "fill-in-blank": [
        {
          text: "In photosynthesis, plants convert ________ and water into glucose and ________.",
          correctAnswer: "carbon dioxide,oxygen",
          explanation:
            "Plants take in carbon dioxide and water, and through photosynthesis, convert them into glucose and oxygen.",
        },
      ],
    },
    "world war ii": {
      "multiple-choice": [
        {
          text: "When did World War II end in Europe?",
          options: ["May 8, 1945", "August 15, 1945", "September 1, 1939", "December 7, 1941"],
          correctAnswer: 0,
          explanation: "World War II ended in Europe on May 8, 1945, known as V-E Day (Victory in Europe Day).",
        },
        {
          text: "Which country was NOT part of the Allied Powers during World War II?",
          options: ["United States", "Soviet Union", "Italy", "Great Britain"],
          correctAnswer: 2,
          explanation: "Italy was initially part of the Axis Powers alongside Germany and Japan.",
        },
      ],
      "short-answer": [
        {
          text: "Describe the significance of the D-Day landings in World War II.",
          modelAnswer:
            "D-Day (June 6, 1944) was a turning point in World War II when Allied forces landed on the beaches of Normandy, France. This massive amphibious invasion established a foothold in Nazi-occupied Western Europe, leading to the liberation of France and eventually helping to defeat Nazi Germany.",
          keywords: ["Normandy", "Allied", "invasion", "Nazi", "liberation", "France"],
          similarityThreshold: 65,
        },
      ],
      "fill-in-blank": [
        {
          text: "The attack on ________ on December 7, 1941, led to the United States entering World War II.",
          correctAnswer: "Pearl Harbor",
          explanation:
            "The Japanese attack on Pearl Harbor, Hawaii, on December 7, 1941, prompted the United States to enter World War II.",
        },
      ],
    },
  }

  // Default questions if the topic doesn't match our samples
  const defaultQuestions = {
    "multiple-choice": [
      {
        text: `What is a key characteristic of ${topic}?`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: 1,
        explanation: `Option B is correct because it accurately describes a key aspect of ${topic}.`,
      },
    ],
    "short-answer": [
      {
        text: `Explain the importance of ${topic} in its field.`,
        modelAnswer: `${topic} is important because it serves as a fundamental concept that helps us understand related phenomena. It has applications in various contexts and has contributed significantly to the development of the field.`,
        keywords: ["important", "fundamental", "concept", "applications", "development"],
        similarityThreshold: 60,
      },
    ],
    "fill-in-blank": [
      {
        text: `${topic} is primarily associated with the field of ________.`,
        correctAnswer: "science",
        explanation: `${topic} is most commonly studied and applied in the field of science.`,
      },
    ],
  }

  // Normalize topic for lookup
  const normalizedTopic = topic.toLowerCase()
  const topicData = topicQuestions[normalizedTopic] || defaultQuestions

  // Generate the requested number of questions
  for (let i = 0; i < count; i++) {
    // Cycle through question types
    const typeIndex = i % questionTypes.length
    const questionType = questionTypes[typeIndex]

    // Get questions for this type
    const questionsOfType = topicData[questionType]

    if (questionsOfType && questionsOfType.length > 0) {
      // Use modulo to cycle through available questions if we need more than we have
      const questionIndex = i % questionsOfType.length
      const questionData = questionsOfType[questionIndex]

      questions.push({
        id: i + 1,
        type: questionType as any,
        difficulty,
        ...questionData,
      })
    }
  }

  return questions
}
