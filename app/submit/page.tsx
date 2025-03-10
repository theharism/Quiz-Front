"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Logo from "@/components/logo"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"

interface Response {
  questionId: string
  selectedOptions: string[] | null
  writtenAnswer: string | null
}

interface Question {
  _id: string
  text: string
  type: string
  options: Array<{
    _id: string
    text: string
  }>
}

export default function SubmitPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [responses, setResponses] = useState<Response[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [recommendation, setRecommendation] = useState<string>('');
  const categoryMap: { [key: string]: string } = {
    TRT: "TRT (Testosterone Replacement Therapy)",
    Build: "Build (Muscle Building)",
    Peptides: "Peptides",
    Lean: "Lean (Fat Loss / Lean Body)",
    GLP1: "GLP1 (Glucagon-like Peptide-1)",
    Tadalafil: "Tadalafil (Libido / Erectile Dysfunction)",
  }
  const nameQuestion = questions?.find((question) => question.text.toLocaleLowerCase().includes("name"));
  const name = responses.find((response) => response.questionId === nameQuestion?._id)?.writtenAnswer
  
  useEffect(() => {
    // Load saved responses
    const storedResponses = localStorage.getItem("questionnaireResponses")
    if (storedResponses) {
      setResponses(JSON.parse(storedResponses))
    }

    // Fetch questions for display
    const fetchQuestions = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/v1/questions")
        const data = await res.json()

        if (data.success && data.data) {
          setQuestions(data.data)
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

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      // Format responses for API
      const formattedResponses = responses.map((response) => ({
        questionId: response.questionId,
        selectedOptions:
          response.selectedOptions && response.selectedOptions.length > 0 ? response.selectedOptions : null,
        writtenAnswer: response.writtenAnswer || null,
      }))

      const payload = {
        responses: formattedResponses,
      }

      const res = await fetch("http://localhost:3005/api/v1/quiz-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitted(true)
        const maxKey = Object.keys(data.data.totalScores).reduce((a, b) =>
          data.data.totalScores[a] > data.data.totalScores[b] ? a : b
        );
        setRecommendation(categoryMap[maxKey]);
        // Clear stored responses
        localStorage.removeItem("questionnaireResponses")

        toast({
          title: "Success!",
          description: "Your responses have been submitted successfully.",
        })
      } else {
        toast({
          title: "Submission Failed",
          description: data.message || "There was an error submitting your responses.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was an error submitting your responses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getQuestionText = (questionId: string) => {
    const question = questions.find((q) => q._id === questionId)
    return question ? question.text : "Unknown Question"
  }

  const getOptionText = (questionId: string, optionId: string) => {
    const question = questions.find((q) => q._id === questionId)
    if (!question) return "Unknown Option"

    const option = question.options.find((o) => o._id === optionId)
    return option ? option.text : "Unknown Option"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mantality-red">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="ml-2 text-white">Loading...</span>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-mantality-red p-8 md:p-12">
        <Logo />

        <div className="flex flex-col items-center justify-center h-[80vh] text-center">
          {/* <CheckCircle className="h-20 w-20 text-white mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Thank You!</h1> */}
          <p className="text-xl text-white/90 max-w-md mb-8">{name}, your results are in...</p>
          <p className="text-xl text-white/90 max-w-md mb-8">{name}, your results show your best fit is on our {recommendation} program</p>
          <button onClick={() => router.push("/")} className="mantality-button">
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mantality-red">
      <div className="p-8 md:p-12">
        <Logo />

        <div className="mt-16 max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Review Your Answers</h1>
          <p className="text-white/90 mb-8">
            Please review your answers before submitting. You can go back to make changes if needed.
          </p>

          <div className="space-y-6 mb-12">
            {responses.map((response, index) => (
              <div key={response.questionId} className="border border-white/20 rounded-lg p-4 text-white">
                <h3 className="font-medium text-lg mb-2">
                  {index + 1}. {getQuestionText(response.questionId)}
                </h3>
                <div className="text-white/80">
                  {response.writtenAnswer ? (
                    <p>{response.writtenAnswer}</p>
                  ) : response.selectedOptions && response.selectedOptions.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {response.selectedOptions.map((optionId) => (
                        <li key={optionId}>{getOptionText(response.questionId, optionId)}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No answer provided</p>
                  )}
                </div>
                <div className="mt-2 text-right">
                  <button
                    className="text-white underline text-sm"
                    onClick={() => {
                      const questionIndex = questions.findIndex((q) => q._id === response.questionId)
                      if (questionIndex !== -1) {
                        router.push(`/questions/${questionIndex}`)
                      }
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleSubmit} className="mantality-button" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Answers"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

