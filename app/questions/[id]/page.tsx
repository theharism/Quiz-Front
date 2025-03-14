"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter,useParams } from "next/navigation"
import Logo from "@/components/logo"
import NavigationArrows from "@/components/navigation-arrows"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { use } from "react";

interface Option {
  text: string
  score: Record<string, number>
  _id: string
}

interface Question {
  _id: string
  text: string
  type: string
  allowMultipleSelections: boolean
  options: Option[]
  isRequired: boolean
  category: string
}

interface Response {
  questionId: string
  selectedOptions: string[] | null
  writtenAnswer: string | null
}

export default function QuestionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const params = useParams();
  const questionIndex = Number.parseInt(params.id)

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Response[]>([])
  const [currentResponse, setCurrentResponse] = useState<Response>({
    questionId: "",
    selectedOptions: null,
    writtenAnswer: null,
  })

  useEffect(() => {
    // Fetch questions from API
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/v1/questions")
        const data = await res.json()

        if (data.success && data.data) {
          setQuestions(data.data)

          // Initialize responses array if not already in localStorage
          const storedResponses = localStorage.getItem("questionnaireResponses")
          if (storedResponses) {
            setResponses(JSON.parse(storedResponses))
          } else {
            const initialResponses = data.data.map((q: Question) => ({
              questionId: q._id,
              selectedOptions: q.type === "multiple-choice" ? [] : null,
              writtenAnswer: q.type === "text" ? "" : null,
            }))
            setResponses(initialResponses)
            localStorage.setItem("questionnaireResponses", JSON.stringify(initialResponses))
          }
        } else {
          toast({
            title: "Error",
            description: "Failed to load questions. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load questions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [toast])

  useEffect(() => {
    if (questions.length > 0 && questionIndex < questions.length) {
      // Find existing response for this question
      const existingResponse = responses.find((r) => r.questionId === questions[questionIndex]._id)
      if (existingResponse) {
        setCurrentResponse(existingResponse)
      } else {
        setCurrentResponse({
          questionId: questions[questionIndex]._id,
          selectedOptions: questions[questionIndex].type === "multiple-choice" ? [] : null,
          writtenAnswer: questions[questionIndex].type === "text" ? "" : null,
        })
      }
    }
  }, [questions, questionIndex, responses])

  const handleTextChange = (value: string) => {
    setCurrentResponse({
      ...currentResponse,
      writtenAnswer: value,
    })
  }

  const handleOptionSelect = (optionId: string) => {
    const question = questions[questionIndex]

    if (question.allowMultipleSelections) {
      // For multiple selection questions
      const currentSelections = currentResponse.selectedOptions || []
      const updatedSelections = currentSelections.includes(optionId)
        ? currentSelections.filter((id) => id !== optionId)
        : [...currentSelections, optionId]

      setCurrentResponse({
        ...currentResponse,
        selectedOptions: updatedSelections,
      })
    } else {
      // For single selection questions
      setCurrentResponse({
        ...currentResponse,
        selectedOptions: [optionId],
      })
    }
  }

  const saveResponse = () => {
    const updatedResponses = responses.map((response) =>
      response.questionId === currentResponse.questionId ? currentResponse : response,
    )

    setResponses(updatedResponses)
    localStorage.setItem("questionnaireResponses", JSON.stringify(updatedResponses))
  }

  const handleNext = () => {
    const currentQuestion = questions[questionIndex]

    // Validate response
    if (currentQuestion.isRequired) {
      if (
        (currentQuestion.type === "multiple-choice" &&
          (!currentResponse.selectedOptions || currentResponse.selectedOptions.length === 0)) ||
        (currentQuestion.type === "text" &&
          (!currentResponse.writtenAnswer || currentResponse.writtenAnswer.trim() === ""))
      ) {
        toast({
          title: "Required Question",
          description: "Please answer this question before proceeding.",
          variant: "destructive",
        })
        return
      }
    }

    // Save response
    saveResponse()

    // Navigate to next question or submit
    if (questionIndex < questions.length - 1) {
      router.push(`/questions/${questionIndex + 1}`)
    } else {
      router.push("/submit")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNext()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mantality-red">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Loading questions...</span>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-mantality-red">
        <h1 className="text-2xl font-bold text-white">No questions found</h1>
        <p className="mt-2 text-white/80">Please try again later.</p>
      </div>
    )
  }

  if (questionIndex >= questions.length) {
    router.push("/submit")
    return null
  }

  const currentQuestion = questions[questionIndex]
  const isMultipleChoice = currentQuestion.type === "multiple-choice"
  const isRequired = currentQuestion.isRequired

  // Get option letters (A, B, C, D, etc.)
  const getOptionLetter = (index: number) => {
    return String.fromCharCode(65 + index) // A=65, B=66, etc.
  }

  return (
    <div className="min-h-screen bg-mantality-red">
      <div className="p-8 md:p-12">
        <Logo />

        <div className="mt-16 md:mt-24 max-w-3xl mx-auto fade-in">
          <div className="flex items-center mb-6">
            <span className="text-white text-2xl mr-2">{questionIndex + 1}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
            <h2 className="text-white text-3xl md:text-4xl font-bold ml-2">
              {currentQuestion.text}
              {isRequired && <span className="text-white">*</span>}
            </h2>
          </div>

          <div className="mt-8 md:mt-12">
            {isMultipleChoice ? (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={option._id}
                    className={`option-button ${currentResponse.selectedOptions?.includes(option._id) ? "selected" : ""}`}
                    onClick={() => handleOptionSelect(option._id)}
                  >
                    <span className="option-letter">{getOptionLetter(index)}</span>
                    {option.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="max-w-xl">
                <input
                  type="text"
                  value={currentResponse.writtenAnswer || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="mantality-input"
                  placeholder="Type your answer here..."
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}
          </div>

          <div className="mt-12">
            <button onClick={handleNext} className="mantality-button">
              OK
              <span className="ml-2 text-sm opacity-70">press Enter ↵</span>
            </button>
          </div>
        </div>
      </div>

      <NavigationArrows
        prevUrl={questionIndex > 0 ? `/questions/${questionIndex - 1}` : "/"}
        nextUrl={questionIndex < questions.length - 1 ? `/questions/${questionIndex + 1}` : "/submit"}
      />
    </div>
  )
}

