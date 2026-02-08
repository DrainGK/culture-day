"use client";

import React, { useState } from "react";
import cultureQuizData from "@/data/culture-quiz.json";
import { CultureQuiz } from "./culture-quiz";
import { Search, Castle, Volleyball, FlaskConical, BookMarked } from "lucide-react";

const categories = [
  { name: "All", icon: Search },
  { name: "history", icon: Castle },
  { name: "literature", icon: BookMarked },
  { name: "sport", icon: Volleyball },
  { name: "science", icon: FlaskConical },
];

export const QuizSelection = () => {
  const quizSelection = cultureQuizData.quiz; // or cultureQuizData.quizzes depending on your JSON
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

  if (selectedQuiz) {
    return (
      <CultureQuiz
        data={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="space-y-3 max-w-2xl mx-auto px-4 py-8">
      {quizSelection.map((quiz: any) => {
        const category =
          categories.find((c) => c.name === String(quiz.category).toLowerCase()) ?? categories[0];
        const Icon = category.icon;

        return (
          <button
            key={quiz.id}
            onClick={() => setSelectedQuiz(quiz)}
            className="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer"
          >
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-primary font-medium mr-3">
              <Icon className="h-4 w-4" />
            </span>
            <span>{quiz.title}</span>
          </button>
        );
      })}
    </div>
  );
};
