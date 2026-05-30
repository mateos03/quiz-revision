import { parse } from "csv-parse/sync";
import db from "./index";
import { quizTable, questionTable, answerTable } from "./db/schema";

type CsvRow = {
  question: string;
  answer: string;
  correct: string;
};

function parseCorrect(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return ["true", "1", "yes", "y"].includes(normalized);
}

export async function createQuizFromCsv(file: File, quizName: string) {
  const csvText = await file.text();

  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CsvRow[];

  if (rows.length === 0) {
    throw new Error("CSV file is empty.");
  }

  const questionsMap = new Map<
    string,
    {
      question: string;
      answers: {
        text: string;
        correct: boolean;
      }[];
    }
  >();

  for (const row of rows) {
    if (!row.question || !row.answer) {
      throw new Error("Each row must have a question and an answer.");
    }

    const questionText = row.question.trim();
    const answerText = row.answer.trim();
    const isCorrect = parseCorrect(row.correct ?? "");

    if (!questionsMap.has(questionText)) {
      questionsMap.set(questionText, {
        question: questionText,
        answers: [],
      });
    }

    questionsMap.get(questionText)!.answers.push({
      text: answerText,
      correct: isCorrect,
    });
  }

  for (const question of questionsMap.values()) {
    const correctAnswers = question.answers.filter((answer) => answer.correct);

    if (correctAnswers.length !== 1) {
      throw new Error(
        `Question "${question.question}" must have exactly one correct answer.`
      );
    }
  }

  const result = await db.transaction(async (tx) => {
    const [quiz] = await tx
      .insert(quizTable)
      .values({
        name: quizName,
      })
      .returning({
        id: quizTable.id,
      });

    for (const question of questionsMap.values()) {
      const [createdQuestion] = await tx
        .insert(questionTable)
        .values({
          name: question.question,
          quiz_id: quiz.id,
        })
        .returning({
          id: questionTable.id,
        });

      await tx.insert(answerTable).values(
        question.answers.map((answer) => ({
          text: answer.text,
          correct: answer.correct,
          question_id: createdQuestion.id,
        }))
      );
    }

    return {
      quizId: quiz.id,
      questionCount: questionsMap.size,
      answerCount: rows.length,
    };
  });

  return result;
}