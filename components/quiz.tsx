"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react"
import { RadarChart } from "./radar-chart"
import quizData from "@/data/quiz.json"
import philosophersJson from "@/data/philosophers.json"
import { cn } from "@/lib/utils"

type AnswerKey = "A" | "B" | "C" | "D" | "E"

interface Philosopher {
  id: string
  name: string
  birth: string
  work: string
  quote: string
  "fun-desc": string
  code: string
  image: string
}

// ✅ Works if philosophers.json is either:
// - [ { ... }, { ... } ]
// - { philosophers: [ { ... }, ... ] }
function normalizePhilosophers(input: unknown): Philosopher[] {
  if (Array.isArray(input)) return input as Philosopher[]
  if (input && typeof input === "object") {
    const maybe = (input as { philosophers?: unknown }).philosophers
    if (Array.isArray(maybe)) return maybe as Philosopher[]
  }
  return []
}

const philosophers: Philosopher[] = normalizePhilosophers(philosophersJson)

export function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(AnswerKey | null)[]>(
    Array(quizData.questions.length).fill(null)
  )
  const [showResults, setShowResults] = useState(false)

  const scores = useMemo(() => {
    const counts: Record<AnswerKey, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 }
    for (const a of answers) {
      if (a) counts[a]++
    }
    return counts
  }, [answers])

  // ✅ Explicit return type avoids "never"
  const matchedPhilosopher = useMemo<Philosopher | null>(() => {
    if (!showResults) return null

    const userCode = answers.map((a) => a ?? "").join("")
    let bestMatch: Philosopher | null = null
    let bestScore = -1

    for (const p of philosophers) {
      const philCode = (p.code ?? "").toUpperCase()
      let matchScore = 0

      for (let i = 0; i < Math.min(userCode.length, philCode.length); i++) {
        if (userCode[i] === philCode[i]) matchScore++
      }

      if (matchScore > bestScore) {
        bestScore = matchScore
        bestMatch = p
      }
    }

    return bestMatch
  }, [answers, showResults])

  const handleAnswer = (letter: AnswerKey) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentQuestion] = letter
      return next
    })
  }

  const handleNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((q) => q + 1)
      return
    }
    if (answers.every((a) => a !== null)) setShowResults(true)
  }

  const handlePrev = () => {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1)
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers(Array(quizData.questions.length).fill(null))
    setShowResults(false)
  }

  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100
  const question = quizData.questions[currentQuestion]

  if (showResults && matchedPhilosopher) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Your Philosophical Profile
          </h2>
          <p className="text-muted-foreground">
            Based on your answers, here is your philosophical alignment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <RadarChart
              scores={scores}
              labels={
                quizData.axisLabels as {
                  A: string
                  B: string
                  C: string
                  D: string
                  E: string
                }
              }
            />
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground mb-2">You match with</p>

              <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                {matchedPhilosopher.name}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {matchedPhilosopher.birth}
              </p>

              <blockquote className="border-l-4 border-accent pl-4 italic text-foreground mb-4">
                &ldquo;{matchedPhilosopher.quote}&rdquo;
              </blockquote>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Major Works</p>
                  <p className="text-sm text-muted-foreground">
                    {matchedPhilosopher.work}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Fun Fact</p>
                  <p className="text-sm text-muted-foreground">
                    {matchedPhilosopher["fun-desc"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Take Quiz Again
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQuestion + 1} of {quizData.questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.letter}
                onClick={() => handleAnswer(option.letter as AnswerKey)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                  answers[currentQuestion] === (option.letter as AnswerKey)
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary"
                )}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-primary font-medium mr-3">
                  {option.letter}
                </span>
                {option.text}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors",
            currentQuestion === 0
              ? "text-muted-foreground cursor-not-allowed"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={answers[currentQuestion] === null}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-colors",
            answers[currentQuestion] === null
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {currentQuestion === quizData.questions.length - 1 ? "See Results" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
