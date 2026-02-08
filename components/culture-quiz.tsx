"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { text: string; correct: boolean };
type Question = { question: string; note: string; options: Option[] };

export function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function CultureQuiz({
  data,
  onBack,
}: {
  data: any;
  onBack?: () => void;
}) {
  const [cultureQuestions] = useState<Question[]>(() => data?.questions ?? []);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // store selected option object (not index)
  const [answers, setAnswers] = useState<(Option | null)[]>(
    () => Array((data?.questions ?? []).length).fill(null)
  );

  const [showResults, setShowResults] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const question = cultureQuestions[currentQuestion];

  // shuffle options ONCE per question change (stable while answering)
  const shuffledOptions = useMemo(() => {
    return shuffleArray(question?.options ?? []);
  }, [currentQuestion]);

  const score = useMemo(() => {
    return answers.reduce((acc, ans) => acc + (ans?.correct ? 1 : 0), 0);
  }, [answers]);

  const handleAnswer = (option: Option) => {
    if (answers[currentQuestion] !== null) return;

    const next = [...answers];
    next[currentQuestion] = option;
    setAnswers(next);
    setShowFeedback(true);
  };

  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestion < cultureQuestions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      const prevIdx = currentQuestion - 1;
      setShowFeedback(answers[prevIdx] !== null);
      setCurrentQuestion(prevIdx);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers(Array(cultureQuestions.length).fill(null));
    setShowResults(false);
    setShowFeedback(false);
  };

  const progress =
    cultureQuestions.length > 0
      ? ((currentQuestion + 1) / cultureQuestions.length) * 100
      : 0;

  if (!question) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">No questions found.</p>
      </div>
    );
  }

  if (showResults) {
    const percentage =
      cultureQuestions.length > 0
        ? Math.round((score / cultureQuestions.length) * 100)
        : 0;

    let message = "";
    if (percentage >= 80) message = "Excellent! You are a true connaisseur of French culture!";
    else if (percentage >= 60) message = "Well done! You have solid knowledge of French heritage.";
    else if (percentage >= 40) message = "Not bad! There is always more to discover about France.";
    else message = "Keep exploring! French culture has so much to offer.";

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto px-4 py-8"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="mb-6 inline-flex items-center gap-2 text-sm text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to quiz list
          </button>
        )}

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
              const userAnswer = answers[idx];
              const isCorrect = !!userAnswer?.correct;

              const correctText = q.options.find((o) => o.correct)?.text;

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
                      {userAnswer ? userAnswer.text : "Not answered"}
                      {!isCorrect && userAnswer && correctText && (
                        <span className="text-green-600 ml-2">
                          (Correct: {correctText})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
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
    );
  }

  const selected = answers[currentQuestion];
  const canGoNext = selected !== null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm text-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to quiz list
        </button>
      )}

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQuestion + 1} of {cultureQuestions.length}
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
            {shuffledOptions.map((option, index) => {
              const isSelected =
                !!selected &&
                selected.text === option.text &&
                selected.correct === option.correct;

              const isCorrect = option.correct;
              const showCorrectness = showFeedback && selected !== null;

              return (
                <button
                  key={`${option.text}-${index}`}
                  onClick={() => handleAnswer(option)}
                  disabled={selected !== null}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                    showCorrectness && isCorrect
                      ? "border-green-500 bg-green-500/10 text-foreground"
                      : showCorrectness && isSelected && !isCorrect
                      ? "border-red-500 bg-red-500/10 text-foreground"
                      : isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-secondary",
                    selected !== null && "cursor-default"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-8 h-8 rounded-lg mr-3 font-medium",
                      showCorrectness && isCorrect
                        ? "bg-green-500/20 text-green-700"
                        : showCorrectness && isSelected && !isCorrect
                        ? "bg-red-500/20 text-red-700"
                        : "bg-secondary text-primary"
                    )}
                  >
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
              );
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
          disabled={!canGoNext}
          className={cn(
            "flex items-center gap-2 px-6 py-2 rounded-xl font-medium transition-colors",
            !canGoNext
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          {currentQuestion === cultureQuestions.length - 1 ? "See Results" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
