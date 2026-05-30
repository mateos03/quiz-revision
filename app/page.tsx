import db from "@/src";
import { importQuizAction } from "./actions"
import { quizTable } from "@/src/db/schema";
import Link from "next/link";

export default async function Home() {

  const allQuizzes = await db.select().from(quizTable);

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <div className="my-3 pb-3 border-b text-xl">
        Velkommen til quiz-app. Velg en quiz å spille, eller lag en ny...
      </div>
      <ul className="border-b mb-4 pb-3">
        {allQuizzes.map((quiz) => (
          <li className="text-lg p-2 border rounded-md bg-slate-200 hover:bg-slate-300 cursor-pointer" key={quiz.id}><Link href={`/${quiz.id}`}>{quiz.name}</Link></li>
        ))}
      </ul>
      <div className="">
        <form action={importQuizAction}>
          <input
            className="border mr-2 rounded-md p-1"
            name="quizName"
            placeholder="Quiz name"
            required
          />

          <label
            htmlFor="csv-file"
            className="inline-flex w-fit cursor-pointer items-center rounded-md border border-black p-1 bg-gray-200 hover:bg-gray-300 mr-2"
          >
            Velg .csv fil
          </label>

          <input
            id="csv-file"
            name="file"
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            required
          />

          <button className="border rounded-md p-1 bg-green-300 cursor-pointer hover:bg-green-400" type="submit">Importer quiz</button>
        </form>
      </div>
      <div>
        PS: BRUK CHAT TIL Å LAGE FIL. csv-filen må inneholde felter i denne rekkefølgen, question, answer, correct
      </div>
      
    </div>
  );
}
