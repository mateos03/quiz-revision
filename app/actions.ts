"use server";

import { redirect } from "next/navigation";
import { createQuizFromCsv } from "../src/importFromCSV";

export async function importQuizAction(formData: FormData) {
    const quizName = String(formData.get("quizName") ?? "").trim();
    const file = formData.get("file");

    if (!quizName) {
        throw new Error("Quiz name is required.");
    }

    if (!(file instanceof File)) {
        throw new Error("CSV file is required.");
    }

    const result = await createQuizFromCsv(file, quizName);

    redirect(`/${result.quizId}`);
}