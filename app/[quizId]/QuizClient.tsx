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
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6">
        <section className="w-full max-w-xl rounded-2xl bg-white p-6 text-center shadow-lg sm:p-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
            Quiz ferdig
          </p>

          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{quizName}</h1>

          <p className="mb-2 text-5xl font-bold sm:text-6xl">
            {score}/{questions.length}
          </p>

          <p className="mb-8 text-base text-gray-600 sm:text-lg">
            Du fikk {percentage}% riktig.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 sm:w-auto sm:py-3"
          >
            Start ny quiz
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-5 sm:px-6 sm:py-10">
      <section className="mx-auto flex min-h-[calc(100vh-40px)] w-full max-w-3xl flex-col">
        <div className="pt-6 text-center sm:pt-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
            Spørsmål {currentQuestionIndex + 1} av {questions.length}
          </p>

          <h1 className="mx-auto max-w-2xl text-2xl font-bold leading-tight text-gray-900 sm:text-4xl">
            {currentQuestion.name}
          </h1>
        </div>

        <div className="mt-8 grid w-full flex-1 content-start gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
          {currentQuestion.answers.map((answer) => {
            const shouldShowResult = selectedAnswerId !== null;

            let answerClass =
              "border-gray-300 bg-white hover:border-gray-500 active:scale-[0.99]";

            if (shouldShowResult && answer.correct) {
              answerClass = "border-green-500 bg-green-50 text-green-800";
            }

            if (shouldShowResult && !answer.correct) {
              answerClass = "border-red-500 bg-red-50 text-red-800";
            }

            return (
              <button
                key={answer.id}
                type="button"
                onClick={() => handleAnswerClick(answer)}
                disabled={selectedAnswerId !== null}
                className={`min-h-16 rounded-2xl border-2 p-4 text-left text-base font-medium shadow-sm transition sm:min-h-24 sm:p-5 sm:text-lg ${answerClass}`}
              >
                {answer.text}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="sticky bottom-0 mt-6 bg-gray-50 pb-4 pt-4 text-center sm:static sm:mt-8 sm:bg-transparent sm:pb-0">
            <p
              className={`mb-4 text-base font-semibold sm:text-lg ${
                selectedAnswer.correct ? "text-green-600" : "text-red-600"
              }`}
            >
              {selectedAnswer.correct ? "Riktig!" : "Feil."}
            </p>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800 sm:w-auto sm:py-3"
            >
              {currentQuestionIndex === questions.length - 1
                ? "Vis resultat"
                : "Neste spørsmål"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}