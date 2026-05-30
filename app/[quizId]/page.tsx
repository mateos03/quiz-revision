import db from "@/src";
import { answerTable, questionTable, quizTable } from "@/src/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import QuizClient from "./QuizClient";

type QuizProps = {
  params: Promise<{
    quizId: string;
  }>;
};

export default async function Page({ params }: QuizProps) {
  const { quizId } = await params;
  const id = Number(quizId);

  if (Number.isNaN(id)) {
    notFound();
  }

  const [quiz] = await db
    .select()
    .from(quizTable)
    .where(eq(quizTable.id, id));

  if (!quiz) {
    notFound();
  }

  const questions = await db
    .select()
    .from(questionTable)
    .where(eq(questionTable.quiz_id, id))
    .orderBy(sql`random()`);

  const questionIds = questions.map((q) => q.id);

  if (questionIds.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-xl font-semibold">This quiz has no questions.</p>
      </main>
    );
  }

  const answers = await db
    .select({
      id: answerTable.id,
      text: answerTable.text,
      correct: answerTable.correct,
      question_id: answerTable.question_id,
    })
    .from(answerTable)
    .where(inArray(answerTable.question_id, questionIds))
    .orderBy(sql`random()`);

  const quizData = questions.map((question) => ({
    id: question.id,
    name: question.name,
    answers: answers.filter((answer) => answer.question_id === question.id),
  }));

  return <QuizClient quizName={quiz.name} questions={quizData} />;
}