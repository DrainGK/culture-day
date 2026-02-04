"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Quiz } from "@/components/quiz"
import { DualQuiz } from "@/components/dual-quiz"
import { CultureQuiz } from "@/components/culture-quiz"

function QuizContent() {
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "philosophers"

  const titles: Record<string, { title: string; description: string }> = {
    philosophers: {
      title: "Which French Philosopher Are You?",
      description: "Answer these 10 questions to discover which French philosopher matches your worldview and philosophical inclinations."
    },
    dual: {
      title: "Philosophical Duels",
      description: "Choose your favorite between two philosophers in each round and discover who rises to the top based on your preferences."
    },
    culture: {
      title: "French Culture Quiz",
      description: "Test your knowledge of French history, literature, art, and cultural heritage with these challenging questions."
    }
  }

  const current = titles[mode] || titles.philosophers

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            {current.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {current.description}
          </p>
        </div>
        {mode === "philosophers" && <Quiz />}
        {mode === "dual" && <DualQuiz />}
        {mode === "culture" && <CultureQuiz />}
      </div>
    </div>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <QuizContent />
    </Suspense>
  )
}
