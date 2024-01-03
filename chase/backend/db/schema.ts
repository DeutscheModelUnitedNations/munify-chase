import { char, date, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const idLength = 20;
// exclude chars that may be misinterpreted in some fonts in case anyone will actually manually type these things some time
const nanoid = customAlphabet(
  "23456789ABCDEFGHKLMNPQRSTUVWXYZabcdefghklmnpqrstuvwxyz",
  idLength,
);

export const base = {
  id: char("id", { length: idLength }).primaryKey().$defaultFn(nanoid),
};

export const conferences = pgTable("conferences", {
    ...base,
    name: varchar("name"),
    start: date("start"),
    end: date("end"),
  });
  
  export const committees = pgTable(
    "committees",
    {
      ...base,
      name: varchar("name"),
      abbreviation: varchar("abbreviation"),
      conferenceId: varchar("conference").references(() => conferences.id),
    },
    (t) => ({
      name: unique().on(t.conferenceId, t.name),
    }),
  );
  