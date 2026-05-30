import { boolean, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const quizTable = pgTable("quiz", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
});

export const questionTable = pgTable("question", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    quiz_id: integer().notNull().references(() => quizTable.id, {
        onDelete: "cascade",
    })
});

export const answerTable = pgTable("answer", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    text: varchar({ length: 255 }).notNull(),
    correct: boolean().notNull().default(false),
    question_id: integer().notNull().references(() => questionTable.id, {
        onDelete: "cascade",
    })
});
