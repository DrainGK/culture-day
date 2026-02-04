"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ArrowLeft, ArrowRight, RotateCcw, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const cultureQuestions = [
  {
    question: "Which French author wrote 'Les Misérables'?",
    options: [
      { text: "Victor Hugo", correct: true },
      { text: "Gustave Flaubert", correct: false },
      { text: "Emile Zola", correct: false },
      { text: "Alexandre Dumas", correct: false }
    ],
    note: "Victor Hugo wrote Les Misérables in 1862, one of the longest novels in European literature."
  },
  {
    question: "In what year was the French Revolution?",
    options: [
      { text: "1789", correct: true },
      { text: "1776", correct: false },
      { text: "1804", correct: false },
      { text: "1815", correct: false }
    ],
    note: "The French Revolution began in 1789 with the storming of the Bastille on July 14th."
  },
  {
    question: "Who painted 'Liberty Leading the People'?",
    options: [
      { text: "Eugene Delacroix", correct: true },
      { text: "Jacques-Louis David", correct: false },
      { text: "Claude Monet", correct: false },
      { text: "Pierre-Auguste Renoir", correct: false }
    ],
    note: "Delacroix painted this masterpiece in 1830 to commemorate the July Revolution."
  },
  {
    question: "Which French king was known as the 'Sun King'?",
    options: [
      { text: "Louis XIV", correct: true },
      { text: "Louis XVI", correct: false },
      { text: "Napoleon Bonaparte", correct: false },
      { text: "Charles de Gaulle", correct: false }
    ],
    note: "Louis XIV reigned for 72 years, the longest of any European monarch."
  },
  {
    question: "What is the French national motto?",
    options: [
      { text: "Liberté, Égalité, Fraternité", correct: true },
      { text: "Vive la France", correct: false },
      { text: "Pour la Patrie", correct: false },
      { text: "Honneur et Fidélité", correct: false }
    ],
    note: "This motto emerged during the French Revolution and became the national motto in 1880."
  },
  {
    question: "Which scientist discovered radioactivity in Paris?",
    options: [
      { text: "Henri Becquerel", correct: true },
      { text: "Louis Pasteur", correct: false },
      { text: "Pierre Curie", correct: false },
      { text: "Antoine Lavoisier", correct: false }
    ],
    note: "Becquerel discovered radioactivity in 1896, leading to Marie Curie's groundbreaking research."
  },
  {
    question: "What French monument was a gift to the United States?",
    options: [
      { text: "Statue of Liberty", correct: true },
      { text: "Washington Monument", correct: false },
      { text: "Lincoln Memorial", correct: false },
      { text: "Empire State Building", correct: false }
    ],
    note: "Designed by Frédéric Auguste Bartholdi, it was dedicated in 1886."
  },
  {
    question: "Which French philosopher said 'I think, therefore I am'?",
    options: [
      { text: "René Descartes", correct: true },
      { text: "Jean-Paul Sartre", correct: false },
      { text: "Michel Foucault", correct: false },
      { text: "Voltaire", correct: false }
    ],
    note: "Descartes wrote this famous phrase in 'Discourse on the Method' (1637)."
  },
  {
    question: "What is the largest museum in the world located in Paris?",
    options: [
      { text: "The Louvre", correct: true },
      { text: "Musée d'Orsay", correct: false },
      { text: "Centre Pompidou", correct: false },
      { text: "Musée Rodin", correct: false }
    ],
    note: "The Louvre holds over 380,000 objects and displays 35,000 works of art."
  },
  {
    question: "Which French invention revolutionized communication?",
    options: [
      { text: "The telegraph (Chappe)", correct: true },
      { text: "The telephone", correct: false },
      { text: "The radio", correct: false },
      { text: "The printing press", correct: false }
    ],
    note: "Claude Chappe invented the optical telegraph in 1792, enabling rapid communication across France."
  }
]

export function CultureQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(cultureQuestions.length).fill(null)
  )
  const [showResults, setShowResults] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)

  const score = useMemo(() => {
    let correct = 0
    answers.forEach((answerIdx, qIdx) => {
      if (answerIdx !== null && cultureQuestions[qIdx].options[answerIdx].correct) {
        correct++
      }
    })
    return correct
  }, [answers])

  const handleAnswer = (optionIndex: number) => {
    if (answers[currentQuestion] !== null) return
    
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex
    setAnswers(newAnswers)
    setShowFeedback(true)
  }

  const handleNext = () => {
    setShowFeedback(false)
    if (currentQuestion < cultureQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setShowFeedback(answers[currentQuestion - 1] !== null)
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleReset = () => {
    setCurrentQuestion(0)
    setAnswers(Array(cultureQuestions.length).fill(null))
    setShowResults(false)
    setShowFeedback(false)
  }

  const progress = ((currentQuestion + 1) / cultureQuestions.length) * 100
  const question = cultureQuestions[currentQuestion]

  if (showResults) {
    const percentage = Math.round((score / cultureQuestions.length) * 100)
    let message = ""
    if (percentage >= 80) message = "Excellent! You are a true connoisseur of French culture!"
    else if (percentage >= 60) message = "Well done! You have solid knowledge of French heritage."
    else if (percentage >= 40) message = "Not bad! There is always more to discover about France."
    else message = "Keep exploring! French culture has so much to offer."

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <span className="text-4xl font-heading font-bold text-primary">
              {score}/{cultureQuestions.length}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Quiz Complete!
          </h2>
          <p className="text-lg text-muted-foreground">{message}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
          <h3 className="text-lg font-bold text-foreground mb-4">Your Answers</h3>
          <div className="space-y-3">
            {cultureQuestions.map((q, idx) => {
              const userAnswer = answers[idx]
              const isCorrect = userAnswer !== null && q.options[userAnswer].correct
              return (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-foreground font-medium">{q.question}</p>
                    <p className="text-muted-foreground">
                      {userAnswer !== null ? q.options[userAnswer].text : "Not answered"} 
                      {!isCorrect && userAnswer !== null && (
                        <span className="text-green-600 ml-2">
                          (Correct: {q.options.find(o => o.correct)?.text})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
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
          <span>Question {currentQuestion + 1} of {cultureQuestions.length}</span>
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
            {question.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index
              const isCorrect = option.correct
              const showCorrectness = showFeedback && answers[currentQuestion] !== null

              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={answers[currentQuestion] !== null}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                    showCorrectness && isCorrect
                      ? "border-green-500 bg-green-500/10 text-foreground"
                      : showCorrectness && isSelected && !isCorrect
                      ? "border-red-500 bg-red-500/10 text-foreground"
                      : isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary",
                    answers[currentQuestion] !== null && "cursor-default"
                  )}
                >
                  <span className={cn(
                    "inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-medium",
                    showCorrectness && isCorrect
                      ? "bg-green-500/20 text-green-700"
                      : showCorrectness && isSelected && !isCorrect
                      ? "bg-red-500/20 text-red-700"
                      : "bg-secondary text-primary"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text}
                  {showCorrectness && isCorrect && (
                    <CheckCircle className="inline ml-2 h-5 w-5 text-green-500" />
                  )}
                  {showCorrectness && isSelected && !isCorrect && (
                    <XCircle className="inline ml-2 h-5 w-5 text-red-500" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Feedback Note */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-secondary rounded-xl"
            >
              <p className="text-sm text-foreground">
                <span className="font-bold">Did you know?</span> {question.note}
              </p>
            </motion.div>
          )}
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
          {currentQuestion === cultureQuestions.length - 1 ? "See Results" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
