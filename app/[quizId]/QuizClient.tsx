"use client";

import { useState } from "react";

type Answer = {
  id: number;
  text: string;
  correct: boolean;
  question_id: number;
};

type Question = {
  id: number;
  name: string;
  answers: Answer[];
};

type QuizClientProps = {
  quizName: string;
  questions: Question[];
};

export default function QuizClient({ quizName, questions }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = currentQuestion.answers.find(
    (answer) => answer.id === selectedAnswerId
  );

  function handleAnswerClick(answer: Answer) {
    if (selectedAnswerId !== null) return;

    setSelectedAnswerId(answer.id);

    if (answer.correct) {
      setScore((currentScore) => currentScore + 1);
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex === questions.length - 1) {
      setFinished(true);
      return;
    }

    setCurrentQuestionIndex((index) => index + 1);
    setSelectedAnswerId(null);
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <section className="w-full max-w-2xl rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Quiz complete
          </p>

          <h1 className="mb-6 text-3xl font-bold">{quizName}</h1>

          <p className="mb-2 text-5xl font-bold">
            {score}/{questions.length}
          </p>

          <p className="mb-8 text-lg text-gray-600">
            You scored {percentage}%.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Start new quiz
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <section className="mx-auto flex min-h-[75vh] w-full max-w-3xl flex-col items-center justify-start pt-20">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-4xl">
            {currentQuestion.name}
          </h1>
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-2">
          {currentQuestion.answers.map((answer) => {
            const shouldShowResult = selectedAnswerId !== null;

            let borderClass = "border-gray-300 hover:border-gray-500";

            if (shouldShowResult && answer.correct) {
              borderClass = "border-green-500 bg-green-50";
            }

            if (shouldShowResult && !answer.correct) {
              borderClass = "border-red-500 bg-red-50";
            }

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswerId !== null}
                className={`rounded-2xl border-2 bg-white p-5 text-left text-lg font-medium shadow-sm transition ${borderClass}`}
              >
                {answer.text}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="mt-8 text-center">
            <p
              className={`mb-4 text-lg font-semibold ${
                selectedAnswer.correct ? "text-green-600" : "text-red-600"
              }`}
            >
              {selectedAnswer.correct ? "Correct!" : "Incorrect."}
            </p>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Show summary"
                : "Next question"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}