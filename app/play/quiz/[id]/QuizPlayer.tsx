// app/play/quiz/[id]/QuizPlayer.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Choice {
  id: number;
  text: string;
  index: number;
}

interface Question {
  id: number;
  question: string;
  options: Choice[];
  correctAnswer: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

interface QuizPlayerProps {
  quiz: Quiz;
}

export default function QuizPlayer({ quiz }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(quiz.questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert selected answer indices to choice IDs
      const choiceIds = selectedAnswers.map((answerIndex, questionIndex) => {
        if (answerIndex === -1) return null;
        const question = quiz.questions[questionIndex];
        return question.options[answerIndex].id;
      });

      const response = await fetch(`/api/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz.id,
          choiceIds: choiceIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const result = await response.json();
      // Redirect to results page or back to quiz list with success message
      router.push(`/quiz?message=completed&score=${result.score}&total=${quiz.questions.length}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <Card className="max-w-md shadow-xl border-0">
          <CardHeader className="bg-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => router.back()} className="w-full">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnsweredCurrent = selectedAnswers[currentQuestion] !== -1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm font-medium text-blue-600">{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8 shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <CardTitle className="text-xl font-bold text-white leading-relaxed">{currentQ.question}</CardTitle>
          </div>
          <CardContent className="p-8">
            <div className="space-y-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
                    selectedAnswers[currentQuestion] === index ? "border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md" : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold mr-4 transition-colors ${selectedAnswers[currentQuestion] === index ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-800 font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0} className="px-8 py-3 font-medium hover:bg-gray-50 disabled:opacity-50">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>

          <div className="space-x-3">
            {!isLastQuestion ? (
              <Button onClick={handleNext} disabled={!hasAnsweredCurrent} className="px-8 py-3 font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50">
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!hasAnsweredCurrent || isSubmitting} className="px-8 py-3 font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Quiz
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Question Navigator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-3">
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-110 ${
                    index === currentQuestion
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                      : selectedAnswers[index] !== -1
                      ? "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-100 text-gray-600 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-6 space-x-6 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mr-2"></div>
                <span className="text-gray-600">Current</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 mr-2"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-200 mr-2"></div>
                <span className="text-gray-600">Unanswered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
